"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Calendar } from "lucide-react"

interface ChartData {
    month: string;
    enrollments: number;
    completions: number;
}

interface PerformanceChartProps {
    data: ChartData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentMonth = searchParams.get('month') || new Date().getMonth().toString()
    const currentYear = searchParams.get('year') || new Date().getFullYear().toString()

    const maxVal = Math.max(...data.flatMap(d => [d.enrollments, d.completions]), 1);
    const scale = (val: number) => (val / maxVal) * 75; // 75% max to leave room for labels

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const years = [2024, 2025, 2026];

    const handleFilterChange = (m: string, y: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('month', m)
        params.set('year', y)
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full transition-all">
            <div className="p-8 border-b border-slate-100/50 dark:border-slate-800/50 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white    flex items-center gap-2">
                        Enrollment vs Completion
                        <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 opacity-80">Monthly performance trends & engagement</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-slate-50/50 dark:bg-slate-800/30 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 px-3">
                        <Calendar className="size-3.5 text-primary" />
                        <select
                            value={currentMonth}
                            onChange={(e) => handleFilterChange(e.target.value, currentYear)}
                            className="bg-transparent text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer"
                        >
                            {monthNames.map((m, i) => (
                                <option key={m} value={i} className="dark:bg-slate-900">{m}</option>
                            ))}
                        </select>
                        <select
                            value={currentYear}
                            onChange={(e) => handleFilterChange(currentMonth, e.target.value)}
                            className="bg-transparent text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer"
                        >
                            {years.map(y => (
                                <option key={y} value={y} className="dark:bg-slate-900">{y}</option>
                            ))}
                        </select>
                    </div>

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                    <div className="flex items-center gap-4 px-3">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span className="size-2.5 rounded-full bg-gradient-to-tr from-primary to-indigo-500 shadow-sm shadow-primary/30"></span>
                            Enrollments
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span className="size-2.5 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-400 shadow-sm shadow-blue-400/30"></span>
                            Completions
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 pt-4 flex-1">
                <div className="h-72 flex items-end justify-between gap-3 sm:gap-6 px-4 border-b border-slate-100 dark:border-slate-800/50 relative pb-10">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between py-0 pointer-events-none opacity-50 pb-10">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="w-full border-t border-slate-100 dark:border-slate-800/30 border-dashed"></div>
                        ))}
                    </div>

                    {data.map((item) => (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-3 group h-full z-10">
                            <div className="w-full flex items-end justify-center gap-1.5 h-full relative group/container max-w-[80px]">
                                {/* Enrollments Bar */}
                                <div
                                    className="flex-1 min-w-[12px] max-w-[20px] bg-gradient-to-t from-primary/90 to-indigo-400 rounded-t-lg transition-all duration-500 relative overflow-visible shadow-[0_4px_15px_-5px_rgba(99,102,241,0.3)] group-hover:shadow-[0_8px_25px_-5px_rgba(99,102,241,0.5)] group-hover:scale-[1.05]"
                                    style={{ height: `${scale(item.enrollments)}%` }}
                                >
                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 z-20">
                                        {item.enrollments}
                                    </div>
                                    <div className="absolute inset-x-0 top-0 h-1 bg-white/20 rounded-full mx-0.5 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>

                                {/* Completions Bar */}
                                <div
                                    className="flex-1 min-w-[12px] max-w-[20px] bg-gradient-to-t from-blue-500/90 to-cyan-400 rounded-t-lg transition-all duration-500 relative overflow-visible shadow-[0_4px_15px_-5px_rgba(59,130,246,0.3)] group-hover:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.5)] group-hover:scale-[1.05]"
                                    style={{ height: `${scale(item.completions)}%` }}
                                >
                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 text-[9px] font-black text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 z-20">
                                        {item.completions}
                                    </div>
                                    <div className="absolute inset-x-0 top-0 h-1 bg-white/20 rounded-full mx-0.5 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center whitespace-nowrap group-hover:text-primary transition-colors mb-2">{item.month}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
