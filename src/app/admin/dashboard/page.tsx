
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardView from '@/components/admin/dashboard-view'
import { adminService } from '@/lib/admin/admin.service'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch profile
    const profile = await adminService.getProfile(user.id)

    // Check for Admin Role
    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
        redirect('/enterprise/dashboard') // or appropriate fallback
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [
        { count: pendingEnterpriseCount },
        { count: pendingEducatorCount },
        { count: activeOrgsCount },
        { count: monthlyOnboardingsCount },
        { data: pendingEnterprise },
        { data: pendingEducators },
        { data: recentLogs }
    ] = await Promise.all([
        // Pending Requests Count
        supabase.from('enterprise_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('educator_applications').select('*', { count: 'exact', head: true }).eq('status', 'PENDING_VERIFICATION'),

        // Active Organizations Count (Approved Requests as proxy)
        supabase.from('enterprise_requests').select('*', { count: 'exact', head: true }).eq('status', 'approved'),

        // Monthly Onboardings (Only APPROVED status this month)
        supabase.from('enterprise_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'approved')
            .gte('created_at', firstDayOfMonth),

        // Pending Enterprise Applications List
        supabase.from('enterprise_requests').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(20),

        // Pending Educator Applications List
        supabase.from('educator_applications').select('*').eq('status', 'PENDING_VERIFICATION').order('created_at', { ascending: false }).limit(20),

        // Recent System Logs
        supabase.from('system_logs').select('*').order('timestamp', { ascending: false }).limit(5)
    ]);

    // Normalize and unify applications
    const normalizedEnterprise = (pendingEnterprise || []).map(app => ({
        id: app.id,
        entityName: app.company_name,
        website: app.website,
        contactName: app.admin_name,
        createdAt: app.created_at,
        type: 'enterprise' as const
    }));

    const normalizedEducators = (pendingEducators || []).map(app => ({
        id: app.id,
        entityName: app.institution_name,
        website: app.institution_website,
        contactName: app.full_name,
        createdAt: app.created_at,
        type: 'educator' as const
    }));

    const allPendingApplications = [...normalizedEnterprise, ...normalizedEducators]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const stats = {
        pendingRequests: (pendingEnterpriseCount || 0) + (pendingEducatorCount || 0),
        activeOrgs: activeOrgsCount || 0,
        monthlyOnboardings: monthlyOnboardingsCount || 0
    };

    return <AdminDashboardView
        profile={profile}
        stats={stats}
        pendingApplications={allPendingApplications}
        recentLogs={recentLogs || []}
    />
}
