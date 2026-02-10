
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StudentDashboardView from '@/components/student/StudentDashboardView'

export default async function StudentDashboardPage() {
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

    // Redirect admins away from student dashboard
    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
        redirect('/admin')
    }

    return <StudentDashboardView profile={profile} />
}
