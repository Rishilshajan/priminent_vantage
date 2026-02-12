"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function EducatorCurrentSimulations() {
    const simulations = [
        {
            id: 1,
            company: "GLOBAL TECH CORP",
            title: "Cybersecurity Analyst",
            module: "Module 3: Intrusion Detection & Response",
            progress: 65,
            daysLeft: 8,
            icon: "🔒",
            color: "from-slate-700 to-slate-900"
        },
        {
            id: 2,
            company: "MARKETING LAB",
            title: "Digital Strategy Pro",
            module: "Module 1: Audience Segmentation",
            progress: 12,
            daysLeft: 14,
            icon: "📊",
            color: "from-purple-600 to-pink-600"
        }
    ]

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-main dark:text-white">Current Simulations</h2>
                <Link
                    href="/educators/simulations"
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                    View all
                    <ArrowRight className="size-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {simulations.map((sim) => (
                    <div
                        key={sim.id}
                        className="flex flex-col gap-4 rounded-2xl border border-border-color bg-white p-6 shadow-sm dark:bg-[#1e1429] dark:border-white/10 lg:flex-row"
                    >
                        <div className={`flex size-32 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sim.color} text-6xl`}>
                            {sim.icon}
                        </div>

                        <div className="flex flex-1 flex-col justify-between gap-3">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400">
                                    {sim.company}
                                </p>
                                <h3 className="mt-1 text-lg font-bold text-text-main dark:text-white">
                                    {sim.title}
                                </h3>
                                <p className="mt-1 text-sm text-text-secondary dark:text-gray-400">
                                    {sim.module}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-primary">{sim.progress}% Progress</span>
                                    <span className="text-text-secondary dark:text-gray-400">{sim.daysLeft} days left</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all"
                                        style={{ width: `${sim.progress}%` }}
                                    />
                                </div>
                            </div>

                            <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-dark">
                                Continue
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
