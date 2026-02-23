import { createClient } from "@/lib/supabase/server";

export const skillService = {
    // Replaces all skills for a simulation by deleting existing and inserting the new set
    async syncSimulationSkills(simulationId: string, skills: string[]) {
        const supabase = await createClient();

        try {
            const { error: deleteError } = await supabase
                .from('simulation_skills')
                .delete()
                .eq('simulation_id', simulationId);

            if (deleteError) throw new Error("Failed to sync skills");

            if (skills.length > 0) {
                const skillRecords = skills.map(skill => ({
                    simulation_id: simulationId,
                    skill_name: skill,
                }));

                const { data: inserted, error: insertError } = await supabase
                    .from('simulation_skills')
                    .insert(skillRecords)
                    .select();

                if (insertError) throw new Error("Failed to sync skills");
                return inserted;
            }

            return [];
        } catch (err: any) {
            throw err;
        }
    },

    // Adds new skills to a simulation via upsert, preserving existing skills
    async addSkills(simulationId: string, skills: string[]) {
        const supabase = await createClient();

        try {
            const skillRecords = skills.map(skill => ({
                simulation_id: simulationId,
                skill_name: skill,
            }));

            const { data: inserted, error: insertError } = await supabase
                .from('simulation_skills')
                .upsert(skillRecords, { onConflict: 'simulation_id,skill_name', ignoreDuplicates: true })
                .select();

            if (insertError) throw new Error("Failed to add skills");

            return inserted;
        } catch (err: any) {
            throw err;
        }
    },

    // Deletes a single skill record from a simulation by simulation ID and skill name
    async removeSkill(simulationId: string, skillName: string) {
        const supabase = await createClient();

        try {
            const { error: deleteError } = await supabase
                .from('simulation_skills')
                .delete()
                .eq('simulation_id', simulationId)
                .eq('skill_name', skillName);

            if (deleteError) throw new Error("Failed to remove skill");

            return true;
        } catch (err: any) {
            throw err;
        }
    },

    // Fetches all unique skill names used across the current organization's simulations for the skill picker
    async getOrganizationSkills() {
        const supabase = await createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication required");

            const { data: membership } = await supabase
                .from('organization_members')
                .select('org_id')
                .eq('user_id', user.id)
                .single();

            if (!membership) throw new Error("No organization found");

            const { data: skills, error: skillsError } = await supabase
                .from('simulation_skills')
                .select(`
                    skill_name,
                    simulations!inner (
                        org_id
                    )
                `)
                .eq('simulations.org_id', membership.org_id);

            if (skillsError) throw new Error("Failed to fetch skills");

            const uniqueSkills = Array.from(new Set(skills.map(s => s.skill_name))).sort();

            return uniqueSkills;
        } catch (err: any) {
            throw err;
        }
    }
};
