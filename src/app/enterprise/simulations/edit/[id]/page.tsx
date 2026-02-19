import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSimulation } from "@/actions/simulations";
import SimulationBuilderView from "@/components/enterprise/simulations/builder/SimulationBuilderView";

export const metadata: Metadata = {
    title: "Edit Simulation - Priminent Vantage",
    description: "Edit your virtual job simulation",
};

export default async function EditSimulationPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params (Next.js 15 requirement)
    const { id } = await params;

    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        redirect("/enterprise/login");
    }

    // Get user's organization and role
    const { data: membership, error: membershipError } = await supabase
        .from("organization_members")
        .select("org_id, role, organizations(id, name)")
        .eq("user_id", user.id)
        .single();

    if (membershipError || !membership) {
        redirect("/enterprise/dashboard");
    }

    // Check if user has permission (admin or owner)
    if (membership.role !== "admin" && membership.role !== "owner") {
        redirect("/enterprise/dashboard");
    }

    // Fetch the simulation
    const result = await getSimulation(id);

    if (result.error) {
        console.error("Error fetching simulation:", result.error);
        return (
            <div className="flex h-screen items-center justify-center p-8">
                <div className="text-center space-y-4 max-w-md">
                    <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                        <span className="material-symbols-outlined text-3xl">error</span>
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">
                        Simulation Not Found
                    </h1>
                    <p className="text-sm text-slate-500">
                        {result.error}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                        ID: {id}
                    </p>
                    <a
                        href="/enterprise/simulations"
                        className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl"
                    >
                        Back to Simulations
                    </a>
                </div>
            </div>
        );
    }

    if (!result.data) {
        return (
            <div className="flex h-screen items-center justify-center p-8">
                <div className="text-center space-y-4 max-w-md">
                    <h1 className="text-xl font-black">No simulation data found</h1>
                    <a href="/enterprise/simulations" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl">
                        Back to Simulations
                    </a>
                </div>
            </div>
        );
    }

    // Verify simulation belongs to user's organization
    if (result.data.org_id !== membership.org_id) {
        redirect("/enterprise/simulations");
    }

    const organization = Array.isArray(membership.organizations)
        ? membership.organizations[0]
        : membership.organizations;

    // Get user profile
    const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <SimulationBuilderView
            organization={organization as any}
            user={user}
            initialSimulationId={id}
            userProfile={userProfile}
        />
    );
}
