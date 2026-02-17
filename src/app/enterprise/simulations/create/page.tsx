import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SimulationBuilderView from "@/components/enterprise/simulations/builder/SimulationBuilderView";

export const metadata: Metadata = {
    title: "Create Simulation | Priminent Vantage",
    description: "Build professional virtual job simulations to engage candidates and assess skills",
};

export default async function CreateSimulationPage() {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        redirect("/enterprise/login");
    }

    // Get user's organization
    const { data: membership, error: membershipError } = await supabase
        .from('organization_members')
        .select('org_id, role, organizations(id, name)')
        .eq('user_id', user.id)
        .single();

    if (membershipError || !membership) {
        redirect("/enterprise/dashboard?error=no_organization");
    }

    // Check if user has permission (admin or owner)
    if (!['admin', 'owner'].includes(membership.role)) {
        redirect("/enterprise/dashboard?error=insufficient_permissions");
    }

    const organization = Array.isArray(membership.organizations)
        ? membership.organizations[0]
        : membership.organizations;

    return (
        <SimulationBuilderView
            organization={organization}
            user={user}
        />
    );
}
