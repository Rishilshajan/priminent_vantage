"use client"

import { FileCheck2, Target } from "lucide-react"

interface BusinessIntentCardProps {
    objectives: string[]
    description: string
}

export function BusinessIntentCard({ objectives, description }: BusinessIntentCardProps) {
    return (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up delay-200">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                <Target className="text-primary size-5" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                    Business Intent
                </h3>
            </div>
            <div className="space-y-6">
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Primary Objectives</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {objectives.map((obj) => (
                            <span
                                key={obj}
                                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded border border-slate-200 dark:border-slate-700 uppercase tracking-wide"
                            >
                                {obj}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Use Case Description</p>
                    <div className="relative mt-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 italic">
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            "{description}"
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
