import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getSkillsAndCertificationsAction } from "@/actions/student/student-profile.actions"
import { getOrganizationBranding } from "@/actions/enterprise/enterprise-management.actions"
import { SkillsCertificationsView } from "@/components/student/SkillsCertificationsView"

export const metadata = {
    title: "Skills & Certifications | Vantage Student Portal",
    description: "View your verified skills and professional certifications earned through simulations.",
}

export default async function SkillsCertificationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const [dataResult, brandingResult] = await Promise.all([
        getSkillsAndCertificationsAction(),
        getOrganizationBranding()
    ]);

    if (!dataResult.success) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-red-500">Error: {dataResult.error}</p>
            </div>
        );
    }

    return (
        <SkillsCertificationsView
            data={dataResult.data}
            orgBranding={brandingResult?.success ? brandingResult.data : null}
        />
    );
}
