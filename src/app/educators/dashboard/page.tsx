
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EducatorDashboardView from '@/components/educator/EducatorDashboardView'

export default async function EducatorDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/educators/login')
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Redirect admins to admin dashboard
    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
        redirect('/admin')
    }

    return <EducatorDashboardView profile={profile} />
}
