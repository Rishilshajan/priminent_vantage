/**
 * Impact Report Page: Handles data fetching and rendering for individual simulation analytics.
 */
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getSimulationImpactReport } from "@/actions/reports/report.actions"
import ImpactReportView from "@/components/enterprise/reports/impact/ImpactReportView"
import { Skeleton } from "../../../../../../components/ui/skeleton"

interface ImpactReportPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ImpactReportPage({ params }: ImpactReportPageProps) {
    const { id } = await params

    const { data: reportData, error } = await getSimulationImpactReport(id)

    if (error || !reportData) {
        return notFound()
    }

    return (
        <Suspense fallback={<ImpactReportLoading />}>
            <ImpactReportView data={reportData} />
        </Suspense>
    )
}

function ImpactReportLoading() {
    return (
        <div className="p-8 space-y-8 animate-pulse">
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl w-3/4"></div>
            <div className="grid grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                ))}
            </div>
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="grid grid-cols-2 gap-8">
                <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
        </div>
    )
}
