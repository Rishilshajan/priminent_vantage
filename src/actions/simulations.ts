"use server";

import { createClient } from "@/lib/supabase/server";
import { logServerEvent } from "@/lib/logger-server";
import { uploadToS3, deleteFromS3, extractS3KeyFromUrl } from "@/lib/s3";
import {
    Simulation,
    SimulationTask,
    SimulationSkill,
    SimulationMetadataSchema,
    SimulationBrandingSchema,
    SimulationTaskSchema,
    canPublishSimulation,
} from "@/lib/simulations";
import { revalidatePath } from "next/cache";

// ============================================
// SIMULATION CRUD OPERATIONS
// ============================================

/**
 * Create a new simulation
 */
export async function createSimulation(data: {
    title: string;
    description?: string;
    short_description?: string;
    industry?: string;
    target_role?: string;
    duration?: string;
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    program_type?: 'job_simulation' | 'career_exploration' | 'skill_sprint' | 'case_study' | 'internship_preview';
    learning_outcomes?: string[];
    prerequisites?: string;
    target_audience?: string;
    visibility?: 'draft' | 'internal' | 'public' | 'private';
    analytics_tags?: string[];
    certificate_enabled?: boolean;
}) {
    const supabase = await createClient();

    try {
        // Validate input
        const validated = SimulationMetadataSchema.parse(data);

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // Get user's organization
        const { data: membership, error: membershipError } = await supabase
            .from('organization_members')
            .select('org_id, role')
            .eq('user_id', user.id)
            .single();

        if (membershipError || !membership) {
            return { error: "No organization found for this user" };
        }

        // Check if user has permission (admin or owner)
        if (!['admin', 'owner'].includes(membership.role)) {
            return { error: "You don't have permission to create simulations" };
        }

        // Create simulation
        const { data: simulation, error: createError } = await supabase
            .from('simulations')
            .insert({
                org_id: membership.org_id,
                created_by: user.id,
                ...validated,
                status: 'draft',
                learning_outcomes: data.learning_outcomes || [],
                prerequisites: data.prerequisites || null,
                target_audience: data.target_audience || null,
                visibility: data.visibility || 'draft',
                analytics_tags: data.analytics_tags || [],
                certificate_enabled: data.certificate_enabled !== false,
            })
            .select()
            .single();

        if (createError) {
            console.error("Create simulation error:", createError);
            return { error: "Failed to create simulation" };
        }

        await logServerEvent({
            level: 'INFO',
            action: {
                code: 'SIMULATION_CREATED',
                category: 'CONTENT'
            },
            actor: {
                type: 'user',
                id: user.id
            },
            organization: {
                org_id: membership.org_id
            },
            message: `Simulation created: ${simulation.title}`
        });

        return { data: simulation };
    } catch (err: any) {
        console.error("Create simulation error:", err);
        return { error: err.message || "Failed to create simulation" };
    }
}

/**
 * Update simulation metadata
 */
