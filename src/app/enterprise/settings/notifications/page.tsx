import { Metadata } from 'next'
import { getEnterpriseUser } from "@/actions/enterprise/enterprise-management.actions"
import NotificationsView from "@/components/enterprise/settings/notifications/NotificationsView"

export const metadata: Metadata = {
    title: 'Enterprise Notification Settings | Priminent Vantage',
    description: 'Configure automated communication channels, security alerts, and stakeholder engagement reports.',
}

export default async function EnterpriseNotificationsPage() {
    const userResult = await getEnterpriseUser();
    const userProfile = userResult?.userProfile || null;
    const orgName = userResult?.orgName || "Enterprise";

    return <NotificationsView userProfile={userProfile} orgName={orgName} />
}
