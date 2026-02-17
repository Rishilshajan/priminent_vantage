import { Metadata } from 'next'
import CandidatesView from "@/components/enterprise/candidates/CandidatesView"

export const metadata: Metadata = {
    title: 'Enterprise Candidates Management | Priminent Vantage',
    description: 'Manage and track candidate performance across all enterprise job simulations.',
}

export default function EnterpriseCandidatesPage() {
    return <CandidatesView />
}
