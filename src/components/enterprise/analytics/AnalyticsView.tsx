"use client"

import { useState, useEffect } from "react"
import AnalyticsHeader from "./AnalyticsHeader"
import AnalyticsStats from "./AnalyticsStats"
import EngagementTrends from "./EngagementTrends"
import ScoreDistribution from "./ScoreDistribution"
import CoreCompetencies from "./CoreCompetencies"
import CandidateProgression from "./CandidateProgression"
import GlobalTalentSourcing from "./GlobalTalentSourcing"
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ChevronRight, Calendar, SlidersHorizontal, Loader2 } from "lucide-react"
import { getAnalyticsDataAction } from "@/actions/enterprise/analytics.actions"

interface AnalyticsViewProps {
    userProfile?: any;
    organization?: {
        id: string;
        name: string;
    } | null;
}

export default function AnalyticsView({ userProfile, organization }: AnalyticsViewProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const orgName = organization?.name || "Organization"

    useEffect(() => {
        async function loadData() {
            try {
                const result = await getAnalyticsDataAction();
                if (result.success) {
                    setData(result.data);
                }
            } catch (err) {
                console.error("Failed to load analytics data:", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F8F9FC] dark:bg-[#191022]">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

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
                <AnalyticsHeader
                    onMenuClick={() => setIsSidebarOpen(true)}
                    userProfile={userProfile}
                    onSearch={setSearchQuery}
                    orgName={orgName}
                />
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto w-full space-y-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Enterprise Analytics Dashboard</h2>
                            </div>
                            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                                <div className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-primary dark:bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 rounded-xl text-xs font-black text-white cursor-pointer active:scale-95 transition-all">
                                    <Calendar className="size-4" />
                                    <span className="truncate uppercase tracking-wider">Rolling 30 Days</span>
                                </div>
                            </div>
                        </div>

                        <AnalyticsStats stats={data?.stats} />

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            <div className="xl:col-span-2 overflow-hidden">
                                <EngagementTrends data={data?.trends} />
                            </div>
                            <div className="overflow-hidden">
                                <ScoreDistribution data={data?.scoreDistribution} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <CoreCompetencies skills={data?.topSkills} />
                            <CandidateProgression funnel={data?.progressionFunnel} />
                        </div>

                        <div className="overflow-x-auto">
                            <div className="min-w-[800px] lg:min-w-0">
                                <GlobalTalentSourcing
                                    geoData={data?.geoDistribution}
                                    institutionData={data?.institutionDistribution}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
