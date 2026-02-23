"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { LogFilterBar, LogFilters } from "./logs-filter-bar"
import { LogTable } from "./logs-table"
import { LogDetailsPanel } from "./log-details-panel"
import { Download, Bell, Menu } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SystemLog, logSystemEvent } from "@/lib/logger/index"

export function SystemLogsContent({ profile }: { profile: any }) {
    const searchParams = useSearchParams()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null)
    const [logs, setLogs] = useState<SystemLog[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Pagination state
    const [page, setPage] = useState(1)
    const [pageSize] = useState(12)
    const [totalCount, setTotalCount] = useState(0)

    const [filters, setFilters] = useState<LogFilters>({
        search: '',
        dateRange: '',
        level: '',
        category: searchParams.get('category') || ''
    })

    const fetchLogs = useCallback(async () => {
        setIsLoading(true)
        const supabase = createClient()
        let query = supabase
            .from('system_logs')
            .select('*', { count: 'exact' })
            .order('timestamp', { ascending: false })

        // Apply filters
        if (filters.level) {
            query = query.eq('level', filters.level)
        }

        if (filters.category) {
            query = query.eq('action_category', filters.category)
        }

        if (filters.search) {
            const s = `%${filters.search}%`
            query = query.or(`action_code.ilike.${s},message.ilike.${s},actor_name.ilike.${s}`)
        }

        if (filters.dateRange) {
            const dateObj = new Date(filters.dateRange)
            if (!isNaN(dateObj.getTime())) {
                // Set to local start and end of the day
                const start = new Date(dateObj)
                start.setHours(0, 0, 0, 0)
                const end = new Date(dateObj)
                end.setHours(23, 59, 59, 999)

                query = query.gte('timestamp', start.toISOString()).lte('timestamp', end.toISOString())
            }
        }

        // Apply Pagination
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1
        query = query.range(from, to)

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching logs:', JSON.stringify(error, null, 2))
        } else {
            setLogs(data as SystemLog[])
            setTotalCount(count || 0)
        }
        setIsLoading(false)
    }, [filters, page, pageSize])

    useEffect(() => {
        setPage(1)
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
                        isFiltering={!!(filters.search || filters.level || filters.dateRange || filters.category)}
                    />

                    <div className="flex-1 flex overflow-hidden">
                        <LogTable
                            onSelectLog={setSelectedLogId}
                            selectedLogId={selectedLogId}
                            logs={logs}
                            isLoading={isLoading}
                            page={page}
                            pageSize={pageSize}
                            totalCount={totalCount}
                            onPageChange={setPage}
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

export default function SystemLogsView(props: { profile: any }) {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <SystemLogsContent {...props} />
        </Suspense>
    )
}