export async function updateSimulation(
    simulationId: string,
    data: Partial<Simulation>
) {
    const supabase = await createClient();

    try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // 1. Get simulation to check its organization
        const { data: simulation, error: simError } = await supabase
            .from('simulations')
            .select('org_id')
            .eq('id', simulationId)
            .single();

        if (simError || !simulation) {
            console.error("Simulation fetch error:", simError);
            return { error: "Simulation not found" };
        }

        // 2. Verify user belongs to that organization and has permissions
        const { data: membership, error: membershipError } = await supabase
            .from('organization_members')
            .select('role')
            .eq('org_id', simulation.org_id)
            .eq('user_id', user.id)
            .single();

        if (membershipError || !membership) {
            console.error("Membership verification error:", membershipError);
            return { error: "Access denied: You don't have permission to edit this simulation" };
        }

        // Check if user has permission (admin or owner)
        if (!['admin', 'owner'].includes(membership.role)) {
            return { error: "You don't have permission to edit simulations" };
        }

        // 3. Update simulation
        const { data: updated, error: updateError } = await supabase
            .from('simulations')
            .update({
                ...(data.title !== undefined && { title: data.title }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.short_description !== undefined && { short_description: data.short_description }),
                ...(data.industry !== undefined && { industry: data.industry }),
                ...(data.target_role !== undefined && { target_role: data.target_role }),
                ...(data.duration !== undefined && { duration: data.duration }),
                ...(data.difficulty_level !== undefined && { difficulty_level: data.difficulty_level }),
                ...(data.program_type !== undefined && { program_type: data.program_type }),
                ...(data.learning_outcomes !== undefined && { learning_outcomes: data.learning_outcomes }),
                ...(data.prerequisites !== undefined && { prerequisites: data.prerequisites }),
                ...(data.target_audience !== undefined && { target_audience: data.target_audience }),
                ...(data.visibility !== undefined && { visibility: data.visibility }),
                ...(data.analytics_tags !== undefined && { analytics_tags: data.analytics_tags }),
                ...(data.certificate_enabled !== undefined && { certificate_enabled: data.certificate_enabled }),
                ...(data.company_logo_url !== undefined && { company_logo_url: data.company_logo_url }),
                ...(data.banner_url !== undefined && { banner_url: data.banner_url }),
                ...(data.intro_video_url !== undefined && { intro_video_url: data.intro_video_url }),
                ...(data.about_company !== undefined && { about_company: data.about_company }),
                ...(data.why_work_here !== undefined && { why_work_here: data.why_work_here }),
                ...(data.certificate_director_name !== undefined && { certificate_director_name: data.certificate_director_name }),
                ...(data.certificate_director_title !== undefined && { certificate_director_title: data.certificate_director_title }),
                ...(data.certificate_signature_url !== undefined && { certificate_signature_url: data.certificate_signature_url }),
                ...(data.grading_criteria !== undefined && { grading_criteria: data.grading_criteria }),
                updated_at: new Date().toISOString(),
            })
            .eq('id', simulationId)
            .select()
            .single();

        if (updateError) {
            console.error("Update simulation error:", updateError);
            return { error: "Failed to update simulation" };
        }

        revalidatePath(`/enterprise/simulations/edit/${simulationId}`);

        await logServerEvent({
            level: 'INFO',
            action: {
                code: 'SIMULATION_UPDATED',
                category: 'CONTENT'
            },
            actor: {
                type: 'user',
                id: user.id
            },
            message: `Simulation updated: ${simulationId}`
        });

        return { data: updated };
    } catch (err: any) {
        console.error("Update simulation error:", err);
        return { error: err.message || "Failed to update simulation" };
    }
}

/**
 * Get simulation by ID
 */
export async function getSimulation(simulationId: string) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // Get simulation with tasks and skills
        const { data: simulation, error: simError } = await supabase
            .from('simulations')
            .select(`
                *,
                simulation_tasks (*),
                simulation_skills (*)
            `)
            .eq('id', simulationId)
            .single();

        if (simError || !simulation) {
            return { error: "Simulation not found" };
        }

        return { data: simulation };
    } catch (err: any) {
        console.error("Get simulation error:", err);
        return { error: "Failed to fetch simulation" };
    }
}

/**
 * Get all simulations for user's organization
 */
export async function getSimulations() {
    const supabase = await createClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // Get user's organization
        const { data: membership, error: membershipError } = await supabase
            .from('organization_members')
            .select('org_id')
            .eq('user_id', user.id)
            .single();

        if (membershipError || !membership) {
            return { error: "No organization found" };
        }

        // Get all simulations for the organization
        const { data: simulations, error: simError } = await supabase
            .from('simulations')
            .select(`
                *,
                simulation_tasks (count),
                simulation_skills (count)
            `)
            .eq('org_id', membership.org_id)
            .order('created_at', { ascending: false });

        if (simError) {
            console.error("Get simulations error:", simError);
            return { error: "Failed to fetch simulations" };
        }

        return { data: simulations || [] };
    } catch (err: any) {
        console.error("Get simulations error:", err);
        return { error: "Authentication required" };
    }
}
/**
 * Search simulations
 */
export async function searchSimulations(query: string) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // Get user's organization
        const { data: membership, error: membershipError } = await supabase
            .from('organization_members')
            .select('org_id')
            .eq('user_id', user.id)
            .single();

        if (membershipError || !membership) {
            return { error: "No organization found" };
        }

        const { data: simulations, error: simError } = await supabase
            .from('simulations')
            .select(`
                *,
                simulation_tasks (count),
                simulation_skills (count)
            `)
            .eq('org_id', membership.org_id)
            .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            .order('created_at', { ascending: false });

        if (simError) {
            console.error("Search simulations error:", simError);
            return { error: "Failed to search simulations" };
        }

        return { data: simulations || [] };
    } catch (err: any) {
        console.error("Search simulations error:", err);
        return { error: "Failed to search simulations" };
    }
}

/**
 * Publish a simulation
 */
