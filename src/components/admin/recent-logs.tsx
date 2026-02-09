import { CheckCircle2, AlertTriangle, Info } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"
import Link from "next/link"

interface RecentLogsProps {
    logs: any[];
}

export function RecentLogs({ logs }: RecentLogsProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white">Recent System Logs</h3>
                <Link href="/admin/system-logs">
                    <button className="text-primary text-xs font-bold hover:underline cursor-pointer">View All</button>
                </Link>
            </div>
            <div className="space-y-4">
                {logs.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No recent logs.</p>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3">
                            <div className={`size-8 rounded flex items-center justify-center flex-shrink-0 ${log.level === 'SUCCESS' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                                log.level === 'WARNING' || log.level === 'ERROR' ? 'bg-amber-100 dark:bg-amber-900/30' :
                                    'bg-primary/10'
                                }`}>
                                {log.level === 'SUCCESS' ? <CheckCircle2 className="text-emerald-500 size-4" /> :
                                    log.level === 'WARNING' || log.level === 'ERROR' ? <AlertTriangle className="text-amber-500 size-4" /> :
                                        <Info className="text-primary size-4" />}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{log.action_code}</p>
                                <p className="text-xs text-slate-500 italic">{log.message}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                    {formatRelativeTime(log.timestamp)} • {log.actor_name || log.actor_id || 'System'}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
