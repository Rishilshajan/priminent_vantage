"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatItem {
    value: string;
    change: string;
    trend: string;
}

interface StatsCardsProps {
    stats: {
        totalEnrollments: StatItem;
        completionRate: StatItem;
        avgTimeToComplete: StatItem;
        activeSimulations: StatItem;
    };
}

export default function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            label: "Total Enrollments",
            value: stats?.totalEnrollments?.value || "0",
            change: stats?.totalEnrollments?.change || "",
            trend: stats?.totalEnrollments?.trend || "neutral",
            icon: "how_to_reg",
            bgColor: "bg-blue-50 dark:bg-blue-500/10",
            textColor: "text-blue-600"
        },
        {
            label: "Completion Rate",
            value: stats?.completionRate?.value || "0%",
            change: stats?.completionRate?.change || "",
            trend: stats?.completionRate?.trend || "neutral",
            icon: "history_edu",
            bgColor: "bg-purple-50 dark:bg-primary/10",
            textColor: "text-primary"
        },
        {
            label: "Avg. Time to Complete",
            value: stats?.avgTimeToComplete?.value || "N/A",
            change: stats?.avgTimeToComplete?.change || "",
            trend: stats?.avgTimeToComplete?.trend || "neutral",
            icon: "hourglass_empty",
            bgColor: "bg-amber-50 dark:bg-amber-500/10",
            textColor: "text-amber-600"
        },
        {
            label: "Active Simulations",
            value: stats?.activeSimulations?.value || "0",
            change: stats?.activeSimulations?.change || "",
            trend: stats?.activeSimulations?.trend || "neutral",
            icon: "rocket_launch",
            bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
            textColor: "text-emerald-600"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
                <div key={card.label} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none group">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-2.5 ${card.bgColor} ${card.textColor} rounded-2xl group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-2xl font-bold">{card.icon}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{card.label}</p>
                        <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white tracking-tight">{card.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    )
}
