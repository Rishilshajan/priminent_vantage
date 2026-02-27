"use client"

import { TrendingUp, TrendingDown, Users, CheckCircle2, Award, Zap } from "lucide-react"

interface AnalyticsStatsProps {
    stats?: {
        totalEnrollments: { value: string; change: string; trend: string };
        completionRate: { value: string; change: string; trend: string };
        avgScore: { value: string; change: string; trend: string };
        skillsValidated: { value: string; change: string; trend: string };
    };
}

export default function AnalyticsStats({ stats }: AnalyticsStatsProps) {
    const items = [
        {
            label: "Total Enrollments",
            value: stats?.totalEnrollments.value || "0",
            change: stats?.totalEnrollments.change || "0%",
            trend: stats?.totalEnrollments.trend || "neutral",
            icon: Users,
            color: "from-blue-500 to-indigo-600",
            bg: "bg-blue-500/10"
        },
        {
            label: "Completion Rate",
            value: stats?.completionRate.value || "0%",
            change: stats?.completionRate.change || "0%",
            trend: stats?.completionRate.trend || "neutral",
            icon: CheckCircle2,
            color: "from-emerald-500 to-teal-600",
            bg: "bg-emerald-500/10"
        },
        {
            label: "Avg. Candidate Score",
            value: stats?.avgScore.value || "0/100",
            change: stats?.avgScore.change || "0%",
            trend: stats?.avgScore.trend || "neutral",
            icon: Award,
            color: "from-amber-500 to-orange-600",
            bg: "bg-amber-500/10"
        },
        {
            label: "Skills Validated",
            value: stats?.skillsValidated.value || "0",
            change: stats?.skillsValidated.change || "0%",
            trend: stats?.skillsValidated.trend || "neutral",
            icon: Zap,
            color: "from-purple-500 to-fuchsia-600",
            bg: "bg-purple-500/10"
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item, i) => (
                <div key={i} className="group relative bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                    {/* Decorative Gradient Background */}
                    <div className={`absolute top-0 right-0 w-32 h-30 bg-gradient-to-br ${item.color} opacity-[0.03] rounded-bl-[100px] transition-opacity group-hover:opacity-[0.05]`}></div>

                    <div className="p-5 md:p-6 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 rounded-xl ${item.bg}`}>
                                <item.icon className={`size-5 bg-gradient-to-br ${item.color} bg-clip-text text-transparent`} />
                                <style jsx>{`
                                    .size-5 {
                                        color: transparent;
                                        background-image: linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to));
                                        -webkit-background-clip: text;
                                        background-clip: text;
                                    }
                                `}</style>
                                {/* Fallback if clip-text fails on icons */}
                                <item.icon className="size-5 text-indigo-500 dark:text-indigo-400 opacity-80" />
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${item.trend === 'up' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                item.trend === 'down' ? 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400' :
                                    'text-slate-500 bg-slate-50 dark:bg-slate-500/10 dark:text-slate-400'
                                }`}>
                                {item.trend === 'up' ? <TrendingUp className="size-3" /> : item.trend === 'down' ? <TrendingDown className="size-3" /> : null}
                                {item.change}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl md:text-3xl font-black text-[#140d1b] dark:text-white tracking-tight">
                                {item.value}
                            </h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{item.label}</p>
                        </div>

                        {/* Visual indicator (mini-sparkline style) */}
                        <div className="mt-4 flex items-end gap-1 h-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                                <div
                                    key={bar}
                                    className={`flex-1 rounded-t-sm transition-all duration-500 group-hover:opacity-100 ${i === 0 ? 'bg-blue-400/30' :
                                        i === 1 ? 'bg-emerald-400/30' :
                                            i === 2 ? 'bg-amber-400/30' :
                                                'bg-purple-400/30'
                                        }`}
                                    style={{
                                        height: `${20 + Math.random() * 80}%`,
                                        transitionDelay: `${bar * 50}ms`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
