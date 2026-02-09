
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

    return <AdminDashboardView profile={profile} />
}
