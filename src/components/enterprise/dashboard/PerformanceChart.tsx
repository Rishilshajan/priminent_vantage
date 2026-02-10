"use client"

interface ChartData {
    month: string;
    enrollments: number;
    completions: number;
}

interface PerformanceChartProps {
    data: ChartData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Enrollment vs Completion</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Monthly performance trends for active cohorts</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span className="size-2 rounded-full bg-primary shadow-sm shadow-primary/30"></span>
                        Enrollments
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span className="size-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400/30"></span>
                        Completions
                    </div>
                </div>
            </div>

            <div className="p-8 flex-1">
                <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-l border-slate-100 dark:border-slate-800 relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[length:24px_24px]">
                    {data.map((item) => (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full">
                            <div className="w-full flex flex-col justify-end gap-1 h-full max-w-[40px]">
                                {/* Enrollments Bar */}
                                <div
                                    className="w-full bg-primary/80 group-hover:bg-primary rounded-t-lg transition-all relative overflow-hidden group/bar"
                                    style={{ height: `${item.enrollments}%` }}
                                >
                                    <div className="absolute top-2 left-0 w-full text-center text-[8px] font-black text-white/50 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                        {item.enrollments}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                </div>
                                {/* Completions Bar */}
                                <div
                                    className="w-full bg-blue-400/80 group-hover:bg-blue-400 rounded-t-sm transition-all relative group/bar-sub"
                                    style={{ height: `${item.completions}%` }}
                                >
                                    <div className="absolute top-1 left-0 w-full text-center text-[8px] font-black text-white/50 opacity-0 group-hover/bar-sub:opacity-100 transition-opacity">
                                        {item.completions}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.month}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
