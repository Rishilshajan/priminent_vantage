"use client"

import { useState } from "react"
import AnalyticsHeader from "./AnalyticsHeader"
import AnalyticsStats from "./AnalyticsStats"
import EngagementTrends from "./EngagementTrends"
import ScoreDistribution from "./ScoreDistribution"
import CoreCompetencies from "./CoreCompetencies"
import CandidateProgression from "./CandidateProgression"
import GlobalTalentSourcing from "./GlobalTalentSourcing"
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ChevronRight, Calendar, SlidersHorizontal } from "lucide-react"

interface AnalyticsViewProps {
    userProfile?: any;
    organization?: {
        name: string;
    } | null;
}

export default function AnalyticsView({ userProfile, organization }: AnalyticsViewProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const orgName = organization?.name || "Organization"

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8F9FC] dark:bg-[#191022]">
            {/* Desktop Sidebar */}
            <DashboardSidebar orgName={orgName} userProfile={userProfile} />

            {/* Mobile Sidebar */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent side="left" className="p-0 w-72">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <DashboardSidebar
                        orgName={orgName}
                        userProfile={userProfile}
                        className="flex border-none w-full h-full static"
                        onLinkClick={() => setIsSidebarOpen(false)}
                    />
                </SheetContent>
            </Sheet>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AnalyticsHeader onMenuClick={() => setIsSidebarOpen(true)} userProfile={userProfile} />
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto w-full space-y-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                            <div>
                                <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    <span>Insights</span>
                                    <ChevronRight className="size-3" />
                                    <span className="text-primary">Executive Overview</span>
                                </nav>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white   ">Enterprise Analytics Dashboard</h2>
                            </div>
                            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                                <div className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                                    <Calendar className="size-4" />
                                    <span className="truncate">Rolling 30 Days</span>
                                </div>
                                <div className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                                    <SlidersHorizontal className="size-4" />
                                    <span className="truncate">Advanced Filters</span>
                                </div>
                            </div>
                        </div>

                        <AnalyticsStats />

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            <div className="xl:col-span-2 overflow-hidden">
                                <EngagementTrends />
                            </div>
                            <div className="overflow-hidden">
                                <ScoreDistribution />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <CoreCompetencies />
                            <CandidateProgression />
                        </div>

                        <div className="overflow-x-auto">
                            <div className="min-w-[800px] lg:min-w-0">
                                <GlobalTalentSourcing />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
