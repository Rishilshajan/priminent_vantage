"use server";

import { simulationService } from "@/lib/student/simulation.service";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { notificationService } from "@/lib/enterprise/notification.service";
import { logServerEvent } from "@/lib/logger/server";

export async function getStudentDashboardData() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        const data = await simulationService.getDashboardData(user.id);
        return { success: true as const, data };
    } catch (error: any) {
        return { success: false as const, error: error.message || "Failed to fetch dashboard data" };
    }
}

export async function enrollInSimulation(simulationId: string) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        // 1. Fetch simulation and org details
        const { data: simulation } = await supabase
            .from('simulations')
            .select(`
                title,
                org_id,
                organizations (
                    name,
                    brand_color,
                    email_footer_text,
                    footer_text
                )
            `)
            .eq('id', simulationId)
            .single();

        if (!simulation) throw new Error("Simulation not found");

        // 2. Fetch student profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', user.id)
            .single();

        const studentName = profile ? `${profile.first_name} ${profile.last_name}` : "Student";

        // 3. Insert enrollment record
        const { error: enrollError } = await supabase
            .from('simulation_enrollments')
            .insert({
                simulation_id: simulationId,
                student_id: user.id,
                status: 'not_started',
                progress_percentage: 0
            });

        if (enrollError) throw enrollError;

        const org = Array.isArray(simulation.organizations) ? simulation.organizations[0] : (simulation.organizations as any);

        // 4. Log "Congratulatory Email" to system logs (Mock sending)
        const emailContent = `
            Congratulations ${studentName}!
            
            We are happy for you to join the course: ${simulation.title}.
            Welcome to your onboarding into this simulation.
            
            Best regards,
            The ${org?.name || 'Prominent Vantage'} Team
            
            ${org?.email_footer_text || org?.footer_text || '© 2024 Priminent Vantage'}
        `.trim();

        await supabase.from('system_logs').insert({
            action_code: 'COMM_EMAIL_SENT',
            action_category: 'CONTENT',
            actor_type: 'system',
            actor_id: 'system',
            actor_name: 'Simulation Engine',
            org_id: simulation.org_id,
            org_name: org?.name,
            target_resource_type: 'email',
            target_resource_id: profile?.email,
            message: `Enrollment confirmation email sent to ${studentName}`,
            params: {
                simulation_id: simulationId,
                simulation_title: simulation.title,
                student_id: user.id,
                email_body: emailContent
            }
        });

        // 5. Log Enrollment Activity
        await supabase.from('system_logs').insert({
            action_code: 'SIM_ENROLLMENT',
            action_category: 'CONTENT',
            actor_type: 'user',
            actor_id: user.id,
            actor_name: studentName,
            org_id: simulation.org_id,
            org_name: org?.name,
            target_resource_type: 'simulation',
            target_resource_id: simulationId,
            message: `${studentName} enrolled in ${simulation.title}`,
            params: {
                simulation_id: simulationId,
                simulation_title: simulation.title
            }
        });

        // 6. Trigger Admin Notification
        await notificationService.triggerEventNotification(
            'enrollment',
            simulation.org_id,
            studentName,
            simulation.title
        );

        revalidatePath('/student/dashboard');
        revalidatePath('/student/simulations');
        revalidatePath(`/student/simulations/${simulationId}/preview`);

        return { success: true as const, simulationId, message: "Successfully enrolled in simulation!" };
    } catch (error: any) {
        console.error("Enrollment failed:", error);
        return { success: false as const, error: error.message || "Failed to enroll in simulation" };
    }
}

export async function getSimulationLibrary(industry?: string) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        const data = await simulationService.getLibraryData(user.id, industry);
        return { success: true as const, data };
    } catch (error: any) {
        return { success: false as const, error: error.message || "Failed to fetch library simulations" };
    }
}

export async function getMySimulationsAction() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        const data = await simulationService.getMySimulations(user.id);
        return { success: true as const, data };
    } catch (error: any) {
        return { success: false as const, error: error.message || "Failed to fetch your simulations" };
    }
}

export async function getSimulationDetailsAction(simulationId: string) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        const data = await simulationService.getSimulationDetails(user.id, simulationId);
        return { success: true as const, data };
    } catch (error: any) {
        return { success: false as const, error: error.message || "Failed to fetch simulation details" };
    }
}

export async function joinByAccessCode(accessCode: string) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        const normalizedCode = accessCode.trim().toUpperCase();
        if (!normalizedCode) return { success: false as const, error: "Access code is required" };

        // 1. Find simulation by access code
        const { data: simulation, error: simError } = await supabase
            .from('simulations')
            .select('id, title, status')
            .eq('access_code', normalizedCode)
            .single();

        if (simError || !simulation) {
            return { success: false as const, error: "Invalid access code. Please check and try again." };
        }

        if (simulation.status !== 'published') {
            return { success: false as const, error: "This simulation is not currently open for enrollment." };
        }

        // 2. Check if already enrolled
        const { data: existing } = await supabase
            .from('simulation_enrollments')
            .select('id')
            .eq('simulation_id', simulation.id)
            .eq('student_id', user.id)
            .single();

        if (existing) {
            return { success: true as const, simulationId: simulation.id, message: "You are already enrolled in this simulation." };
        }

        // 3. Use existing enrollInSimulation logic
        return await enrollInSimulation(simulation.id);
    } catch (error: any) {
        console.error("Join by code failed:", error);
        return { success: false as const, error: error.message || "Failed to join simulation" };
    }
}
