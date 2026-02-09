
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EmployeeDashboardView from '@/components/employee/EmployeeDashboardView'

export default async function EmployeeDashboardPage() {
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

    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
        redirect('/admin')
    }

    return <EmployeeDashboardView profile={profile} />
}
