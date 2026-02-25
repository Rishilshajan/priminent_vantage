import { Metadata } from 'next'
import { getEnterpriseUser } from "@/actions/enterprise/enterprise-management.actions"
import SettingsView from "@/components/enterprise/settings/SettingsView"

export const metadata: Metadata = {
    title: 'Enterprise Settings & Security | Priminent Vantage',
    description: 'Manage enterprise security protocols, authentication methods, and user access controls.',
}

export default async function EnterpriseSettingsPage() {
    const userResult = await getEnterpriseUser();
    const userProfile = userResult?.userProfile || null;
    const orgName = userResult?.orgName || "Enterprise";

    return <SettingsView userProfile={userProfile} orgName={orgName} />
}
