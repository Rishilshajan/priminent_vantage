"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { notificationService } from "@/lib/enterprise/notification.service";
import { uploadToS3 } from "@/lib/s3";

export async function uploadTaskFileAction(formData: FormData) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        const file = formData.get('file') as File;
        const simulationId = formData.get('simulationId') as string;
        const taskId = formData.get('taskId') as string;

        if (!file) return { success: false as const, error: "No file provided" };

        const { data: profile } = await supabase
            .from('profiles')
            .select('org_id')
            .eq('id', user.id)
            .single();

        const orgId = profile?.org_id || 'system';
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

        const { url } = await uploadToS3({
            file,
            fileName,
            folder: 'submissions',
            orgId,
            simulationId,
            taskId
        });

        return { success: true as const, url };
    } catch (error: any) {
        console.error("Error uploading task file:", error);
        return { success: false as const, error: error.message || "Failed to upload file" };
    }
}
export async function submitTaskAction(simulationId: string, taskId: string, submissionData: any) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        // 1. Fetch Task Details to check for MCQ and calculate score
        const { data: task } = await supabase
            .from('simulation_tasks')
            .select('submission_type, quiz_data')
            .eq('id', taskId)
            .single();

        let finalSubmissionData = { ...submissionData };

        if (task?.submission_type === 'mcq' && task.quiz_data) {
            const quizData = task.quiz_data as any[];
            let correctCount = 0;
            const answers = submissionData.answers || submissionData;

            quizData.forEach((q, idx) => {
                if (answers[idx] === q.answer?.toString()) {
                    correctCount++;
                }
            });

            const score = quizData.length > 0 ? Math.round((correctCount / quizData.length) * 100) : 0;
            finalSubmissionData = {
                answers: answers,
                score: score,
                correctCount,
                totalQuestions: quizData.length
            };
        }

        // 2. Insert or Upsert Submission
        const { error: submissionError } = await supabase
            .from('simulation_task_submissions')
            .upsert({
                student_id: user.id,
                task_id: taskId,
                simulation_id: simulationId,
                submission_data: finalSubmissionData,
                status: 'submitted',
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'student_id,task_id'
            });

        if (submissionError) throw submissionError;

        // 2. Fetch all tasks to calculate progress
        const { data: tasks } = await supabase
            .from('simulation_tasks')
            .select('id')
            .eq('simulation_id', simulationId);

        const { data: submissions } = await supabase
            .from('simulation_task_submissions')
            .select('id')
            .eq('simulation_id', simulationId)
            .eq('student_id', user.id);

        const totalTasks = tasks?.length || 1;
        const completedTasks = submissions?.length || 0;
        const progress = Math.round((completedTasks / totalTasks) * 100);

        // 3. Update Enrollment Progress
        await supabase
            .from('simulation_enrollments')
            .update({
                progress_percentage: progress,
                status: progress === 100 ? 'completed' : 'in_progress',
                updated_at: new Date().toISOString()
            })
            .eq('student_id', user.id)
            .eq('simulation_id', simulationId);

        // 4. Log Activity
        await supabase.from('system_logs').insert({
            action_code: 'SIM_TASK_SUBMITTED',
            action_category: 'CONTENT',
            actor_type: 'user',
            actor_id: user.id,
            target_resource_type: 'simulation_task',
            target_resource_id: taskId,
            message: `Task submission received for simulation ${simulationId}`,
            params: {
                simulation_id: simulationId,
                task_id: taskId,
                progress_percentage: progress
            }
        });

        // 5. Trigger Completion Notification if applicable
        if (progress === 100) {
            // Fetch names for notification
            const { data: profile } = await supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single();
            const { data: sim } = await supabase.from('simulations').select('title, org_id').eq('id', simulationId).single();

            if (profile && sim) {
                await notificationService.triggerEventNotification(
                    'completion',
                    sim.org_id,
                    `${profile.first_name} ${profile.last_name}`,
                    sim.title
                );
            }
        }

        revalidatePath(`/student/simulations/${simulationId}/hub`);
        revalidatePath('/student/dashboard');

        return { success: true as const, progress };
    } catch (error: any) {
        console.error("Task submission failed:", error);
        return { success: false as const, error: error.message || "Failed to submit task" };
    }
}

