"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { EducatorsStats } from "./educators-stats"
import { EducatorsFunnel } from "./educators-funnel"
import { EducatorsFilters } from "./educators-filters"
import { EducatorsTable } from "./educators-table"
import { Menu, Download, Plus } from "lucide-react"

export default function EducatorsDashboardView({ profile }: { profile: any }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50/30 dark:bg-black/20">
            <AdminSidebar
                user={profile}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Header Section */}
                <div className="px-4 md:px-8 pt-6 shrink-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-start gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shrink-0"
                            >
                                <Menu className="size-6" />
                            </button>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#140d1b] dark:text-white">Educators Engagement</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track and manage educator activity and classroom engagement across the platform.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-[#382a4a] rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#2d1e3d] transition-colors text-[#140d1b] dark:text-white">
                                <Download className="size-4" />
                                Export Data
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all md:hidden">
                                <Plus className="size-4" />
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 space-y-8 bg-[#f7f6f8] dark:bg-[#191022]">
                    <EducatorsStats />
                    <EducatorsFunnel />
                    <div>
                        <EducatorsFilters />
                        <EducatorsTable />
                    </div>
                </div>
            </main>
        </div>
    )
}
