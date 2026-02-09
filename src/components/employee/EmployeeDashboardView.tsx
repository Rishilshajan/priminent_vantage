import { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

export default function EmployeeDashboardView({ profile }: { profile: Profile | null }) {
    return (
        <div className="flex h-screen w-full flex-col">
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <p className="text-xl">Welcome back, {profile?.first_name || profile?.email}!</p>
                <p className="text-muted-foreground mt-2">Role: {profile?.role}</p>

                <div className="mt-8 p-6 border rounded-xl bg-slate-50 dark:bg-slate-900">
                    <h2 className="text-xl font-semibold mb-2">Student Actions</h2>
                    <p>View your enrolled simulations and track progress here.</p>
                </div>
            </main>
        </div>
    )
}
