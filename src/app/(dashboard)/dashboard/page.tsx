
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardView from '@/components/admin/dashboard-view'

export default async function DashboardPage() {
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
        return <AdminDashboardView profile={profile} />
    }


    // Default View (Student/Enterprise/etc)
    return (
        <div className="flex h-screen w-full flex-col">
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <p className="text-xl">Welcome back, {profile?.first_name || user.email}!</p>
                <p className="text-muted-foreground mt-2">Role: {profile?.role}</p>

                {/* Role specific content placeholders */}
                {profile?.role === 'student' && (
                    <div className="mt-8 p-6 border rounded-xl bg-slate-50 dark:bg-slate-900">
                        <h2 className="text-xl font-semibold mb-2">Student Actions</h2>
                        <p>View your enrolled simulations and track progress here.</p>
                    </div>
                )}

                {profile?.role === 'enterprise' && (
                    <div className="mt-8 p-6 border rounded-xl bg-slate-50 dark:bg-slate-900">
                        <h2 className="text-xl font-semibold mb-2">Enterprise Actions</h2>
                        <p>Create and manage your simulations here.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
