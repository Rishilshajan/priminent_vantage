import { createClient } from "@/lib/supabase/server";

export const simulationService = {
    async getDashboardData(userId: string) {
        const supabase = await createClient();

        try {
            // 1. Fetch user profile stats
            const { data: profile } = await supabase
                .from('profiles')
                .select('first_name, last_name, email, onboarding_completed')
                .eq('id', userId)
                .single();

            // 2. Fetch current enrollments
            const { data: enrollments } = await supabase
                .from('simulation_enrollments')
                .select(`
                    id,
                    status,
                    progress_percentage,
                    enrolled_at,
                    simulations (
                        id,
                        title,
                        short_description,
                        banner_url,
                        company_logo_url,
                        org_id,
                        organizations!org_id (
                            name
                        ),
                        simulation_skills (
                            skill_name
                        ),
                        created_at
                    )
                `)
                .eq('student_id', userId)
                .order('enrolled_at', { ascending: false });

            // 3. Fetch recommended simulations (published, not enrolled)
            const enrolledIds = enrollments?.map(e => {
                const sim: any = e.simulations;
                return Array.isArray(sim) ? sim[0]?.id : sim?.id;
            }).filter(Boolean) || [];

            let recommendationsQuery = supabase
                .from('simulations')
                .select(`
                    id,
                    title,
                    short_description,
                    banner_url,
                    company_logo_url,
                    org_id,
                    organizations!org_id (
                        name
                    ),
                    simulation_skills (
                        skill_name
                    ),
                    created_at
                `)
                .eq('status', 'published');

            if (enrolledIds.length > 0) {
                recommendationsQuery = recommendationsQuery.not('id', 'in', `(${enrolledIds.join(',')})`);
            }

            const { data: recommendations } = await recommendationsQuery.limit(4);

            // 4. Fetch Organization names for all unique org_ids
            const allSims = [
                ...(enrollments?.map(e => Array.isArray(e.simulations) ? e.simulations[0] : e.simulations) || []),
                ...(recommendations || [])
            ].filter(Boolean);

            const uniqueOrgIds = Array.from(new Set(allSims.map(s => s.org_id))).filter(Boolean);

            let orgMap: Record<string, string> = {};
            if (uniqueOrgIds.length > 0) {
                const { data: orgs } = await supabase
                    .from('public_organization_metadata')
                    .select('id, name')
                    .in('id', uniqueOrgIds);

                orgs?.forEach(org => {
                    orgMap[org.id] = org.name;
                });
            }

            // Add names to sims
            const finalEnrollments = enrollments?.map(e => {
                const sim = (Array.isArray(e.simulations) ? e.simulations[0] : e.simulations) as any;
                if (sim && orgMap[sim.org_id]) {
                    sim.organization_name = orgMap[sim.org_id];
                }
                return e;
            });

            const finalRecommendations = recommendations?.map((sim: any) => {
                if (orgMap[sim.org_id]) {
                    sim.organization_name = orgMap[sim.org_id];
                }
                return sim;
            });

            // 5. Calculate stats
            const inProgress = enrollments?.filter(e => e.status === 'in_progress' || e.status === 'not_started').length || 0;
            const completedEnrollments = enrollments?.filter(e => e.status === 'completed') || [];
            const completedCount = completedEnrollments.length;

            // Calculate unique skills mastered
            const masteredSkills = new Set();
            completedEnrollments.forEach(e => {
                const sim = Array.isArray(e.simulations) ? e.simulations[0] : e.simulations;
                sim?.simulation_skills?.forEach((s: any) => masteredSkills.add(s.skill_name));
            });

            return {
                profile,
                enrollments: finalEnrollments || [],
                recommendations: finalRecommendations || [],
                stats: {
                    inProgress,
                    completed: completedCount,
                    skillsMastered: masteredSkills.size,
                    rank: "Level 4 Elite"
                }
            };
        } catch (error) {
            console.error("Error fetching student dashboard data:", error);
            throw error;
        }
    },

    async getLibraryData(userId: string, industry?: string) {
        const supabase = await createClient();

        try {
            // 1. Fetch all published simulations
            let query = supabase
                .from('simulations')
                .select(`
                    id,
                    title,
                    short_description,
                    banner_url,
                    company_logo_url,
                    org_id,
                    industry,
                    target_role,
                    difficulty_level,
                    duration,
                    simulation_skills (
                        skill_name
                    ),
                    created_at
                `)
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (industry && industry !== 'All Industries') {
                query = query.eq('industry', industry);
            }

            const { data: sims, error } = await query;
            if (error) throw error;

            // 2. Fetch user's enrollments to mark "already enrolled"
            const { data: enrollments } = await supabase
                .from('simulation_enrollments')
                .select('simulation_id')
                .eq('student_id', userId);

            const enrolledIds = new Set(enrollments?.map(e => e.simulation_id) || []);

            // 3. Fetch Organization names from public metadata
            const uniqueOrgIds = Array.from(new Set(sims?.map(s => s.org_id) || [])).filter(Boolean);

            let orgMap: Record<string, string> = {};
            if (uniqueOrgIds.length > 0) {
                const { data: orgs } = await supabase
                    .from('public_organization_metadata')
                    .select('id, name')
                    .in('id', uniqueOrgIds);

                orgs?.forEach(org => {
                    orgMap[org.id] = org.name;
                });
            }

            // 4. Map final data
            const finalSims = sims?.map((sim: any) => ({
                ...sim,
                organization_name: orgMap[sim.org_id] || "Global Company",
                isEnrolled: enrolledIds.has(sim.id)
            })) || [];

            return finalSims;
        } catch (error) {
            console.error("Error fetching library data:", error);
            throw error;
        }
    },

    async getMySimulations(userId: string) {
        const supabase = await createClient();

        try {
            // 1. Fetch user profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('first_name, last_name, email')
                .eq('id', userId)
                .single();

            // 2. Fetch all enrollments
            const { data: enrollments, error } = await supabase
                .from('simulation_enrollments')
                .select(`
                    id,
                    status,
                    progress_percentage,
                    enrolled_at,
                    simulations (
                        id,
                        title,
                        short_description,
                        banner_url,
                        company_logo_url,
                        org_id,
                        industry,
                        target_role,
                        difficulty_level,
                        duration,
                        simulation_skills (
                            skill_name
                        ),
                        created_at
                    )
                `)
                .eq('student_id', userId)
                .order('enrolled_at', { ascending: false });

            if (error) throw error;

            // 3. Fetch Organization names for unique org_ids
            const uniqueOrgIds = Array.from(new Set(enrollments?.map(e => {
                const sim: any = e.simulations;
                return Array.isArray(sim) ? sim[0]?.org_id : sim?.org_id;
            }))).filter(Boolean);

            let orgMap: Record<string, string> = {};
            if (uniqueOrgIds.length > 0) {
                const { data: orgs } = await supabase
                    .from('public_organization_metadata')
                    .select('id, name')
                    .in('id', uniqueOrgIds);

                orgs?.forEach(org => {
                    orgMap[org.id] = org.name;
                });
            }

            // 4. Map final data
            const finalEnrollments = enrollments?.map(e => {
                const sim = (Array.isArray(e.simulations) ? e.simulations[0] : e.simulations) as any;
                if (sim && orgMap[sim.org_id]) {
                    sim.organization_name = orgMap[sim.org_id];
                }
                return {
                    ...e,
                    simulations: sim
                };
            }) || [];

            return {
                profile,
                enrollments: finalEnrollments
            };
        } catch (error) {
            console.error("Error fetching my simulations:", error);
            throw error;
        }
    },

    async getSimulationDetails(userId: string, simulationId: string) {
        const supabase = await createClient();

        try {
            // 1. Fetch simulation details with skills and tasks
            const { data: simulation, error } = await supabase
                .from('simulations')
                .select(`
                    *,
                    simulation_skills (
                        skill_name,
                        skill_type
                    ),
                    simulation_tasks (
                        *,
                        sort_order
                    ),
                    simulation_assets!simulation_id (
                        id,
                        asset_type,
                        file_url,
                        file_name,
                        task_id
                    ),
                    simulation_reviews (
                        id,
                        rating,
                        content,
                        profiles (
                            first_name,
                            last_name,
                            avatar_url,
                            user_type,
                            last_role
                        )
                    )
                `)
                .eq('id', simulationId)
                .single();

            if (error) throw error;

            // 2. Fetch current user profile for the header
            const { data: userProfile } = await supabase
                .from('profiles')
                .select('first_name, last_name, avatar_url')
                .eq('id', userId)
                .single();

            // 3. Fetch task submissions for this student
            const { data: submissions } = await supabase
                .from('simulation_task_submissions')
                .select('task_id, status')
                .eq('student_id', userId)
                .eq('simulation_id', simulationId);

            // 4. Fetch organization name from public metadata as requested
            const { data: orgMetadata } = await supabase
                .from('public_organization_metadata')
                .select('name')
                .eq('id', simulation.org_id)
                .single();

            // 5. Fetch branding from organizations table
            const { data: orgBranding } = await supabase
                .from('organizations')
                .select('brand_color, logo_url')
                .eq('id', simulation.org_id)
                .single();

            // 6. Check if user is enrolled
            const { data: enrollment } = await supabase
                .from('simulation_enrollments')
                .select('id, status')
                .eq('student_id', userId)
                .eq('simulation_id', simulationId)
                .single();

            return {
                simulation: {
                    ...simulation,
                    organization_name: orgMetadata?.name || "Global tech Partner",
                    org_brand_color: orgBranding?.brand_color || '#7F13EC',
                    org_logo_url: orgBranding?.logo_url,
                    skills: simulation.simulation_skills || [],
                    tasks: simulation.simulation_tasks?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [],
                    intro_video_url: simulation.simulation_assets?.find((a: any) => a.asset_type === 'video' && !a.task_id)?.file_url || simulation.intro_video_url,
                    assets: simulation.simulation_assets || [],
                    reviews: simulation.simulation_reviews?.map((r: any) => ({
                        id: r.id,
                        student_name: [r.profiles?.first_name, r.profiles?.last_name].filter(Boolean).join(' '),
                        student_role: r.profiles?.last_role || r.profiles?.user_type || "Student",
                        rating: r.rating,
                        content: r.content,
                        avatar_url: r.profiles?.avatar_url
                    })) || []
                },
                user: {
                    fullName: [userProfile?.first_name, userProfile?.last_name].filter(Boolean).join(' ') || "User",
                    avatarUrl: userProfile?.avatar_url
                },
                submissions: submissions || [],
                isEnrolled: !!enrollment,
                enrollmentStatus: enrollment?.status || null
            };
        } catch (error) {
            console.error("Error fetching simulation details:", error);
            throw error;
        }
    }
};
