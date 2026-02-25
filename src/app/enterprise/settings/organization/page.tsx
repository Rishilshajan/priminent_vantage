import { Metadata } from 'next'
import { getEnterpriseUser, getOrganizationBranding } from "@/actions/enterprise/enterprise-management.actions"
import BrandingView from "@/components/enterprise/settings/organization/BrandingView"

export const metadata: Metadata = {
    title: 'Enterprise Branding & Identity | Priminent Vantage',
    description: 'Customize your corporate identity across simulations, emails, and candidate certificates.',
}

export default async function EnterpriseBrandingPage() {
    const userResult = await getEnterpriseUser();
    const userProfile = userResult?.userProfile || null;
    const orgName = userResult?.orgName || "Enterprise";

    const brandingResult = await getOrganizationBranding();
    const brandingData = brandingResult?.success ? brandingResult.data : null;

    return <BrandingView userProfile={userProfile} orgName={orgName} initialBranding={brandingData} />
}