export async function completeSimulationAction(simulationId: string) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        // 1. Fetch simulation and profile details
        const { data: sim, error: simError } = await supabase
            .from('simulations')
            .select(`
                title, 
                org_id,
                simulation_skills (
                    skill_name
                )
            `)
            .eq('id', simulationId)
            .single();

        if (simError || !sim) {
            console.error("Simulation completion fetch error:", simError);
            throw new Error("Simulation not found or access denied");
        }

        const skills = sim.simulation_skills || [];

        // Fetch enrollment ID
        const { data: enrollment, error: enrollError } = await supabase
            .from('simulation_enrollments')
            .select('id')
            .eq('student_id', user.id)
            .eq('simulation_id', simulationId)
            .single();

        if (enrollError || !enrollment) throw new Error("Enrollment not found");

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) throw new Error("Profile not found");

        const studentName = `${profile.first_name} ${profile.last_name}`;

        // 2. Check if already completed and get certificate
        const { data: existingCert } = await supabase
            .from('simulation_certificates')
            .select('*')
            .eq('student_id', user.id)
            .eq('simulation_id', simulationId)
            .single();

        if (existingCert) {
            // Fetch joined data for existing certificate
            const { data: joinedCert } = await supabase
                .from('simulation_certificates')
                .select(`
                    *,
                    simulations (
                        title,
                        program_type,
                        organizations!org_id (
                            name,
                            logo_url,
                            brand_color,
                            certificate_director_name,
                            certificate_director_title,
                            certificate_signature_url
                        )
                    )
                `)
                .eq('id', existingCert.id)
                .single();

            return {
                success: true as const,
                certificate: joinedCert || existingCert
            };
        }

        // 3. Generate Certificate ID and Record
        const certificateId = `CERT-${simulationId.slice(0, 4)}-${user.id.slice(0, 4)}-${Date.now().toString().slice(-6)}`.toUpperCase();

        const { data: certificate, error: certError } = await supabase
            .from('simulation_certificates')
            .insert({
                student_id: user.id,
                simulation_id: simulationId,
                enrollment_id: enrollment.id,
                certificate_id: certificateId,
                simulation_title: sim.title,
                student_name: studentName,
                issued_at: new Date().toISOString(),
                skills_acquired: skills.map((s: any) => s.skill_name),
                completion_date: new Date().toISOString().split('T')[0] // Required by schema
            })
            .select(`
                *,
                simulations (
                    title,
                    program_type,
                    organizations!org_id (
                        name,
                        logo_url,
                        brand_color,
                        certificate_director_name,
                        certificate_director_title,
                        certificate_signature_url
                    )
                )
            `)
            .single();

        if (certError) throw certError;

        // 4. Award Skills
        if (skills.length > 0) {
            const skillInserts = skills.map((s: any) => ({
                user_id: user.id,
                skill_name: s.skill_name,
                proficiency_level: 'Intermediate', // Default level for completions
            }));

            // Upsert skills to handle replicates
            await supabase
                .from('candidate_skills')
                .upsert(skillInserts, { onConflict: 'user_id,skill_name' });
        }

        // 5. Finalize Enrollment
        await supabase
            .from('simulation_enrollments')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                progress_percentage: 100
            })
            .eq('student_id', user.id)
            .eq('simulation_id', simulationId);

        revalidatePath('/student/skills');
        revalidatePath('/student/dashboard');

        return { success: true as const, certificate };
    } catch (error: any) {
        console.error("Simulation completion failed:", error);
        return { success: false as const, error: error.message || "Failed to complete simulation" };
    }
}
