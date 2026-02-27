import { Metadata } from 'next'
import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCandidateDetailAction } from "@/actions/enterprise/enterprise-management.actions"
import CandidateProfileView from "@/components/enterprise/candidates/CandidateProfileView"
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/enterprise/dashboard/DashboardHeader"

export const metadata: Metadata = {
    title: 'Candidate Profile | Priminent Vantage',
    description: 'Detailed view of candidate performance and professional history.',
}

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function CandidateDetailPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        redirect("/enterprise/login");
    }

    // Get candidate detail
    const response = await getCandidateDetailAction(id);

    if (!response.success || !response.data) {
        return notFound();
    }

    const { data: userProfile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, role, avatar_url')
        .eq('id', user.id)
        .single();

    // Get organization name
    const { data: membership } = await supabase
        .from('organization_members')
        .select('organizations(name)')
        .eq('user_id', user.id)
        .single();

    const orgName = (membership?.organizations as any)?.name || "Organization";

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <DashboardSidebar orgName={orgName} userProfile={userProfile} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <DashboardHeader orgName={orgName} />

                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-8 bg-slate-50 dark:bg-slate-950/30 custom-scrollbar">
                    <CandidateProfileView data={response.data} />
                </div>
            </main>
        </div>
    );
}
