
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
        redirect('/employee') // or appropriate fallback
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [
        { count: pendingRequestsCount },
        { count: activeOrgsCount },
        { count: monthlyOnboardingsCount },
        { data: pendingApplications },
        { data: recentLogs }
    ] = await Promise.all([
        // Pending Requests Count
        supabase.from('enterprise_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),

        // Active Organizations Count (Approved Requests as proxy)
        supabase.from('enterprise_requests').select('*', { count: 'exact', head: true }).eq('status', 'approved'),

        // Monthly Onboardings (Only APPROVED status this month)
        supabase.from('enterprise_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'approved')
            .gte('created_at', firstDayOfMonth),

        // Pending Applications List
        supabase.from('enterprise_requests').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(10),

        // Recent System Logs
        supabase.from('system_logs').select('*').order('timestamp', { ascending: false }).limit(5)
    ]);

    const stats = {
        pendingRequests: pendingRequestsCount || 0,
        activeOrgs: activeOrgsCount || 0,
        monthlyOnboardings: monthlyOnboardingsCount || 0
    };

    return <AdminDashboardView
        profile={profile}
        stats={stats}
        pendingApplications={pendingApplications || []}
        recentLogs={recentLogs || []}
    />
}
