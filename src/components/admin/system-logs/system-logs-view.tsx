"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { LogFilterBar, LogFilters } from "./logs-filter-bar"
import { LogTable } from "./logs-table"
import { LogDetailsPanel } from "./log-details-panel"
import { Download, Bell, Menu } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SystemLog, logSystemEvent } from "@/lib/logger"

export default function SystemLogsView({ profile }: { profile: any }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null)
    const [logs, setLogs] = useState<SystemLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filters, setFilters] = useState<LogFilters>({ search: '', dateRange: '', level: '' })

    const fetchLogs = useCallback(async () => {
        setIsLoading(true)
        const supabase = createClient()
        let query = supabase
            .from('system_logs')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(100)

        // Apply filters
        if (filters.level) {
            query = query.eq('level', filters.level)
        }

        if (filters.search) {
            // Check if search matches UUID/Text fields
            // Supabase 'or' syntax for simple search across multiple columns
            query = query.or(`action_code.ilike.%${filters.search}%,message.ilike.%${filters.search}%,actor_name.ilike.%${filters.search}%`)
        }

        if (filters.dateRange) {
            // Simple date filtering (exact day or >= date) for now.
            // A more robust implementation would parse Start/End range.
            // Assuming format YYYY-MM-DD for simple equality or similar.
            query = query.gte('timestamp', filters.dateRange)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching logs:', error)
        } else {
            setLogs(data as SystemLog[])
        }
        setIsLoading(false)
    }, [filters])

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    const handleExport = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(logs, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `system_logs_${new Date().toISOString()}.json`;
        link.click();
    };

    const selectedLog = logs.find(log => log.id === selectedLogId)

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
                        <button
                            onClick={async () => {
                                setIsLoading(true)
                                await logSystemEvent({
                                    level: 'INFO',
                                    action_code: 'TEST_LOG_GENERATED',
                                    actor_name: 'Test Actor',
                                    message: 'This is a test log entry generated from the UI.',
                                    params: { test: true, timestamp: new Date().toISOString() }
                                })
                                // Artificial delay to allow DB propagation
                                setTimeout(fetchLogs, 1000)
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-blue-600 dark:text-blue-400"
                        >
                            <Bell className="size-3.5" />
                            Test Log
                        </button>
                        <div className="h-6 w-px bg-slate-200 dark:border-slate-700 hidden md:block"></div>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
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
                    <LogFilterBar
                        onFilter={setFilters}
                        isFiltering={!!(filters.search || filters.level || filters.dateRange)}
                    />

                    <div className="flex-1 flex overflow-hidden">
                        <LogTable
                            onSelectLog={setSelectedLogId}
                            selectedLogId={selectedLogId}
                            logs={logs}
                            isLoading={isLoading}
                        />
                        {selectedLog && (
                            <LogDetailsPanel
                                log={selectedLog}
                                onClose={() => setSelectedLogId(null)}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
