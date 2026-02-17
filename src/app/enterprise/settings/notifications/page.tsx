import { Metadata } from 'next'
import NotificationsView from "@/components/enterprise/settings/notifications/NotificationsView"

export const metadata: Metadata = {
    title: 'Enterprise Notification Settings | Prominent Vantage',
    description: 'Configure automated communication channels, security alerts, and stakeholder engagement reports.',
}

export default function EnterpriseNotificationsPage() {
    return <NotificationsView />
}
