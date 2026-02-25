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
    }
};
