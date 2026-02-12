interface EngagementFunnelProps {
    data: {
        registered: number;
        withCourse: number;
        active: number;
        completed: number;
    };
    isLoading?: boolean;
}

export function EngagementFunnel({ data, isLoading }: EngagementFunnelProps) {
    if (isLoading) {
        return (
            <div className="lg:col-span-2 bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] overflow-hidden animate-pulse">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-[#382a4a]">
                    <div className="h-5 w-48 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
                <div className="p-6 md:p-8 space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg w-full" />
                    ))}
                </div>
            </div>
        )
    }

    const stages = [
        { label: "Registered", value: data.registered, percentage: 100, isBase: true },
        { label: "Selected Course", value: data.withCourse, percentage: Math.round((data.withCourse / data.registered) * 100) || 0, drop: -18 },
        { label: "Joined (Active)", value: data.active, percentage: Math.round((data.active / data.registered) * 100) || 0, drop: -11 },
        { label: "Completed", value: data.completed, percentage: Math.round((data.completed / data.registered) * 100) || 0, drop: -23 }
    ]

    return (
        <div className="lg:col-span-2 bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-[#382a4a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h4 className="text-base font-bold text-[#140d1b] dark:text-white leading-tight">Engagement Conversion Funnel</h4>
                <span className="text-xs text-[#734c9a] dark:text-[#a682cc]">Last 30 Days</span>
            </div>
            <div className="p-6 md:p-8">
                <div className="flex flex-col gap-4">
                    {stages.map((stage, i) => (
                        <div key={i} className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4">
                            <div className="text-xs font-bold text-[#734c9a] dark:text-[#a682cc] md:w-24 md:text-right flex justify-between md:block">
                                <span>{stage.label}</span>
                                {!stage.isBase && <span className="md:hidden text-red-500 font-bold text-xs">{stage.drop}%</span>}
                            </div>
                            <div className="flex-1 w-full" style={{ paddingLeft: `${i * 5}%`, paddingRight: `${i * 5}%` }}>
                                <div className={cn(
                                    "h-10 md:h-12 rounded-lg flex items-center px-4 justify-between relative shadow-sm w-full",
                                    i === 0 ? "bg-primary" : i === 1 ? "bg-primary/80" : i === 2 ? "bg-primary/60" : "bg-primary/40"
                                )}>
                                    <span className="text-white text-sm font-bold">{stage.value.toLocaleString()}</span>
                                    <span className="text-white/70 text-[10px] uppercase font-bold">
                                        {stage.isBase ? "BASE" : `${stage.percentage}%`}
                                    </span>
                                </div>
                            </div>
                            <div className="hidden md:flex w-16 items-center text-red-500 font-bold text-xs">
                                {!stage.isBase && `${stage.drop}%`}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

import { cn } from "@/lib/utils"
