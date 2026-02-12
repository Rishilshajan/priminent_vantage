import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CandidatesStatsProps {
    stats: {
        totalRegistered: number;
        courseEnrollments: number;
        activeParticipants: number;
        completionRate: number;
        growth: {
            registered: string;
            enrollments: string;
            participants: string;
            completion: string;
        };
    };
    isLoading?: boolean;
}

export function CandidatesStats({ stats, isLoading }: CandidatesStatsProps) {
    if (isLoading || !stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm animate-pulse">
                        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-4" />
                        <div className="flex items-end justify-between">
                            <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
                            <div className="h-6 w-12 bg-slate-100 dark:bg-slate-800 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const cards = [
        {
            label: "Total Registered Students",
            value: stats.totalRegistered.toLocaleString(),
            growth: stats.growth.registered,
            isNegative: stats.growth.registered.startsWith('-')
        },
        {
            label: "Course Enrollments",
            value: stats.courseEnrollments.toLocaleString(),
            growth: stats.growth.enrollments,
            isNegative: stats.growth.enrollments.startsWith('-')
        },
        {
            label: "Active Participants",
            value: stats.activeParticipants.toLocaleString(),
            growth: stats.growth.participants,
            isNegative: stats.growth.participants.startsWith('-')
        },
        {
            label: "Completion Rate",
            value: `${stats.completionRate}%`,
            growth: stats.growth.completion,
            isNegative: stats.growth.completion.startsWith('-')
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => (
                <div key={i} className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm">
                    <p className="text-[#734c9a] dark:text-[#a682cc] text-sm font-medium mb-1">{card.label}</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold text-[#140d1b] dark:text-white">{card.value}</h3>
                        <span className={cn(
                            "text-sm font-bold flex items-center gap-1 px-2 py-0.5 rounded-full",
                            card.isNegative
                                ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                                : "text-green-600 bg-green-50 dark:bg-green-900/20"
                        )}>
                            {card.isNegative ? <TrendingDown className="size-3.5" /> : <TrendingUp className="size-3.5" />}
                            {card.growth}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}
