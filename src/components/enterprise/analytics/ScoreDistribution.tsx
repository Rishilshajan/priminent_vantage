"use client"

export default function ScoreDistribution() {
    return (
        <div className="card-container bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6 flex flex-col h-[400px]">
            <div className="mb-8">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Score Distribution</h4>
                <p className="text-xs text-slate-400 font-medium">Candidate performance density</p>
            </div>
            <div className="flex-1 flex items-end gap-[3px] pb-2">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 h-[8%] rounded-t-sm"></div>
                <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-[15%] rounded-t-sm"></div>
                <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-[30%] rounded-t-sm"></div>
                <div className="flex-1 bg-slate-200 dark:bg-slate-600 h-[60%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/40 h-[85%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary h-[100%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/60 h-[80%] rounded-t-sm"></div>
                <div className="flex-1 bg-slate-200 dark:bg-slate-600 h-[50%] rounded-t-sm"></div>
                <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-[25%] rounded-t-sm"></div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 h-[10%] rounded-t-sm"></div>
            </div>
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-widest pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>0</span>
                <span>50</span>
                <span>100</span>
            </div>
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Median Score</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-white">76.4</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Top Tier (90+)</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-white">412</span>
                </div>
            </div>
        </div>
    )
}
