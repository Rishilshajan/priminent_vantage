"use client"

import AnalyticsHeader from "./AnalyticsHeader"
import AnalyticsStats from "./AnalyticsStats"
import EngagementTrends from "./EngagementTrends"
import ScoreDistribution from "./ScoreDistribution"
import CoreCompetencies from "./CoreCompetencies"
import CandidateProgression from "./CandidateProgression"
import GlobalTalentSourcing from "./GlobalTalentSourcing"
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import { ChevronRight, Calendar, SlidersHorizontal } from "lucide-react"

export default function AnalyticsView() {
    return (
        <div className="flex h-screen overflow-hidden bg-[#F8F9FC] dark:bg-[#191022]">
            <DashboardSidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AnalyticsHeader />
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto w-full space-y-8">
                        <div className="flex items-end justify-between">
                            <div>
                                <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    <span>Insights</span>
                                    <ChevronRight className="size-3" />
                                    <span className="text-primary">Executive Overview</span>
                                </nav>
                                <h2 className="text-2xl font-semibold text-slate-800 dark:text-white tracking-tight">Enterprise Analytics Dashboard</h2>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                                    <Calendar className="size-4" />
                                    Rolling 30 Days
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                                    <SlidersHorizontal className="size-4" />
                                    Advanced Filters
                                </div>
                            </div>
                        </div>

                        <AnalyticsStats />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <EngagementTrends />
                            </div>
                            <ScoreDistribution />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <CoreCompetencies />
                            <CandidateProgression />
                        </div>

                        <GlobalTalentSourcing />
                    </div>
                </div>
            </main>
        </div>
    )
}
