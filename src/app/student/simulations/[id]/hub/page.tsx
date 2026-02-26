import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { simulationService } from "@/lib/student/simulation.service";
import { SimulationHubView } from "@/components/simulations/SimulationHubView";

export default async function SimulationHubPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: simulationId } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const result = await simulationService.getSimulationDetails(user.id, simulationId);
    if (!result || !result.isEnrolled) {
        redirect(`/student/simulations/${simulationId}/preview`);
    }

    const { simulation, user: userData, submissions } = result;
    const orgBranding = {
        brand_color: simulation.org_brand_color,
        logo_url: simulation.org_logo_url
    };

    return (
        <SimulationHubView
            simulation={simulation}
            userData={userData}
            orgBranding={orgBranding}
            submissions={submissions}
        />
    );
}
