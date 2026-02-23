"use server";

import { taskService } from "@/lib/simulations/task.service";
import { assetService } from "@/lib/simulations/asset.service";
import { SimulationTask } from "@/lib/simulations";

// Creates and appends a new task step to a simulation in the task flow builder
export async function addTask(simulationId: string, data: any) {
    try {
        const task = await taskService.addTask(simulationId, data);
        return { data: task };
    } catch (err: any) {
        return { error: err.message || "Failed to create task" };
    }
}

// Updates fields on an existing simulation task step (title, description, assets, etc.)
export async function updateTask(taskId: string, data: Partial<SimulationTask>) {
    try {
        const updated = await taskService.updateTask(taskId, data);
        return { data: updated };
    } catch (err: any) {
        return { error: err.message || "Failed to update task" };
    }
}

// Deletes a task step and removes its associated S3 assets from storage
export async function deleteTask(taskId: string) {
    try {

        // Cleanup assets for the task
        await assetService.deleteTaskAssets(taskId);

        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();

        const { error: deleteError } = await supabase
            .from('simulation_tasks')
            .delete()
            .eq('id', taskId);

        if (deleteError) throw deleteError;

        return { success: true };
    } catch (err: any) {
        return { error: err.message || "Failed to delete task" };
    }
}

// Persists a new order for a simulation's task steps after drag-and-drop reordering
export async function reorderTasks(simulationId: string, taskIds: string[]) {
    try {
        await taskService.reorderTasks(simulationId, taskIds);
        return { success: true };
    } catch (err: any) {
        return { error: err.message || "Failed to reorder tasks" };
    }
}
