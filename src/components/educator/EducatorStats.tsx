"use client"

import { Rocket, Users, TrendingUp, Award } from "lucide-react"

export function EducatorStats() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col justify-between rounded-2xl border border-border-color bg-white p-6 shadow-sm dark:bg-[#1e1429] dark:border-white/10">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Active Simulations</p>
                        <p className="text-3xl font-bold text-text-main dark:text-white">3</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                        <Rocket className="size-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-blue-600">In use:</span> 2 courses
                </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-border-color bg-white p-6 shadow-sm dark:bg-[#1e1429] dark:border-white/10">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Total Students</p>
                        <p className="text-3xl font-bold text-text-main dark:text-white">124</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                        <Users className="size-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-green-600">Active:</span> 98 students
                </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-border-color bg-white p-6 shadow-sm dark:bg-[#1e1429] dark:border-white/10">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Completion Rate</p>
                        <p className="text-3xl font-bold text-text-main dark:text-white">78%</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                        <TrendingUp className="size-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-purple-600">Avg time:</span> 4.2 hours
                </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-border-color bg-white p-6 shadow-sm dark:bg-[#1e1429] dark:border-white/10">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Certificates Issued</p>
                        <p className="text-3xl font-bold text-text-main dark:text-white">86</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400">
                        <Award className="size-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-yellow-600">This month:</span> 12 new
                </div>
            </div>
        </div>
    )
}
