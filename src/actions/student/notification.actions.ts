"use server"

import { createClient } from "@/lib/supabase/server";

export async function fetchStudentNotificationsAction(limit: number = 5) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        // For now, we fetch the most recent simulations as "notifications" 
        // to simulate "New Simulation Added" events.
        const { data: simulations, error } = await supabase
            .from('simulations')
            .select(`
                id,
                title,
                created_at,
                industry,
                org_id
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        // Transform simulations into notification-like objects
        const notifications = simulations.map(sim => ({
            id: sim.id,
            type: 'NEW_SIMULATION',
            title: 'New Simulation Available',
            content: `${sim.title} is now available in the ${sim.industry || 'General'} category.`,
            created_at: sim.created_at,
            metadata: { simulationId: sim.id }
        }));

        return { success: true, notifications };
    } catch (error: any) {
        console.error("Failed to fetch notifications:", error);
        return { success: false, error: error.message };
    }
}

export async function fetchStudentNotificationsCountAction() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { count: 0 };

        // For demo purposes, we'll return a count of 2 if there are any simulations
        const { count, error } = await supabase
            .from('simulations')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        return { count: count ? Math.min(count, 3) : 0 }; // Just show 3 for now
    } catch (error) {
        return { count: 0 };
    }
}
