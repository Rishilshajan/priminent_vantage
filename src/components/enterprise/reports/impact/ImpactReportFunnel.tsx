"use client"

import { Info } from "lucide-react"

interface FunnelStep {
    step: string
    label: string
    count: number
    percentage: number
    description: string
}

interface ImpactReportFunnelProps {
    steps: FunnelStep[]
}

export default function ImpactReportFunnel({ steps }: ImpactReportFunnelProps) {
    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Candidate Funnel Visualization</h3>
                    <p className="text-sm text-slate-500 font-bold mt-1">Tracking retention and drop-off rates through simulation milestones</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-primary shadow-sm shadow-primary/30"></span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Retention</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Drop-off</span>
                    </div>
                </div>
            </div>

            {/* Funnel Container */}
            <div className="relative pt-4 pb-4 sm:pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-1 sm:h-32">
                    {steps.map((step, index) => {
                        const opacity = 100 - (index * 15)
                        const isFirst = index === 0
                        const isLast = index === steps.length - 1

                        return (
                            <div key={index} className="relative group flex flex-col items-center">
                                <div
                                    className="h-20 sm:h-full w-full flex flex-col items-center justify-center text-white transition-all duration-500 group-hover:scale-[1.02] cursor-default"
                                    style={{
                                        backgroundColor: `rgba(127, 19, 236, ${opacity / 100})`,
                                        clipPath: isFirst
                                            ? "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)"
                                            : isLast
                                                ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%)"
                                                : "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)"
                                    }}
                                >
                                    <span className="text-lg md:text-xl font-black">{step.percentage}%</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-80">
                                        {step.step === "Completed" ? "Completed" : "Retained"}
                                    </span>
                                </div>
                                <div className="sm:absolute sm:-bottom-14 sm:left-1/2 sm:-translate-x-1/2 w-full text-center px-2 mt-4 sm:mt-0">
                                    <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 leading-tight mb-0.5 line-clamp-1">
                                        {step.label}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                        {step.count.toLocaleString()} Candidates
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5">
                    <Info className="size-4 text-amber-500 shrink-0" />
                    <span className="text-[11px] font-bold italic">
                        * Significant drop-off observed at Task 3 (Financial Modeling phase).
                    </span>
                </div>
                <button className="text-[11px] font-black text-primary uppercase tracking-[0.1em] hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    View Detailed Funnel Breakdown <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    )
}
