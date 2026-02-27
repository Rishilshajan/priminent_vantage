"use client"

import { AlertCircle, TrendingDown } from "lucide-react"

interface FunnelStep {
    label: string;
    count: number;
    pct: number;
}

interface CandidateProgressionProps {
    funnel?: FunnelStep[];
}

const FALLBACK_FUNNEL: FunnelStep[] = [
    { label: 'Enrolled', count: 0, pct: 100 },
    { label: 'Task 1', count: 0, pct: 84 },
    { label: 'Task 2', count: 0, pct: 71 },
    { label: 'Completed', count: 0, pct: 68 }
];

export default function CandidateProgression({ funnel }: CandidateProgressionProps) {
    const hasDataArray = funnel !== undefined && funnel !== null;
    const hasTotalEnrolled = funnel && funnel.length > 0 && funnel[0].count > 0;

    // We use fallback ONLY if the data is completely missing (initial load/error)
    const steps = funnel && funnel.length > 0 ? funnel : (funnel === undefined ? FALLBACK_FUNNEL : []);
    const hasRealData = hasDataArray && funnel.length > 0;
    const totalEnrolled = steps[0]?.count || 0;

    // Find biggest drop-off
    let maxDropPct = 0;
    let maxDropLabel = '';
    for (let i = 1; i < steps.length; i++) {
        const drop = steps[i - 1].pct - steps[i].pct;
        if (drop > maxDropPct) {
            maxDropPct = drop;
            maxDropLabel = steps[i].label;
        }
    }

    const barColors = [
        'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
        'bg-indigo-200/60 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
        'bg-indigo-300/60 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
        'bg-primary/40 text-primary',
        'bg-primary/60 text-primary',
        'bg-primary text-white'
    ];

    const getBarColor = (index: number, isLast: boolean) => {
        if (isLast) return barColors[barColors.length - 1];
        if (index === 0) return barColors[0];
        return barColors[Math.min(index, barColors.length - 2)];
    };

    return (
        <div className="bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 transition-all hover:shadow-md flex flex-col">
            <div className="mb-6">
                <h4 className="text-base font-black text-[#140d1b] dark:text-white tracking-tight">Candidate Progression</h4>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    {hasRealData ? "Milestone conversion & attrition analysis" : "Simulated funnel · No enrollment data yet"}
                </p>
            </div>

            <div className="space-y-3 flex-1">
                {steps.map((step, i) => (
                    <div key={i} className="group flex items-center gap-4">
                        {/* Label */}
                        <div className="w-24 text-right shrink-0">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step.label}</span>
                        </div>

                        {/* Bar */}
                        <div
                            className={`flex-1 h-9 rounded-xl flex items-center px-4 relative overflow-hidden transition-all ${getBarColor(i, i === steps.length - 1)}`}
                            style={{ maxWidth: `${step.pct}%`, minWidth: '8rem' /* ensure visible even at low % */ }}
                        >
                            <span className={`text-[12px] font-black truncate`}>
                                {hasRealData ? `${step.count.toLocaleString()} candidates` : '—'}
                            </span>
                            <span className={`ml-auto text-[11px] font-black shrink-0`}>
                                {step.pct}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Insight banner */}
            {maxDropPct > 5 && (
                <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl flex items-start gap-3">
                    <TrendingDown className="size-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-relaxed">
                        <span className="font-black">Drop-off Alert: </span>
                        {maxDropLabel} stage shows a <span className="font-black">{maxDropPct}%</span> fall-off from the previous step.
                        {totalEnrolled > 0 && ` That's ${Math.round(totalEnrolled * maxDropPct / 100)} candidates.`}
                    </p>
                </div>
            )}

            {!hasRealData && (
                <div className="mt-5 p-4 bg-slate-50 dark:bg-[#130d1a]/50 border border-slate-100 dark:border-slate-800/60 rounded-xl flex items-start gap-3">
                    <AlertCircle className="size-4 text-slate-400 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Enroll candidates in simulations to see real progression data here.
                    </p>
                </div>
            )}
        </div>
    )
}
