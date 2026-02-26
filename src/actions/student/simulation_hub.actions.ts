"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { notificationService } from "@/lib/enterprise/notification.service";

export async function submitTaskAction(simulationId: string, taskId: string, submissionData: any) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        // 1. Insert or Upsert Submission
        const { error: submissionError } = await supabase
            .from('simulation_task_submissions')
            .upsert({
                student_id: user.id,
                task_id: taskId,
                simulation_id: simulationId,
                submission_data: submissionData,
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