export async function publishSimulation(simulationId: string) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // Get simulation with tasks
        const { data: simulation, error: simError } = await supabase
            .from('simulations')
            .select('*, simulation_tasks (*)')
            .eq('id', simulationId)
            .single();

        if (simError || !simulation) {
            return { error: "Simulation not found" };
        }

        // Validate simulation can be published
        const validation = canPublishSimulation(simulation, simulation.simulation_tasks);
        if (!validation.canPublish) {
            return { error: validation.errors.join(', ') };
        }

        // Publish simulation
        const { data: published, error: publishError } = await supabase
            .from('simulations')
            .update({
                status: 'published',
                published_at: new Date().toISOString(),
            })
            .eq('id', simulationId)
            .select()
            .single();

        if (publishError) {
            console.error("Publish simulation error:", publishError);
            return { error: "Failed to publish simulation" };
        }

        await logServerEvent({
            level: 'INFO',
            action: {
                code: 'SIMULATION_PUBLISHED',
                category: 'CONTENT'
            },
            actor: {
                type: 'user',
                id: user.id
            },
            message: `Simulation published: ${simulation.title}`
        });

        return { data: published };
    } catch (err: any) {
        console.error("Publish simulation error:", err);
        return { error: "Failed to publish simulation" };
    }
}

/**
 * Delete a simulation
 */
export async function deleteSimulation(simulationId: string) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // Get simulation with assets
        const { data: simulation, error: simError } = await supabase
            .from('simulations')
            .select('*, simulation_assets (*)')
            .eq('id', simulationId)
            .single();

        if (simError || !simulation) {
            return { error: "Simulation not found" };
        }

        // Delete all S3 assets
        for (const asset of simulation.simulation_assets) {
            const key = extractS3KeyFromUrl(asset.file_url);
            if (key) {
                await deleteFromS3(key);
            }
        }

        // Delete simulation (cascade will handle related records)
        const { error: deleteError } = await supabase
            .from('simulations')
            .delete()
            .eq('id', simulationId);

        if (deleteError) {
            console.error("Delete simulation error:", deleteError);
            return { error: "Failed to delete simulation" };
        }

        await logServerEvent({
            level: 'INFO',
            action: {
                code: 'SIMULATION_DELETED',
                category: 'CONTENT'
            },
            actor: {
                type: 'user',
                id: user.id
            },
            message: `Simulation deleted: ${simulationId}`
        });

        return { success: true };
    } catch (err: any) {
        console.error("Delete simulation error:", err);
        return { error: "Failed to delete simulation" };
    }
}

/**
 * Save draft (auto-save)
 */
export async function saveDraft(simulationId: string, data: Partial<Simulation>) {
    return updateSimulation(simulationId, data);
}

// ============================================
// TASK OPERATIONS
// ============================================

/**
 * Add a task to simulation
 */
export async function addTask(
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
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // Get current task count to determine task_number and sort_order
        const { count } = await supabase
            .from('simulation_tasks')
            .select('*', { count: 'exact', head: true })
            .eq('simulation_id', simulationId);

        const taskNumber = (count || 0) + 1;

        // Validate task data
        const validated = SimulationTaskSchema.parse({
            ...data,
            task_number: taskNumber,
            sort_order: taskNumber,
        });

        // Create task
        const { data: task, error: createError } = await supabase
            .from('simulation_tasks')
            .insert({
                simulation_id: simulationId,
                ...validated,
                status: 'incomplete',
            })
            .select()
            .single();

        if (createError) {
            console.error("Create task error:", createError);
            return { error: "Failed to create task" };
        }

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

        return { data: task };
    } catch (err: any) {
        console.error("Create task error:", err);
        return { error: err.message || "Failed to create task" };
    }
}

/**
 * Update a task
 */
export async function updateTask(taskId: string, data: Partial<SimulationTask>) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        const { data: updated, error: updateError } = await supabase
            .from('simulation_tasks')
            .update(data)
            .eq('id', taskId)
            .select()
            .single();

        if (updateError) {
            console.error("Update task error:", updateError);
            return { error: "Failed to update task" };
        }

        return { data: updated };
    } catch (err: any) {
        console.error("Update task error:", err);
        return { error: "Failed to update task" };
    }
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // Get task with assets
        const { data: task, error: taskError } = await supabase
            .from('simulation_tasks')
            .select('*, simulation_assets (*)')
            .eq('id', taskId)
            .single();

        if (taskError || !task) {
            return { error: "Task not found" };
        }

        // Delete S3 assets
        for (const asset of task.simulation_assets) {
            const key = extractS3KeyFromUrl(asset.file_url);
            if (key) {
                await deleteFromS3(key);
            }
        }

        // Delete task
        const { error: deleteError } = await supabase
            .from('simulation_tasks')
            .delete()
            .eq('id', taskId);

        if (deleteError) {
            console.error("Delete task error:", deleteError);
            return { error: "Failed to delete task" };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Delete task error:", err);
        return { error: "Failed to delete task" };
    }
}

