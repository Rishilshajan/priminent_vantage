"use client"

/**
 * Main view component for the Simulation Impact Report dashboard.
 * Provides specialized analytics visualizations including KPIs, Funnels, and Heatmaps.
 */

import type { ImpactReportData } from "@/lib/reports/report.service"
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/enterprise/dashboard/DashboardHeader"
import ImpactReportKPIs from "@/components/enterprise/reports/impact/ImpactReportKPIs"
import ImpactReportFunnel from "@/components/enterprise/reports/impact/ImpactReportFunnel"
import ImpactReportHeatmap from "@/components/enterprise/reports/impact/ImpactReportHeatmap"
import ImpactReportDemographics from "@/components/enterprise/reports/impact/ImpactReportDemographics"
import ImpactReportTalentTable from "@/components/enterprise/reports/impact/ImpactReportTalentTable"
import { Button } from "@/components/ui/button"
import { Share2, Download, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

interface ImpactReportViewProps {
    data: ImpactReportData
}

export default function ImpactReportView({ data }: ImpactReportViewProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <DashboardSidebar orgName="Enterprise" />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <DashboardHeader orgName="Enterprise" />

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-12 space-y-8 bg-slate-50 dark:bg-slate-950/30 custom-scrollbar">
                    {/* Breadcrumbs & Actions */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                        <div className="space-y-4">
                            <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <a href="/enterprise/reports" className="hover:text-primary transition-colors">Reports</a>
                                <ChevronRight className="size-3" />
                                <span className="text-slate-600 dark:text-slate-300">Impact Analysis</span>
                            </nav>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                    {data.simulation.title}
                                </h1>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase tracking-widest shrink-0 w-fit">
                                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    LIVE
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm">
                                Ref ID: <span className="text-primary">PV-{data.simulation.id.slice(0, 8).toUpperCase()}</span> • Created {mounted ? formatDate(data.simulation.created_at) : '...'}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <Button variant="outline" className="flex-1 sm:flex-none h-11 px-6 rounded-xl font-black uppercase tracking-widest text-[11px] gap-2 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all active:scale-95 shadow-sm">
                                <Share2 className="size-4" />
                                Share Report
                            </Button>
                            <Button className="flex-1 sm:flex-none h-11 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-black uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-primary/25 transition-all active:scale-95">
                                <Download className="size-4" />
                                Export Insights
                            </Button>
                        </div>
                    </div>

                    {/* KPI Cards Grid */}
                    <ImpactReportKPIs stats={data.stats} />

                    {/* Funnel Visualization */}
                    <ImpactReportFunnel steps={data.funnel} />

                    {/* Skills & Demographics Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ImpactReportHeatmap skills={data.skills} />
                        <ImpactReportDemographics institutions={data.institutions} regions={data.regions} />
                    </div>

                    {/* Top Talent Table */}
                    <ImpactReportTalentTable talent={data.topTalent} totalCandidates={data.stats.totalEnrolled} />
                </div>
            </main>
        </div>
    )
}
