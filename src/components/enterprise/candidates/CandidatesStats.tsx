"use client"

import { Users, UserPlus, Award, Timer } from "lucide-react"

interface CandidatesStatsProps {
    stats?: {
        totalCandidates: { value: string; change: string; trend: string };
        newThisWeek: { value: string; change: string; trend: string };
        topPerformers: { value: string; change: string; trend: string };
        avgCompletion: { value: string; change: string; trend: string };
    };
}

export default function CandidatesStats({ stats }: CandidatesStatsProps) {
    const s = stats || {
        totalCandidates: { value: "0" },
        newThisWeek: { value: "0" },
        topPerformers: { value: "0" },
        avgCompletion: { value: "0m" }
    }

    const statCards = [
        {
            title: "Total Candidates",
            value: s.totalCandidates.value,
            icon: Users,
            color: "primary"
        },
        {
            title: "New This Week",
            value: s.newThisWeek.value,
            icon: UserPlus,
            color: "blue-500"
        },
        {
            title: "Top Performers",
            value: s.topPerformers.value,
            icon: Award,
            color: "amber-500"
        },
        {
            title: "Avg. Completion",
            value: s.avgCompletion.value,
            icon: Timer,
            color: "purple-500"
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statCards.map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1f1629] p-4 md:p-6 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${stat.color === 'primary' ? 'bg-primary/10 text-primary' : `bg-${stat.color}/10 text-${stat.color}`}`}>
                            <stat.icon className="size-4 md:size-5" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">{stat.title}</p>
                    <h3 className="text-2xl md:text-3xl font-black mt-1 text-slate-900 dark:text-white">{stat.value}</h3>
                </div>
            ))}
        </div>
    )
}
