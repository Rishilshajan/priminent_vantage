import { Metadata } from 'next'
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ReportsView from "@/components/enterprise/reports/ReportsView"
import { getSimulations } from "@/actions/simulations"

export const metadata: Metadata = {
    title: 'Simulation Reports | Priminent Vantage',
    description: 'Deep-dive into specific simulation results or generate aggregated cross-simulation reports.',
}

export default async function EnterpriseReportsPage() {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        redirect("/enterprise/login");
    }

    // Get user's organization and profile
    const { data: membership } = await supabase
        .from("organization_members")
        .select("org_id, organizations(id, name)")
        .eq("user_id", user.id)
        .single();

    const { data: userProfile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, role')
        .eq('id', user.id)
        .single();

    const organization = membership?.organizations as any;

    // Fetch dynamic simulations
    const { data: simulations = [], error: simError } = await getSimulations();

    if (simError) {
        console.error("Error fetching simulations for reports:", simError);
    }

    return (
        <ReportsView
            userProfile={userProfile}
            organization={organization}
            simulations={simulations}
        />
    );
}
