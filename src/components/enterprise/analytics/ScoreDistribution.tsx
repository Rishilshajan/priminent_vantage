"use client"

import { useMemo } from "react"

interface ScoreDistributionProps {
    data?: { bin: string; count: number }[];
}

export default function ScoreDistribution({ data = [] }: ScoreDistributionProps) {
    const distribution = useMemo(() => {
        if (data && data.length > 0) return data;

        // Fallback: zeroed distribution ONLY if no data is provided
        return Array.from({ length: 10 }, (_, i) => ({
            bin: `${i * 10}-${(i + 1) * 10}`,
            count: 0
        }));
    }, [data]);

    const maxCount = Math.max(...distribution.map(d => d.count), 1);

    // Stats
    const totalCount = distribution.reduce((a, b) => a + b.count, 0);
    let cumulative = 0;
    let medianBin = 5;
    for (let i = 0; i < distribution.length; i++) {
        cumulative += distribution[i].count;
        if (cumulative >= totalCount / 2) {
            medianBin = i * 10 + 5;
            break;
        }
    }
    const topTierCount = distribution[9]?.count || 0;
    const hasRealData = data && data.some(d => d.count > 0);

    return (
        <div className="bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 flex flex-col h-[420px] transition-all hover:shadow-md">
            <div className="mb-6">
                <h4 className="text-base font-black text-[#140d1b] dark:text-white tracking-tight">Score Distribution</h4>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    {hasRealData ? "Candidate Performance Density" : "Simulated Distribution · No MCQ Scores Yet"}
                </p>
            </div>

            {/* Chart */}
            <div className="flex-1 flex items-end gap-1.5 pb-2 group">
                {distribution.map((d, i) => {
                    const heightPct = (d.count / maxCount) * 100;
                    const colorClass =
                        i >= 9 ? 'bg-primary shadow-[0_2px_8px_rgba(127,19,236,0.4)]' :
                            i >= 7 ? 'bg-primary/75' :
                                i >= 5 ? 'bg-primary/50' :
                                    i >= 3 ? 'bg-indigo-300/60 dark:bg-indigo-900/60' :
                                        'bg-slate-200 dark:bg-slate-800';
                    return (
                        <div
                            key={i}
                            className="flex-1 relative group/bar cursor-default"
                            style={{ height: `${Math.max(heightPct, 4)}%` }}
                        >
                            {/* Bar */}
                            <div className={`w-full h-full rounded-t-lg transition-all duration-300 group-hover/bar:opacity-80 ${colorClass}`} />
                            {/* Tooltip */}
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#140d1b] dark:bg-white text-white dark:text-[#140d1b] text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg">
                                {d.bin}: {d.count}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* X labels */}
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <span>0</span>
                <span>50</span>
                <span>100</span>
            </div>

            {/* Summary */}
            <div className="mt-5 p-4 bg-slate-50 dark:bg-[#130d1a]/50 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-slate-400 dark:bg-slate-600"></div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Median Score</span>
                    </div>
                    <span className="text-sm font-black text-[#140d1b] dark:text-white">{medianBin}</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-primary"></div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Top Tier (90+)</span>
                    </div>
                    <span className="text-sm font-black text-[#140d1b] dark:text-white">{topTierCount}</span>
                </div>
            </div>
        </div>
    )
}
