"use client"

import { Users, ClipboardCheck, Trophy, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImpactReportKPIsProps {
    stats: {
        totalEnrolled: number
        enrolledTrend: number
        completionRate: number
        completionTrend: number
        avgScore: number
        scoreTrend: number
        medianTime: string
        timeTrend: number
    }
}

export default function ImpactReportKPIs({ stats }: ImpactReportKPIsProps) {
    const kpis = [
        {
            label: "Total Enrolled",
            value: stats.totalEnrolled.toLocaleString(),
            trend: stats.enrolledTrend,
            icon: Users,
            progress: 75,
        },
        {
            label: "Completion Rate",
            value: `${stats.completionRate}%`,
            trend: stats.completionTrend,
            icon: ClipboardCheck,
            progress: stats.completionRate,
        },
        {
            label: "Avg. Perf Score",
            value: `${stats.avgScore}/100`,
            trend: stats.scoreTrend,
            icon: Trophy,
            progress: stats.avgScore,
        },
        {
            label: "Median Time",
            value: stats.medianTime,
            trend: stats.timeTrend,
            icon: Timer,
            progress: 50,
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, index) => (
                <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary group-hover:scale-110 transition-transform">
                            <kpi.icon className="size-5" />
                        </div>
                        <span className={cn(
                            "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                            kpi.trend >= 0
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                        )}>
                            {kpi.trend > 0 ? "+" : ""}{kpi.trend}%
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{kpi.label}</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white   ">
                            {kpi.value}
                        </h3>
                    </div>
                    <div className="mt-5 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${kpi.progress}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    )
}
