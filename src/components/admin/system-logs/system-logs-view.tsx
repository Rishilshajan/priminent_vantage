"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { LogFilterBar } from "./logs-filter-bar"
import { LogTable } from "./logs-table"
import { LogDetailsPanel } from "./log-details-panel"
import { Download, Bell, Menu } from "lucide-react"

export default function SystemLogsView({ profile }: { profile: any }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null)

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50/30 dark:bg-black/20">
            <AdminSidebar
                user={profile}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Custom Header for Logs Page */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 md:px-8 shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Trigger */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                            <Menu className="size-6" />
                        </button>
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">System Audit Logs</h2>
                        <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-slate-700">Live</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            <Download className="size-3.5" />
                            Export CSV/JSON
                        </button>
                        <div className="h-6 w-px bg-slate-200 dark:border-slate-700 hidden md:block"></div>
                        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <Bell className="size-5" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900 relative">
                    <LogFilterBar />

                    <div className="flex-1 flex overflow-hidden">
                        <LogTable
                            onSelectLog={setSelectedLogId}
                            selectedLogId={selectedLogId}
                        />
                        {selectedLogId && (
                            <LogDetailsPanel onClose={() => setSelectedLogId(null)} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
