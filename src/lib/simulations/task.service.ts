import { createClient } from "@/lib/supabase/server";
import { logServerEvent } from "@/lib/logger/server";
import { SimulationTask, SimulationTaskSchema } from "@/lib/simulations/types";

export const taskService = {
    // Creates and inserts a new task step at the next sort order position for a simulation
    async addTask(
        simulationId: string,
        data: {
            title: string;
            description?: string;
            scenario_context?: string;
            estimated_duration?: string;
            difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
            instructions?: string;
            what_you_learn?: string[];
            what_you_do?: string;
            submission_type?: 'file_upload' | 'text' | 'mcq' | 'self_paced' | 'code_snippet';
            submission_instructions?: string;
            internal_notes?: string;
            is_required?: boolean;
        }
    ) {
        const supabase = await createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication required");

            const { count } = await supabase
                .from('simulation_tasks')
                .select('*', { count: 'exact', head: true })
                .eq('simulation_id', simulationId);

            const taskNumber = (count || 0) + 1;

            const validated = SimulationTaskSchema.parse({
                ...data,
                task_number: taskNumber,
                sort_order: taskNumber,
            });

            const { data: task, error: createError } = await supabase
                .from('simulation_tasks')
                .insert({
                    simulation_id: simulationId,
                    ...validated,
                    status: 'incomplete',
                })
                .select()
                .single();

            if (createError) throw new Error("Failed to create task");

            await logServerEvent({
                level: 'INFO',
                action: {
                    code: 'SIMULATION_TASK_CREATED',
                    category: 'CONTENT'
                },
                actor: {
                    type: 'user',
                    id: user.id
                },
                message: `Task created: ${task.title}`
            });

            return task;
        } catch (err: any) {
            throw err;
        }
    },

    // Updates allowlisted fields on an existing simulation task record
    async updateTask(taskId: string, data: Partial<SimulationTask>) {
        const supabase = await createClient();

        try {
            const { data: updated, error: updateError } = await supabase
                .from('simulation_tasks')
                .update(data)
                .eq('id', taskId)
                .select()
                .single();

            if (updateError) throw new Error("Failed to update task");

            return updated;
        } catch (err: any) {
            throw err;
        }
    },

    // Updates the sort_order of each task in parallel to reflect a new drag-and-drop ordering
    async reorderTasks(simulationId: string, taskIds: string[]) {
        const supabase = await createClient();

        try {
            const updates = taskIds.map((taskId, index) =>
                supabase
                    .from('simulation_tasks')
                    .update({ sort_order: index + 1 })
                    .eq('id', taskId)
                    .eq('simulation_id', simulationId)
            );

            await Promise.all(updates);

            return true;
        } catch (err: any) {
            throw err;
        }
    }
};
