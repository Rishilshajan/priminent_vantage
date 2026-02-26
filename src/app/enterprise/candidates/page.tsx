import { Metadata } from 'next'
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import CandidatesView from "@/components/enterprise/candidates/CandidatesView"
import { getCandidatesDashboardData } from "@/actions/enterprise/enterprise-management.actions"

export const metadata: Metadata = {
    title: 'Enterprise Candidates Management | Priminent Vantage',
    description: 'Manage and track candidate performance across all enterprise job simulations.',
}

export default async function EnterpriseCandidatesPage() {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        redirect("/enterprise/login");
    }

    // Get dashboard data
    const response = await getCandidatesDashboardData();

    if (!response.success || !response.data) {
        return (
            <div className="flex h-screen items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
                <div className="text-center space-y-4 max-w-md">
                    <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                        <span className="material-symbols-outlined text-3xl">error</span>
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">Failed to load candidates</h1>
                    <p className="text-sm text-slate-500">{response.error || "Could not retrieve candidate data."}</p>
                </div>
            </div>
        )
    }

    const { stats, candidates, organizationName } = response.data;

    const { data: userProfile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, role, avatar_url')
        .eq('id', user.id)
        .single();

    return (
        <CandidatesView
            userProfile={userProfile}
            organization={{ name: organizationName || "Organization" }}
            stats={stats}
            candidates={candidates}
        />
    );
}
