"use server";

import { skillService } from "@/lib/simulations/skill.service";

// Replaces all skills for a simulation with the provided list (full replace, not incremental)
export async function syncSimulationSkills(simulationId: string, skills: string[]) {
    try {
        const data = await skillService.syncSimulationSkills(simulationId, skills);
        return { data };
    } catch (err: any) {
        return { error: err.message || "Failed to sync skills" };
    }
}

// Incrementally adds new skills to a simulation without removing existing ones
export async function addSkills(simulationId: string, skills: string[]) {
    try {
        const data = await skillService.addSkills(simulationId, skills);
        return { data };
    } catch (err: any) {
        return { error: err.message || "Failed to add skills" };
    }
}

// Removes a single skill from a simulation by name
export async function removeSkill(simulationId: string, skillName: string) {
    try {
        await skillService.removeSkill(simulationId, skillName);
        return { success: true };
    } catch (err: any) {
        return { error: err.message || "Failed to remove skill" };
    }
}

// Fetches unique skills used across all simulations in the current organization for the skills picker
export async function getOrganizationSkills() {
    try {
        const data = await skillService.getOrganizationSkills();
        return { data };
    } catch (err: any) {
        return { error: err.message || "Failed to fetch skills" };
    }
}
