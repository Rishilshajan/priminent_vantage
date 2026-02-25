"use client"

import { Clock, CheckCircle, Award } from "lucide-react"

interface StatsCardsProps {
    stats: {
        inProgress: number;
        completed: number;
        skillsMastered: number;
        rank: string;
    };
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col justify-between rounded-2xl border border-border-color bg-white p-6 shadow-sm dark:bg-[#1e1429] dark:border-white/10">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-text-secondary dark:text-gray-400">In Progress</p>
                        <p className="text-3xl font-bold text-text-main dark:text-white">{stats.inProgress}</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                        <Clock className="size-6" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-border-color bg-white p-6 shadow-sm dark:bg-[#1e1429] dark:border-white/10">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Completed</p>
                        <p className="text-3xl font-bold text-text-main dark:text-white">{stats.completed}</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                        <CheckCircle className="size-6" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-border-color bg-white p-6 shadow-sm dark:bg-[#1e1429] dark:border-white/10">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Skills Mastered</p>
                        <p className="text-3xl font-bold text-text-main dark:text-white">{stats.skillsMastered}</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                        <Award className="size-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                </div>
            </div>
        </div>
    )
}
