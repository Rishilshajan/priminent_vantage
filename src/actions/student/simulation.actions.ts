"use server";

import { simulationService } from "@/lib/student/simulation.service";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

        const { error } = await supabase
            .from('simulation_enrollments')
            .insert({
                simulation_id: simulationId,
                student_id: user.id,
                status: 'not_started',
                progress_percentage: 0
            });

        if (error) throw error;

        revalidatePath('/student/dashboard');
        return { success: true as const };
    } catch (error: any) {
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
