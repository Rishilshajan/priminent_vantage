import { Metadata } from 'next'
import PrivacyView from "@/components/enterprise/settings/privacy/PrivacyView"

export const metadata: Metadata = {
    title: 'Enterprise Data & Privacy Settings | Prominent Vantage',
    description: 'Configure global data handling, retention policies, and regulatory compliance standards.',
}

export default function EnterprisePrivacyPage() {
    return <PrivacyView />
}
