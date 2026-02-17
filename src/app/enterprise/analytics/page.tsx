import { Metadata } from 'next'
import AnalyticsView from "@/components/enterprise/analytics/AnalyticsView"

export const metadata: Metadata = {
    title: 'Enterprise Analytics & Insights | Prominent Vantage',
    description: 'Deep dive into enterprise performance metrics, candidate engagement, and talent sourcing insights.',
}

export default function EnterpriseAnalyticsPage() {
    return <AnalyticsView />
}
