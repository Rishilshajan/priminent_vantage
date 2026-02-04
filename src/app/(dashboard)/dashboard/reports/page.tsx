import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReportsDashboardView from '@/components/admin/reports/reports-view'

export default async function ReportsPage() {
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
        // Create a composite profile object with email from auth
        const adminProfile = {
            ...profile,
            email: user.email
        }
        return <ReportsDashboardView profile={adminProfile} />
    }

    // If not admin, redirect back to main dashboard or show unauthorized
    return redirect('/dashboard')
}
