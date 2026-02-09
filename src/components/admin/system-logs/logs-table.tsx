import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { SystemLog } from "@/lib/logger"

interface LogTableProps {
    onSelectLog: (id: string) => void
    selectedLogId?: string | null
    logs: SystemLog[]
    isLoading: boolean
}

export function LogTable({ onSelectLog, selectedLogId, logs, isLoading }: LogTableProps) {
    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    if (logs.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-slate-500">
                No logs found.
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
                <table className="w-full min-w-[1000px] text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider z-10">
                        <tr>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Timestamp</th>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Level</th>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Actor</th>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Event Type</th>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Detailed Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {logs.map((log) => (
                            <tr
                                key={log.id}
                                className={cn(
                                    "transition-colors cursor-pointer group",
                                    selectedLogId === log.id
                                        ? "bg-primary/5 dark:bg-primary/10"
                                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                )}
                                onClick={() => onSelectLog(log.id)}
                            >
                                <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2 py-1 rounded text-[10px] font-bold uppercase",
                                        log.level === 'SUCCESS' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                                        log.level === 'INFO' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                                        log.level === 'WARNING' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                                        log.level === 'ERROR' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                                        log.level === 'CRITICAL' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                    )}>
                                        {log.level}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "size-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                                            log.actor_type === 'system' ? "bg-slate-200 dark:bg-slate-700 text-slate-500" : "bg-primary/20 text-primary"
                                        )}>
                                            {(log.actor_name || log.actor_email || 'S').substring(0, 1).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            {log.actor_name || log.actor_email || 'System'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        {log.action_code}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-md">
                                        {log.message || JSON.stringify(log.params) || '-'}
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">Showing {logs.length} entries</p>
                <div className="flex gap-1">
                    <button disabled className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
                        <ChevronLeft className="size-4" />
                    </button>
                    <button className="size-8 flex items-center justify-center rounded bg-primary text-white font-bold text-xs">1</button>
                    <button disabled className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