/**
 * Reorder tasks
 */
export async function reorderTasks(simulationId: string, taskIds: string[]) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // Update sort_order for each task
        const updates = taskIds.map((taskId, index) =>
            supabase
                .from('simulation_tasks')
                .update({ sort_order: index + 1 })
                .eq('id', taskId)
                .eq('simulation_id', simulationId)
        );

        await Promise.all(updates);

        return { success: true };
    } catch (err: any) {
        console.error("Reorder tasks error:", err);
        return { error: "Failed to reorder tasks" };
    }
}

// ============================================
// SKILL OPERATIONS
// ============================================

/**
 * Sync skills (replace all)
 */
export async function syncSimulationSkills(simulationId: string, skills: string[]) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // 1. Delete existing skills
        const { error: deleteError } = await supabase
            .from('simulation_skills')
            .delete()
            .eq('simulation_id', simulationId);

        if (deleteError) {
            console.error("Delete existing skills error:", deleteError);
            return { error: "Failed to sync skills" };
        }

        // 2. Insert new skills
        if (skills.length > 0) {
            const skillRecords = skills.map(skill => ({
                simulation_id: simulationId,
                skill_name: skill,
            }));

            const { data: inserted, error: insertError } = await supabase
                .from('simulation_skills')
                .insert(skillRecords)
                .select();

            if (insertError) {
                console.error("Insert new skills error:", insertError);
                return { error: "Failed to sync skills" };
            }
            return { data: inserted };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Sync skills error:", err);
        return { error: "Failed to sync skills" };
    }
}

/**
 * Add skills to simulation (incremental)
 */
export async function addSkills(simulationId: string, skills: string[]) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // Insert skills (ignore duplicates)
        const skillRecords = skills.map(skill => ({
            simulation_id: simulationId,
            skill_name: skill,
        }));

        const { data: inserted, error: insertError } = await supabase
            .from('simulation_skills')
            .upsert(skillRecords, { onConflict: 'simulation_id,skill_name', ignoreDuplicates: true })
            .select();

        if (insertError) {
            console.error("Add skills error:", insertError);
            return { error: "Failed to add skills" };
        }

        return { data: inserted };
    } catch (err: any) {
        console.error("Add skills error:", err);
        return { error: "Failed to add skills" };
    }
}

/**
 * Remove skill from simulation
 */
export async function removeSkill(simulationId: string, skillName: string) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        const { error: deleteError } = await supabase
            .from('simulation_skills')
            .delete()
            .eq('simulation_id', simulationId)
            .eq('skill_name', skillName);

        if (deleteError) {
            console.error("Remove skill error:", deleteError);
            return { error: "Failed to remove skill" };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Remove skill error:", err);
        return { error: "Failed to remove skill" };
    }
}

// ============================================
// FILE UPLOAD OPERATIONS
// ============================================

/**
 * Upload asset (logo, banner, video, etc.)
 */
