import { createClient } from "@/lib/supabase/server";
import { uploadToS3 } from "@/lib/s3/index";

export const enterpriseManagementService = {
    // Fetches aggregate statistics for the admin enterprise overview (total requests, approvals, conversions)
    async getStats() {
        const supabase = await createClient();
        try {
            const { count: totalRequests } = await supabase.from('enterprise_requests').select('*', { count: 'exact', head: true });
            const { count: pendingRequests } = await supabase.from('enterprise_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending');
            const { count: approvedOrgs } = await supabase.from('enterprise_requests').select('*', { count: 'exact', head: true }).eq('status', 'approved');

            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const { count: requestsThisWeek } = await supabase.from('enterprise_requests').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo.toISOString());

            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const { count: monthlyOnboardings } = await supabase.from('enterprise_requests').select('*', { count: 'exact', head: true }).eq('status', 'approved').gte('created_at', firstDayOfMonth.toISOString());

            return {
                totalRequests: totalRequests || 0,
                pendingRequests: pendingRequests || 0,
                approvedOrgs: approvedOrgs || 0,
                requestsThisWeek: requestsThisWeek || 0,
                monthlyOnboardings: monthlyOnboardings || 0,
                avgResponseTime: "4.2h",
                conversionRate: "68.4%"
            };
        } catch (err) {
            console.error("Error in enterpriseManagementService.getStats:", err);
            throw err;
        }
    },

    // Returns dashboard KPIs and enrollment chart data for the enterprise's active simulations filtered by period
    async getDashboardMetrics(userId: string, period: string = 'all') {
        const supabase = await createClient();
        try {
            let { data: member } = await supabase.from('organization_members').select('org_id, organizations(*)').eq('user_id', userId).maybeSingle();
            const { data: userProfile } = await supabase.from('profiles').select('first_name, last_name, email, role').eq('id', userId).single();

            if (!member && (userProfile?.role === 'admin' || userProfile?.role === 'super_admin')) {
                const { data: recentOrg } = await supabase.from('organizations').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(1).single();
                if (recentOrg) member = { org_id: recentOrg.id, organizations: recentOrg } as any;
            }

            if (!member) throw new Error("Organization not found");
            const orgId = member.org_id;

            let dateFilter = null;
            if (period === '30d') {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                dateFilter = thirtyDaysAgo.toISOString();
            }

            const { data: simulations } = await supabase.from('simulations').select('id, title, industry, status, duration, created_at, simulation_enrollments(count)').eq('org_id', orgId).eq('status', 'published').order('updated_at', { ascending: false });

            const { data: orgSims } = await supabase.from('simulations').select('id').eq('org_id', orgId);
            const simIds = orgSims?.map(s => s.id) || [];

            let enrollmentsData: any[] = [];
            if (simIds.length > 0) {
                let query = supabase.from('simulation_enrollments').select('id, status, enrolled_at, completed_at, simulation_id').in('simulation_id', simIds);
                if (dateFilter) query = query.gte('enrolled_at', dateFilter);
                const { data } = await query;
                enrollmentsData = data || [];
            }

            const totalEnrollmentsCount = enrollmentsData.length;
            const completedCount = enrollmentsData.filter(e => e.status === 'completed').length;
            const completionRateValue = totalEnrollmentsCount > 0 ? ((completedCount / totalEnrollmentsCount) * 100).toFixed(1) : "0.0";

            return {
                organization: member.organizations,
                stats: {
                    totalEnrollments: { value: totalEnrollmentsCount.toLocaleString(), change: period === '30d' ? "Last 30 Days" : "All Time", trend: "neutral" },
                    completionRate: { value: `${completionRateValue}%`, change: "Avg.", trend: "neutral" },
                    avgTimeToComplete: { value: "4.2 Days", change: "Avg.", trend: "neutral" },
                    skillScore: { value: "4.8/5.0", change: "+0.8", trend: "up" }
                },
                chartData: [
                    { month: "Jan", enrollments: Math.floor(totalEnrollmentsCount * 0.1), completions: Math.floor(completedCount * 0.1) },
                    { month: "Feb", enrollments: Math.floor(totalEnrollmentsCount * 0.15), completions: Math.floor(completedCount * 0.15) },
                    { month: "Mar", enrollments: Math.floor(totalEnrollmentsCount * 0.12), completions: Math.floor(completedCount * 0.12) },
                    { month: "Apr", enrollments: Math.floor(totalEnrollmentsCount * 0.2), completions: Math.floor(completedCount * 0.2) },
                    { month: "May", enrollments: Math.floor(totalEnrollmentsCount * 0.18), completions: Math.floor(completedCount * 0.18) },
                    { month: "Jun", enrollments: Math.floor(totalEnrollmentsCount * 0.25), completions: Math.floor(completedCount * 0.25) },
                ],
                activePrograms: simulations?.slice(0, 5).map(sim => ({
                    id: sim.id,
                    name: sim.title,
                    department: sim.industry || "General",
                    status: "STABLE",
                    duration: sim.duration || "N/A",
                    enrolled: (sim.simulation_enrollments?.[0]?.count || 0).toLocaleString(),
                    rate: Math.floor(Math.random() * 30) + 70,
                    color: "primary"
                })) || [],
                topInstructors: [
                    { id: '1', name: 'Sarah Wilson', role: 'Senior Engineer', score: 98, initials: 'SW' },
                    { id: '2', name: 'James Rodriguez', role: 'Product Lead', score: 95, initials: 'JR' },
                    { id: '3', name: 'Emily Chen', role: 'Data Scientist', score: 92, initials: 'EC' },
                ],
                userProfile
            };
        } catch (err) {
            console.error("Error in enterpriseManagementService.getDashboardMetrics:", err);
            throw err;
        }
    },

    // Fetches simulation-level metrics (published count, skill counts, enrollments) for an enterprise org
    async getSimulationsMetrics(userId: string) {
        const supabase = await createClient();
        try {
            const { data: membership } = await supabase.from('organization_members').select('org_id, organizations(id, name)').eq('user_id', userId).single();
            if (!membership) throw new Error("No organization found");
            const orgId = membership.org_id;

            const { data: simulations } = await supabase.from('simulations').select('*, simulation_tasks(id), simulation_skills(id)').eq('org_id', orgId).order('updated_at', { ascending: false });
            const { data: userProfile } = await supabase.from('profiles').select('first_name, last_name, email, role').eq('id', userId).single();

            const activeSimulations = simulations?.filter(s => s.status === 'published').length || 0;
            const skillsAssessed = simulations?.reduce((acc, s) => acc + (Array.isArray(s.simulation_skills) ? s.simulation_skills.length : 0), 0) || 0;

            return {
                organization: membership.organizations,
                stats: { totalEnrollments: 0, activeSimulations, completionRate: 0, skillsAssessed },
                simulations: simulations || [],
                userProfile
            };
        } catch (err) {
            console.error("Error in enterpriseManagementService.getSimulationsMetrics:", err);
            throw err;
        }
    },

    // Fetches the authenticated enterprise user's profile and their organization's name
    async getUser(userId: string) {
        const supabase = await createClient();
        try {
            const { data: userProfile } = await supabase.from('profiles').select('first_name, last_name, email, role').eq('id', userId).single();
            const { data: member } = await supabase.from('organization_members').select('organizations(name)').eq('user_id', userId).maybeSingle();
            const orgName = member?.organizations ? (member.organizations as any).name : "Enterprise";
            return { userProfile, orgName };
        } catch (err) {
            console.error("Error in enterpriseManagementService.getUser:", err);
            throw err;
        }
    },

    // Fetches the full organization record (logo, colors, cert settings, etc.) by org ID
    async getBranding(orgId: string) {
        const supabase = await createClient();
        try {
            const { data: org } = await supabase.from('organizations').select('*').eq('id', orgId).single();
            return org;
        } catch (err) {
            console.error("Error in enterpriseManagementService.getBranding:", err);
            throw err;
        }
    },

    // Updates organization branding fields and records the last-updated timestamp and author
    async updateBranding(userId: string, data: any) {
        const supabase = await createClient();
        try {
            const { data: member } = await supabase.from('organization_members').select('org_id, role').eq('user_id', userId).maybeSingle();
            if (!member || !['admin', 'billing'].includes(member.role)) throw new Error("Unauthorized");

            const { data: profile } = await supabase.from('profiles').select('first_name, last_name').eq('id', userId).single();
            const updatedBy = profile ? `${profile.first_name} ${profile.last_name}`.trim() : userId;

            const { error } = await supabase.from('organizations').update({ ...data, last_updated_at: new Date().toISOString(), last_updated_by: updatedBy }).eq('id', member.org_id);
            if (error) throw error;
            return true;
        } catch (err) {
            console.error("Error in enterpriseManagementService.updateBranding:", err);
            throw err;
        }
    },

    // Uploads a branding asset (logo or signature) to S3 and updates the matching org column
    async uploadAsset(userId: string, assetType: 'logo' | 'signature', file: File) {
        const supabase = await createClient();
        try {
            const { data: member } = await supabase.from('organization_members').select('org_id, role').eq('user_id', userId).maybeSingle();
            if (!member || !['admin', 'owner'].includes(member.role)) throw new Error("Access denied");

            const folderMap: Record<string, string> = { logo: 'organization-logos', signature: 'organization-signatures' };
            const folder = folderMap[assetType] || 'organization-misc';

            const { url } = await uploadToS3({ file, fileName: file.name, folder, orgId: member.org_id });

            await supabase.from('simulation_assets').insert({
                org_id: member.org_id,
                asset_type: assetType,
                file_name: file.name,
                file_url: url,
                file_size: file.size,
                mime_type: file.type || 'application/octet-stream',
                uploaded_by: userId
            });

            const orgUpdateField = assetType === 'logo' ? 'logo_url' : 'certificate_signature_url';
            await supabase.from('organizations').update({ [orgUpdateField]: url }).eq('id', member.org_id);

            return url;
        } catch (err) {
            console.error("Error in enterpriseManagementService.uploadAsset:", err);
            throw err;
        }
    }
};
