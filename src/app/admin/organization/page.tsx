import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OrgDashboardView from '@/components/admin/organization/org-dashboard-view'
import { getEnterpriseStats } from '@/actions/enterprise/enterprise-management.actions'
import { getEnterpriseRequests } from '@/actions/enterprise/enterprise-request.actions'

export default async function OrganizationPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Check for Admin Role
    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
        // Fetch real data
        const { data: requests } = await getEnterpriseRequests()
        const stats = await getEnterpriseStats()

        // Create a composite profile object with email from auth
        const adminProfile = {
            ...profile,
            email: user.email
        }
        return (
            <OrgDashboardView
                profile={adminProfile}
                requests={requests || []}
                stats={stats}
            />
        )
    }

    // If not admin, redirect back to main dashboard or show unauthorized
    return redirect('/dashboard')
}
