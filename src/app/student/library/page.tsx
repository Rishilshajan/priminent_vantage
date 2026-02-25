import { getSimulationLibrary } from "@/actions/student/simulation.actions";
import { getOrganizationBranding } from "@/actions/enterprise/enterprise-management.actions";
import { createClient } from "@/lib/supabase/server";
import { SimulationLibraryView } from "@/components/student/SimulationLibraryView";
import { redirect } from "next/navigation";

export default async function StudentLibraryPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile) redirect("/login");

    // Fetch library data and branding concurrently
    const [libResult, brandResult] = await Promise.all([
        getSimulationLibrary(),
        getOrganizationBranding()
    ]);

    const initialSims = libResult.success ? libResult.data : [];
    const orgBranding = brandResult?.success ? brandResult.data : null;

    return (
        <SimulationLibraryView
            initialSims={initialSims}
            userProfile={profile}
            orgBranding={orgBranding}
        />
    );
}
