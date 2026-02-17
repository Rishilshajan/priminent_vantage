import { Metadata } from 'next'
import BrandingView from "@/components/enterprise/settings/organization/BrandingView"

export const metadata: Metadata = {
    title: 'Enterprise Branding & Identity | Prominent Vantage',
    description: 'Customize your corporate identity across simulations, emails, and candidate certificates.',
}

export default function EnterpriseBrandingPage() {
    return <BrandingView />
}
