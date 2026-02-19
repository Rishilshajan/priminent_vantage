import { Metadata } from 'next'
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AnalyticsView from "@/components/enterprise/analytics/AnalyticsView"

export const metadata: Metadata = {
    title: 'Enterprise Analytics | Priminent Vantage',
    description: 'Deep dive into candidate performance and skill distributions.',
}

export default async function EnterpriseAnalyticsPage() {
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

    return (
        <AnalyticsView
            userProfile={userProfile}
            organization={organization}
        />
    );
}
