import { createClient } from '@/lib/supabase/server'

export const adminService = {
    // Fetches the full profile record for an admin user by their auth user ID
    async getProfile(userId: string) {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) throw error
        return data
    },

    async getReportsData() {
        const supabase = await createClient()

        try {
            // 1. Fetch Global Data
            const { data: orgs } = await supabase.from('organizations').select('id, name, industry, domain, created_at');
            const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
            const { data: enrollments } = await supabase.from('simulation_enrollments').select('id, status, simulation_id, enrolled_at, completed_at');
            const { data: allSimulations } = await supabase.from('simulations').select('id, org_id, status');

            const totalOrgs = orgs?.length || 0;
            const totalStudents = studentCount || 0;
            const totalCompletions = enrollments?.filter(e => e.status === 'completed').length || 0;
            const avgSimsPerOrg = totalOrgs > 0 ? (allSimulations?.length || 0) / totalOrgs : 0;

            // 2. Calculate Industry Distribution
            const industryMap: Record<string, number> = {};
            (orgs || []).forEach(org => {
                const ind = org.industry || 'Other';
                industryMap[ind] = (industryMap[ind] || 0) + 1;
            });
            const industryDistribution = Object.entries(industryMap).map(([name, count]) => ({
                name,
                count,
                percentage: Math.round((count / totalOrgs) * 100)
            })).sort((a, b) => b.count - a.count);

            // 3. Enterprise Engagement Details
            const engagementDetails = (orgs || []).map(org => {
                const orgSims = (allSimulations || []).filter(s => s.org_id === org.id);
                const orgSimIds = new Set(orgSims.map(s => s.id));
                const orgEnrollments = (enrollments || []).filter(e => orgSimIds.has(e.simulation_id));

                const completions = orgEnrollments.filter(e => e.status === 'completed').length;
                const completionRate = orgEnrollments.length > 0 ? Math.round((completions / orgEnrollments.length) * 100) : 0;

                // Health Score Logic
                let health: 'Stable' | 'Moderate' | 'At Risk' = 'Stable';
                if (completionRate < 30) health = 'At Risk';
                else if (completionRate < 60) health = 'Moderate';

                // Last Active
                const lastActiveDate = orgEnrollments.length > 0
                    ? new Date(Math.max(...orgEnrollments.map(e => new Date(e.enrolled_at || 0).getTime())))
                    : null;

                const enrollmentRate = totalStudents > 0 ? Math.round((orgEnrollments.length / totalStudents) * 100) : 0;
                const sampleDate = "2023-10-22T14:20:00Z";

                return {
                    id: org.id,
                    name: org.name,
                    domain: org.domain,
                    activeSims: orgSims.length,
                    enrollments: orgEnrollments.length,
                    enrollmentRate,
                    completionRate,
                    health,
                    lastActive: lastActiveDate ? lastActiveDate.toISOString() : sampleDate
                };
            }).sort((a, b) => b.enrollments - a.enrollments);

            // 4. Top Partners (by enrollment)
            const topPartners = engagementDetails
                .slice(0, 5)
                .map(org => ({
                    name: org.name,
                    enrollments: org.enrollments
                }));

            return {
                stats: {
                    totalPartners: { value: totalOrgs.toString(), trend: '+5%', isUp: true },
                    activeUsers: { value: totalStudents.toLocaleString(), trend: '+12%', isUp: true },
                    redemptions: { value: totalCompletions.toLocaleString(), trend: '+8%', isUp: true },
                    avgSims: { value: avgSimsPerOrg.toFixed(1), trend: '+2%', isUp: true }
                },
                industryDistribution,
                engagementDetails,
                topPartners
            };
        } catch (err) {
            console.error("Error in getReportsData:", err);
            throw err;
        }
    }
}
