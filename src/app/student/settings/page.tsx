import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getStudentFullProfileAction } from "@/actions/student/student-profile.actions"
import { enterpriseManagementService } from "@/lib/enterprise/enterprise-management.service"
import { StudentSettingsView } from "@/components/student/StudentSettingsView"

export default async function StudentSettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch full profile data
    const profileResponse = await getStudentFullProfileAction()

    if (!profileResponse.success || !profileResponse.data) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-[40px] bg-white p-12 dark:bg-white/5">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Profile Not Found</h2>
                <p className="text-slate-500">We couldn't load your profile information. Please try again later.</p>
            </div>
        )
    }

    // Fetch branding for the organization (assuming org_id is in profile)
    const orgId = profileResponse.data.profile?.org_id
    let organizationBranding = null
    if (orgId) {
        const brandingRes = await enterpriseManagementService.getBranding(orgId)
        if (brandingRes.success) {
            organizationBranding = brandingRes.data
        }
    }

    return (
        <StudentSettingsView
            data={profileResponse.data}
            organizationBranding={organizationBranding}
        />
    )
}
