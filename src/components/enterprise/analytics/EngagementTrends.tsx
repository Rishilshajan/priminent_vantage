"use client"

import { useMemo } from "react"

interface EngagementTrendsProps {
    data?: { date: string; label: string; enrollments: number; completions: number }[];
}

export default function EngagementTrends({ data = [] }: EngagementTrendsProps) {
    const chartData = useMemo(() => {
        if (data && data.length > 0) return data;

        // Fallback: synthetic data for visual pattern ONLY if no data is provided
        return Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return {
                date: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                enrollments: 0,
                completions: 0
            };
        });
    }, [data]);

    const maxVal = Math.max(...chartData.map(d => Math.max(d.enrollments, d.completions)), 1);
    const W = 1000;
    const H = 250;
    const PAD_Y = 10;

    // Build polyline points from data
    const getPolyPoints = (key: 'enrollments' | 'completions') => {
        return chartData.map((d, i) => {
            const x = (i / (chartData.length - 1)) * W;
            const y = H - PAD_Y - ((d[key] / maxVal) * (H - PAD_Y * 2));
            return `${x},${y}`;
        }).join(' L ');
    };

    const enrollPoints = getPolyPoints('enrollments');
    const completionPoints = getPolyPoints('completions');

    // Closing path for fill area
    const enrollFill = `M ${enrollPoints} L ${W},${H} L 0,${H} Z`;

    // Visible labels (every ~5 days)
    const labelIndexes = chartData.reduce((acc: number[], _, i) => {
        if (i === 0 || i === 14 || i === chartData.length - 1 || i % 7 === 0) acc.push(i);
        return acc;
    }, []);

    const hasRealData = data && data.some(d => d.enrollments > 0 || d.completions > 0);

    return (
        <div className="bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 flex flex-col h-[420px] transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                <div>
                    <h4 className="text-base font-black text-[#140d1b] dark:text-white tracking-tight">Engagement Trends</h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        {hasRealData ? "Enrollment & Completion Velocity · Last 30 Days" : "Simulated Trend · No Enrollments in Last 30 Days"}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-1.5 rounded-full bg-primary"></div>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrollments</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completions</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} className="w-full border-t border-dashed border-slate-100 dark:border-slate-800/60 first:border-t-0 last:border-t-0"></div>
                    ))}
                </div>

                {/* Y-axis ticks */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between pr-2 pointer-events-none">
                    {[maxVal, Math.round(maxVal * 0.5), 0].map((v, i) => (
                        <span key={i} className="text-[9px] font-bold text-slate-300 dark:text-slate-700">{v}</span>
                    ))}
                </div>

                <svg
                    className="w-full h-full relative z-10"
                    viewBox={`0 0 ${W} ${H}`}
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="enroll-grad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#7f13ec" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#7f13ec" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Fill area under enrollment line */}
                    <path d={enrollFill} fill="url(#enroll-grad)" />

                    {/* Enrollment line */}
                    <path
                        d={`M ${enrollPoints}`}
                        fill="none"
                        stroke="#7f13ec"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Completion line (dashed) */}
                    <path
                        d={`M ${completionPoints}`}
                        fill="none"
                        stroke="#94A3B8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="8,5"
                    />
                </svg>
            </div>

            {/* X-axis labels */}
            <div className="relative mt-4 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {labelIndexes.map(i => (
                    <span key={i} style={{ position: 'relative' }}>{chartData[i]?.label}</span>
                ))}
            </div>
        </div>
    )
}
