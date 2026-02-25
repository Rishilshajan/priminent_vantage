import { Metadata } from 'next'
import { getEnterpriseUser } from "@/actions/enterprise/enterprise-management.actions"
import TeamAccessView from "@/components/enterprise/settings/team/TeamAccessView"

export const metadata: Metadata = {
    title: 'Enterprise Team & Role Management | Priminent Vantage',
    description: 'Manage organization members, assign roles, and configure access permissions.',
}

export default async function EnterpriseTeamAccessPage() {
    const userResult = await getEnterpriseUser();
    const userProfile = userResult?.userProfile || null;
    const orgName = userResult?.orgName || "Enterprise";

    return <TeamAccessView userProfile={userProfile} orgName={orgName} />
}