export async function uploadAsset(formData: FormData) {
    try {
        const simulationId = formData.get('simulationId') as string;
        const assetType = formData.get('assetType') as 'logo' | 'banner' | 'video' | 'pdf' | 'dataset' | 'document' | 'signature';
        const taskId = formData.get('taskId') as string | undefined;
        const file = formData.get('file') as File;

        if (!file || !((file as any) instanceof File)) {
            console.error("Upload Asset Check: File missing or invalid type", { file: !!file, isFile: file instanceof File });
            return { error: 'Invalid file upload: No file received' };
        }

        const supabase = await createClient();

        // 1. Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // 2. Get simulation to check its organization
        const { data: simulation, error: simError } = await supabase
            .from('simulations')
            .select('org_id')
            .eq('id', simulationId)
            .single();

        if (simError || !simulation) {
            console.error("Simulation fetch error:", simError);
            return { error: "Simulation not found" };
        }

        // 3. Verify user belongs to that organization and has permissions
        const { data: membership, error: membershipError } = await supabase
            .from('organization_members')
            .select('role, org_id')
            .eq('org_id', simulation.org_id)
            .eq('user_id', user.id)
            .single();

        if (membershipError || !membership) {
            console.error("Membership verification error:", membershipError);
            return { error: "Access denied: You don't have permission to edit this simulation" };
        }

        // Check if user has permission (admin or owner)
        if (!['admin', 'owner'].includes(membership.role)) {
            return { error: "You don't have permission to upload assets" };
        }

        // Determine folder based on asset type
        const folderMap: Record<string, string> = {
            logo: 'logos',
            banner: 'banners',
            video: 'videos',
            pdf: 'tasks',
            dataset: 'tasks',
            document: 'tasks',
            signature: 'signatures',
        };

        const folder = folderMap[assetType] || 'misc';

        // 4. Upload to S3
        const { url, key } = await uploadToS3({
            file,
            fileName: file.name,
            folder,
            orgId: membership.org_id,
            simulationId,
            taskId,
            contentType: file.type,
        });

        // 5. Save asset record
        const { data: asset, error: assetError } = await supabase
            .from('simulation_assets')
            .insert({
                simulation_id: simulationId,
                task_id: taskId,
                asset_type: assetType,
                file_name: file.name,
                file_url: url,
                file_size: file.size,
                mime_type: file.type || 'application/octet-stream',
                uploaded_by: user.id,
            })
            .select()
            .single();

        if (assetError) {
            // Rollback S3 upload
            await deleteFromS3(key);
            console.error("Save asset database error:", assetError);
            return { error: `Failed to save asset record: ${assetError.message}` };
        }

        return { data: { url, asset } };
    } catch (err: any) {
        console.error("Critical Upload Asset Error:", err);
        return { error: `System Error during upload: ${err.message || 'Unknown processing error'}` };
    }
}

/**
 * Delete asset
 */
export async function deleteAsset(assetId: string) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // Get asset
        const { data: asset, error: assetError } = await supabase
            .from('simulation_assets')
            .select('*')
            .eq('id', assetId)
            .single();

        if (assetError || !asset) {
            return { error: "Asset not found" };
        }

        // Delete from S3
        const key = extractS3KeyFromUrl(asset.file_url);
        if (key) {
            await deleteFromS3(key);
        }

        // Delete record
        const { error: deleteError } = await supabase
            .from('simulation_assets')
            .delete()
            .eq('id', assetId);

        if (deleteError) {
            console.error("Delete asset error:", deleteError);
            return { error: "Failed to delete asset" };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Delete asset error:", err);
        return { error: "Failed to delete asset" };
    }
}

/**
 * Get all unique analytics tags used by an organization
 */
export async function getOrganizationTags() {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "Authentication required" };

        // Get user's organization
        const { data: membership } = await supabase
            .from('organization_members')
            .select('org_id')
            .eq('user_id', user.id)
            .single();

        if (!membership) return { error: "No organization found" };

        const { data: simulations, error } = await supabase
            .from('simulations')
            .select('analytics_tags')
            .eq('org_id', membership.org_id);

        if (error) {
            console.error("Error fetching tags:", error);
            return { error: "Failed to fetch tags" };
        }

        // Deduplicate tags
        const allTags = simulations?.flatMap(s => s.analytics_tags || []) || [];
        const uniqueTags = Array.from(new Set(allTags)).sort();

        return { data: uniqueTags };
    } catch (error) {
        console.error("Error in getOrganizationTags:", error);
        return { error: "An unexpected error occurred" };
    }
}
/**
 * Get all unique skills used by modification organization
 */
export async function getOrganizationSkills() {
    const supabase = await createClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // Get user's organization
        const { data: membership, error: membershipError } = await supabase
            .from('organization_members')
            .select('org_id')
            .eq('user_id', user.id)
            .single();

        if (membershipError || !membership) {
            return { error: "No organization found" };
        }

        // Get all unique skills from simulations belonging to this org
        const { data: skills, error: skillsError } = await supabase
            .from('simulation_skills')
            .select(`
                skill_name,
                simulations!inner (
                    org_id
                )
            `)
            .eq('simulations.org_id', membership.org_id);

        if (skillsError) {
            console.error("Get org skills error:", skillsError);
            return { error: "Failed to fetch skills" };
        }

        // Extract unique skill names
        const uniqueSkills = Array.from(new Set(skills.map(s => s.skill_name))).sort();

        return { data: uniqueSkills };
    } catch (err: any) {
        console.error("Get org skills error:", err);
        return { error: "Failed to fetch skills" };
    }
}
