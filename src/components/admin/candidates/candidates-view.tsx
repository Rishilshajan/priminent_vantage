"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { CandidatesStats } from "./candidates-stats"
import { EngagementFunnel } from "./engagement-funnel"
import { AnalyticsFilters } from "./analytics-filters"
import { CandidateActivity } from "./candidate-activity"
import { Search, Download, Bell, Menu, RefreshCcw } from "lucide-react"
import { getCandidateStats, getCandidateActivity } from "@/actions/candidate.actions"
import { useDebounce } from "../../../hooks/use-debounce"

export default function CandidatesDashboardView({ profile }: { profile: any }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearch = useDebounce(searchQuery, 500)

    const [stats, setStats] = useState<any>(null)
    const [activities, setActivities] = useState<any[]>([])

    const fetchData = useCallback(async (search?: string) => {
        setIsLoading(true)
        try {
            const [statsRes, activityRes] = await Promise.all([
                getCandidateStats(),
                getCandidateActivity(search)
            ])

            if (statsRes.success) setStats(statsRes.stats)
            if (activityRes.success && activityRes.data) setActivities(activityRes.data)
        } catch (error) {
            console.error("Error loading candidate data:", error)
        } finally {
            setIsLoading(false)
        }
    }, [debouncedSearch])

    useEffect(() => {
        fetchData(debouncedSearch)
    }, [debouncedSearch, fetchData])

    const handleRefresh = () => fetchData(debouncedSearch)

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50/30 dark:bg-black/20">
            <AdminSidebar
                user={profile}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Custom Header for Candidates Page */}
                <header className="min-h-16 py-3 border-b border-slate-200 dark:border-[#382a4a] bg-white dark:bg-[#191022] flex flex-row items-center justify-between px-4 md:px-8 shrink-0 gap-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shrink-0"
                        >
                            <Menu className="size-6" />
                        </button>
                        <h2 className="text-base md:text-xl font-bold text-[#140d1b] dark:text-white truncate">Candidates Engagement Analytics</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#734c9a] size-4 pointer-events-none" />
                            <input
                                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#2d2238] border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64 text-[#140d1b] dark:text-white placeholder-[#734c9a]"
                                placeholder="Search candidates..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="p-2 text-[#734c9a] dark:text-[#a682cc] hover:bg-slate-50 dark:hover:bg-[#2d2238] rounded-lg transition-colors"
                        >
                            <RefreshCcw className={cn("size-5", isLoading && "animate-spin")} />
                        </button>
                        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm shadow-primary/20 hover:shadow-primary/40 transition-all">
                            <Download className="size-4" />
                            <span className="hidden sm:inline">Export Data</span>
                        </button>
                        <div className="h-6 w-px bg-slate-200 dark:border-[#382a4a] hidden md:block"></div>
                        <button className="relative p-2 text-[#734c9a] dark:text-[#a682cc] hover:bg-slate-50 dark:hover:bg-[#2d2238] rounded-lg transition-colors">
                            <Bell className="size-5" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-[#191022] rounded-full"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-[#f7f6f8] dark:bg-[#191022]">
                    <CandidatesStats
                        stats={stats || {
                            totalRegistered: 0,
                            courseEnrollments: 0,
                            activeParticipants: 0,
                            completionRate: 0,
                            growth: { registered: "0%", enrollments: "0%", participants: "0%", completion: "0%" }
                        }}
                        isLoading={isLoading && !stats}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <EngagementFunnel
                            data={stats ? {
                                registered: stats.totalRegistered,
                                withCourse: Math.floor(stats.totalRegistered * 0.82),
                                active: stats.courseEnrollments,
                                completed: Math.floor(stats.totalRegistered * 0.48)
                            } : { registered: 0, withCourse: 0, active: 0, completed: 0 }}
                            isLoading={isLoading && !stats}
                        />
                        <AnalyticsFilters />
                    </div>
                    <CandidateActivity
                        activities={activities}
                        isLoading={isLoading}
                    />
                </div>
            </main>
        </div>
    )
}

import { cn } from "@/lib/utils"
