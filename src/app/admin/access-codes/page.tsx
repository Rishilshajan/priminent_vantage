import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AccessCodeDashboardView from '@/components/admin/access-codes/access-dashboard-view'
import { getAccessCodesData } from '@/actions/enterprise/enterprise-request.actions'

export default async function AccessCodePage() {
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
        const dashboardData = await getAccessCodesData();

        // Create a composite profile object with email from auth
        const adminProfile = {
            ...profile,
            email: user.email
        }
        return <AccessCodeDashboardView profile={adminProfile} dashboardData={dashboardData.data} />
    }

    // If not admin, redirect back to main dashboard or show unauthorized
    return redirect('/dashboard')
}
