import { Metadata } from 'next'
import { getEnterpriseUser } from "@/actions/enterprise/enterprise-management.actions"
import PrivacyView from "@/components/enterprise/settings/privacy/PrivacyView"

export const metadata: Metadata = {
    title: 'Enterprise Data & Privacy Settings | Priminent Vantage',
    description: 'Configure global data handling, retention policies, and regulatory compliance standards.',
}

export default async function EnterprisePrivacyPage() {
    const userResult = await getEnterpriseUser();
    const userProfile = userResult?.userProfile || null;
    const orgName = userResult?.orgName || "Enterprise";

    return <PrivacyView userProfile={userProfile} orgName={orgName} />
}
