"use server";

import { simulationService } from "@/lib/simulations/simulation.service";
import { assetService } from "@/lib/simulations/asset.service";
import { Simulation } from "@/lib/simulations";
import { revalidatePath } from "next/cache";

// Creates a new simulation draft and returns the created record
export async function createSimulation(data: any) {
    try {
        const simulation = await simulationService.createSimulation(data);
        return { data: simulation };
    } catch (err: any) {
        return { error: err.message || "Failed to create simulation" };
    }
}

// Updates one or more fields on an existing simulation (used for builder auto-saves and step submissions)
export async function updateSimulation(simulationId: string, data: Partial<Simulation>) {
    try {
        const updated = await simulationService.updateSimulation(simulationId, data);
        return { data: updated };
    } catch (err: any) {
        return { error: err.message || "Failed to update simulation" };
    }
}

// Fetches a single simulation record by ID, including tasks, skills, and asset URLs
export async function getSimulation(simulationId: string) {
    try {
        const simulation = await simulationService.getSimulation(simulationId);
        return { data: simulation };
    } catch (err: any) {
        return { error: err.message || "Failed to fetch simulation" };
    }
}

// Fetches all simulations belonging to the current enterprise organization
export async function getSimulations() {
    try {
        const simulations = await simulationService.getSimulations();
        return { data: simulations };
    } catch (err: any) {
        return { error: err.message || "Failed to fetch simulations" };
    }
}

// Searches simulations by title or description within the current organization
export async function searchSimulations(query: string) {
    try {
        const simulations = await simulationService.searchSimulations(query);
        return { data: simulations };
    } catch (err: any) {
        return { error: err.message || "Failed to search simulations" };
    }
}

// Validates simulation requirements and changes status to published so it appears in the student portal
export async function publishSimulation(simulationId: string) {
    try {
        const published = await simulationService.publishSimulation(simulationId);
        return { data: published };
    } catch (err: any) {
        return { error: err.message || "Failed to publish simulation" };
    }
}

// Deletes a simulation and its S3 assets, used from the simulations list view
export async function deleteSimulation(simulationId: string) {
    try {
        // Cleanup assets first
        await assetService.deleteSimulationAssets(simulationId);

        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();

        const { error: deleteError } = await supabase
            .from('simulations')
            .delete()
            .eq('id', simulationId);

        if (deleteError) throw deleteError;

        return { success: true };
    } catch (err: any) {
        return { error: err.message || "Failed to delete simulation" };
    }
}

// Alias for updateSimulation — saves the current builder state as a draft without advancing the step
export async function saveDraft(simulationId: string, data: Partial<Simulation>) {
    return updateSimulation(simulationId, data);
}

// Fetches unique tags used across the organization's simulations for search/filter UI
export async function getOrganizationTags() {
    try {
        const tags = await simulationService.getOrganizationTags();
        return { data: tags };
    } catch (err: any) {
        return { error: err.message || "Failed to fetch tags" };
    }
}
