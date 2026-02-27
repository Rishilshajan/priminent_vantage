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
import { cn } from "@/lib/utils"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface ImpactReportViewProps {
    data: ImpactReportData
}

export default function ImpactReportView({ data }: ImpactReportViewProps) {
    const [mounted, setMounted] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleExportInsights = async () => {
        if (!data) return;
        setIsExporting(true);

        try {
            const doc = new jsPDF();
            const now = new Date();
            const ddmmyy = now.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).replace(/\//g, '');

            const fileName = `${data.simulation.title.toLowerCase().replace(/\s+/g, '_')}_${ddmmyy}.pdf`;

            // 1. Header
            doc.setFontSize(22);
            doc.setTextColor(127, 19, 236); // Primary color
            doc.text("Simulation Impact Report", 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

            doc.line(14, 35, 196, 35);

            // 2. Simulation Details
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text(data.simulation.title, 14, 45);

            doc.setFontSize(10);
            doc.text(`Reference ID: PV-${data.simulation.id.slice(0, 15).toUpperCase()}`, 14, 52);
            doc.text(`Status: ${data.simulation.status.toUpperCase()}`, 14, 57);

            // 3. KPI Summary Table
            doc.setFontSize(14);
            doc.text("Performance Metrics", 14, 70);

            autoTable(doc, {
                startY: 75,
                head: [['Metric', 'Value', 'Trend']],
                body: [
                    ['Total Enrolled', data.stats.totalEnrolled.toLocaleString(), `${data.stats.enrolledTrend}%`],
                    ['Completion Rate', `${data.stats.completionRate}%`, `${data.stats.completionTrend}%`],
                    ['Avg. Performance Score', `${data.stats.avgScore}/100`, `${data.stats.scoreTrend}%`],
                    ['Median Completion Time', data.stats.medianTime, `${data.stats.timeTrend}%`]
                ],
                headStyles: { fillColor: [127, 19, 236] },
            });

            // 4. Funnel Table
            const finalY = (doc as any).lastAutoTable.finalY || 75;
            doc.setFontSize(14);
            doc.text("Candidate Progression Funnel", 14, finalY + 15);

            autoTable(doc, {
                startY: finalY + 20,
                head: [['Step', 'Milestone', 'Count', 'Conversion']],
                body: data.funnel.map(step => [
                    step.step,
                    step.label,
                    step.count.toLocaleString(),
                    `${step.percentage}%`
                ]),
                headStyles: { fillColor: [127, 19, 236] },
            });

            // 5. Talent Table (New Page if needed)
            const funnelY = (doc as any).lastAutoTable.finalY || finalY + 20;
            doc.addPage();
            doc.setFontSize(14);
            doc.text("Top Talent Highlights", 14, 20);

            autoTable(doc, {
                startY: 25,
                head: [['Rank', 'Candidate', 'Institution', 'Score', 'Location']],
                body: data.topTalent.map((t, i) => [
                    `#${i + 1}`,
                    t.name,
                    t.institution,
                    t.score.toString(),
                    t.location
                ]),
                headStyles: { fillColor: [127, 19, 236] },
            });

            // Save PDF
            doc.save(fileName);
        } catch (error) {
            console.error("PDF Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    };

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
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white    leading-tight">
                                    {data.simulation.title}
                                </h1>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase tracking-widest shrink-0 w-fit">
                                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    LIVE
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm">
                                Ref ID: <span className="text-primary">PV-{data.simulation.id.slice(0, 15).toUpperCase()}</span> • Created {mounted ? formatDate(data.simulation.created_at) : '...'}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <Button
                                onClick={handleExportInsights}
                                disabled={isExporting}
                                className="flex-1 sm:flex-none h-11 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-black uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Download className={cn("size-4", isExporting && "animate-bounce")} />
                                {isExporting ? "Generating PDF..." : "Export Insights"}
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
