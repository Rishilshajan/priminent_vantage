import { createClient } from "@/lib/supabase/server";
import { logServerEvent } from "@/lib/logger/server";
import {
    Simulation,
    SimulationMetadataSchema,
    canPublishSimulation,
} from "@/lib/simulations/types";
import { revalidatePath } from "next/cache";

export const simulationService = {
    // Creates a new simulation draft under the user's organization with validated metadata and org branding
    async createSimulation(data: {
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
                throw new Error("Authentication required");
            }

            // Get user's organization and branding
            const { data: membership, error: membershipError } = await supabase
                .from('organization_members')
                .select('org_id, role, organizations(logo_url, brand_color)')
                .eq('user_id', user.id)
                .single();

            if (membershipError || !membership) {
                throw new Error("No organization found for this user");
            }

            // Check if user has permission (admin or owner)
            if (!['admin', 'owner'].includes(membership.role)) {
                throw new Error("You don't have permission to create simulations");
            }

            const org = membership.organizations as any;

            // Create simulation
            const { data: simulation, error: createError } = await supabase
                .from('simulations')
                .insert({
                    org_id: membership.org_id,
                    created_by: user.id,
                    ...validated,
                    company_logo_url: org?.logo_url || null,
                    brand_color: org?.brand_color || '#7F13EC',
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
                throw new Error("Failed to create simulation");
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

            return simulation;
        } catch (err: any) {
            console.error("Create simulation service error:", err);
            throw err;
        }
    },

    // Updates allowed fields on an existing simulation record and logs the change event
    async updateSimulation(simulationId: string, data: Partial<Simulation>) {
        const supabase = await createClient();

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                throw new Error("Authentication required");
            }

            const { data: simulation, error: simError } = await supabase
                .from('simulations')
                .select('org_id')
                .eq('id', simulationId)
                .single();

            if (simError || !simulation) {
                throw new Error("Simulation not found");
            }

            const { data: membership, error: membershipError } = await supabase
                .from('organization_members')
                .select('role')
                .eq('org_id', simulation.org_id)
                .eq('user_id', user.id)
                .single();

            if (membershipError || !membership) {
                throw new Error("Access denied: You don't have permission to edit this simulation");
            }

            if (!['admin', 'owner'].includes(membership.role)) {
                throw new Error("You don't have permission to edit simulations");
            }

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
                throw new Error("Failed to update simulation");
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

            return updated;
        } catch (err: any) {
            console.error("Update simulation service error:", err);
            throw err;
        }
    },

    // Fetches a single simulation with tasks, skills, and org name joined by ID
    async getSimulation(simulationId: string) {
        const supabase = await createClient();

        try {
            const { data: simulation, error: simError } = await supabase
                .from('simulations')
                .select(`
                    *,
                    simulation_tasks (*),
                    simulation_skills (*),
                    organizations (name)
                `)
                .eq('id', simulationId)
                .single();

            if (simError || !simulation) {
                throw new Error("Simulation not found");
            }

            return simulation;
        } catch (err: any) {
            throw err;
        }
    },

    // Fetches all simulations for the current user's organization ordered by creation date
    async getSimulations() {
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

            const { data: simulations, error: simError } = await supabase
                .from('simulations')
                .select(`
                    *,
                    simulation_tasks (count),
                    simulation_skills (count)
                `)
                .eq('org_id', membership.org_id)
                .order('created_at', { ascending: false });

            if (simError) throw new Error("Failed to fetch simulations");

            return simulations || [];
        } catch (err: any) {
            throw err;
        }
    },

    // Searches simulations by title or description within the current user's organization
    async searchSimulations(query: string) {
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

            if (simError) throw new Error("Failed to search simulations");

            return simulations || [];
        } catch (err: any) {
            throw err;
        }
    },

    // Validates all requirements then publishes a simulation and logs the event
    async publishSimulation(simulationId: string) {
        const supabase = await createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication required");

            const { data: simulation, error: simError } = await supabase
                .from('simulations')
                .select('*, simulation_tasks (*)')
                .eq('id', simulationId)
                .single();

            if (simError || !simulation) throw new Error("Simulation not found");

            const validation = canPublishSimulation(simulation, simulation.simulation_tasks);
            if (!validation.canPublish) {
                throw new Error(validation.errors.join(', '));
            }

            const { data: published, error: publishError } = await supabase
                .from('simulations')
                .update({
                    status: 'published',
                    published_at: new Date().toISOString(),
                })
                .eq('id', simulationId)
                .select()
                .single();

            if (publishError) throw new Error("Failed to publish simulation");

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

            return published;
        } catch (err: any) {
            throw err;
        }
    },

    // Collects and deduplicates all analytics tags across the organization's simulations for the filter picker
    async getOrganizationTags() {
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

            const { data: simulations, error } = await supabase
                .from('simulations')
                .select('analytics_tags')
                .eq('org_id', membership.org_id);

            if (error) throw new Error("Failed to fetch tags");

            const allTags = simulations?.flatMap(s => s.analytics_tags || []) || [];
            const uniqueTags = Array.from(new Set(allTags)).sort();

            return uniqueTags;
        } catch (error: any) {
            throw error;
        }
    }
};
