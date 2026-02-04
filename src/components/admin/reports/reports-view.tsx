"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ReportsStats } from "./reports-stats"
import { ReportsFilters } from "./reports-filters"
import { EngagementTable } from "./engagement-table"
import { EnrollmentChart } from "./enrollment-chart"
import { TopPartners } from "./top-partners"
import { Search, Download, Bell, Menu } from "lucide-react"

export default function ReportsDashboardView({ profile }: { profile: any }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50/30 dark:bg-black/20">
            <AdminSidebar
                user={profile}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Custom Header for Reports Page */}
                <header className="min-h-16 py-3 border-b border-slate-200 dark:border-[#382a4a] bg-white dark:bg-[#191022] flex flex-row items-center justify-between px-4 md:px-8 shrink-0 gap-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shrink-0"
                        >
                            <Menu className="size-6" />
                        </button>
                        <div>
                            <h2 className="text-base md:text-xl font-bold text-[#140d1b] dark:text-white truncate">Company Engagement & Performance Report</h2>
                            <p className="hidden md:block text-xs text-[#734c9a] dark:text-[#a682cc]">Last updated: Oct 24, 2023 at 09:41 AM</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <div className="relative group hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#734c9a] size-4 pointer-events-none" />
                            <input
                                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#2d1e3d] border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-48 xl:w-64 text-[#140d1b] dark:text-white placeholder-[#734c9a]"
                                placeholder="Quick search..."
                                type="text"
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm shadow-primary/20 hover:shadow-primary/40 transition-all">
                            <Download className="size-4" />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                        <div className="h-6 w-px bg-slate-200 dark:border-[#382a4a] hidden md:block"></div>
                        <button className="relative p-2 text-[#734c9a] dark:text-[#a682cc] hover:bg-slate-50 dark:hover:bg-[#2d1e3d] rounded-lg transition-colors">
                            <Bell className="size-5" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-[#f7f6f8] dark:bg-[#191022]">
                    <ReportsStats />
                    <ReportsFilters />
                    <EngagementTable />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <EnrollmentChart />
                        <TopPartners />
                    </div>

                    <footer className="text-center text-[#734c9a] dark:text-[#a682cc] text-sm pt-4 pb-2">
                        <p>© 2026 Priminent Vantage Analytics. All rights reserved.</p>
                    </footer>
                </div>
            </main>
        </div>
    )
}
