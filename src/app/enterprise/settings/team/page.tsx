import { Metadata } from 'next'
import TeamAccessView from "@/components/enterprise/settings/team/TeamAccessView"

export const metadata: Metadata = {
    title: 'Enterprise Team & Role Management | Prominent Vantage',
    description: 'Manage organization members, assign roles, and configure access permissions.',
}

export default function EnterpriseTeamAccessPage() {
    return <TeamAccessView />
}
