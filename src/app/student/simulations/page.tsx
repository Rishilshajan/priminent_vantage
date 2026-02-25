import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getMySimulationsAction } from "@/actions/student/simulation.actions"
import { getOrganizationBranding } from "@/actions/enterprise/enterprise-management.actions"
import { MySimulationsView } from "@/components/student/MySimulationsView"

export const metadata = {
    title: "My Simulations | Vantage Student Portal",
    description: "Manage your enrolled simulations and track your professional progress.",
}

export default async function MySimulationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const [simulationsResult, brandingResult] = await Promise.all([
        getMySimulationsAction(),
        getOrganizationBranding()
    ]);

    if (!simulationsResult.success) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-red-500">Error: {simulationsResult.error}</p>
            </div>
        );
    }

    return (
        <MySimulationsView
            initialEnrollments={simulationsResult.data.enrollments}
            userProfile={simulationsResult.data.profile}
            orgBranding={brandingResult?.success ? brandingResult.data : null}
        />
    );
}
