"use client"

import { CheckCircle2, AlertTriangle, XCircle, Activity, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function AccessCodeActivity({ activity = [] }: { activity: any[] }) {
    const formatRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return "Just now"
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
        return date.toLocaleDateString()
    }

    const getActionProps = (actionCode: string) => {
        switch (actionCode) {
            case 'ENTERPRISE_SETUP_COMPLETED':
                return {
                    icon: <CheckCircle2 className="text-emerald-500 size-4" />,
                    bg: "bg-emerald-100 dark:bg-emerald-900/30",
                    label: "Setup Completed"
                }
            case 'ACCESS_CODE_SENT':
                return {
                    icon: <CheckCircle2 className="text-emerald-500 size-4" />,
                    bg: "bg-emerald-100 dark:bg-emerald-900/30",
                    label: "Access Sent"
                }
            case 'ACCESS_CODE_GENERATED':
                return {
                    icon: <Activity className="text-primary size-4" />,
                    bg: "bg-primary/10",
                    label: "Code Generated"
                }
            default:
                return {
                    icon: <AlertTriangle className="text-slate-500 size-4" />,
                    bg: "bg-slate-100 dark:bg-slate-800",
                    label: "System Event"
                }
        }
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="size-4 text-primary" />
                    Recent Activity
                </h3>
                <button className="text-primary text-xs font-bold hover:underline uppercase tracking-wider">View Audit Log</button>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {activity.length > 0 ? (
                    activity.map((item) => {
                        const props = getActionProps(item.action_code);
                        return (
                            <div key={item.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group">
                                <div className={cn("size-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform", props.bg)}>
                                    {props.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                            {props.label}: {item.message.split(':').pop()?.trim().substring(0, 30)}
                                        </p>
                                        <span className="text-[10px] text-slate-400 whitespace-nowrap font-medium flex items-center gap-1">
                                            <Clock className="size-2.5" />
                                            {formatRelativeTime(item.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.message}</p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                        <Activity className="size-8 opacity-20" />
                        <p className="text-sm font-medium italic">No recent access code activity.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
