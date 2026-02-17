import { Metadata } from 'next'
import SettingsView from "@/components/enterprise/settings/SettingsView"

export const metadata: Metadata = {
    title: 'Enterprise Settings & Security | Priminent Vantage',
    description: 'Manage enterprise security protocols, authentication methods, and user access controls.',
}

export default function EnterpriseSettingsPage() {
    return <SettingsView />
}
