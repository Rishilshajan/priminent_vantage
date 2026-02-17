"use client"

export default function AnalyticsStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-5">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Enrollments</p>
                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400 px-1.5 py-0.5 rounded">+12.4%</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">12,450</h3>
                </div>
                <div className="mt-4 flex items-end gap-[2px] h-8">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-[30%]"></div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-[50%]"></div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-[40%]"></div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-[70%]"></div>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-[60%]"></div>
                    <div className="flex-1 bg-primary h-[90%] opacity-20"></div>
                    <div className="flex-1 bg-primary h-[85%] opacity-40"></div>
                    <div className="flex-1 bg-primary h-[100%]"></div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-5">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion Rate</p>
                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400 px-1.5 py-0.5 rounded">+3.1%</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">68.2%</h3>
                <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "68.2%" }}></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Goal: 75.0%</p>
            </div>

            <div className="bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-5">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Candidate Score</p>
                    <span className="text-[10px] font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 dark:text-red-400 px-1.5 py-0.5 rounded">-0.8%</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    74<span className="text-slate-400 text-lg font-normal">/100</span>
                </h3>
                <div className="mt-4 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Above Industry Average</span>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-5">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skills Validated</p>
                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400 px-1.5 py-0.5 rounded">+8.2%</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">42</h3>
                <div className="mt-4 flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-[9px] font-medium text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 rounded">Python</span>
                    <span className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-[9px] font-medium text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 rounded">Cloud Arch</span>
                    <span className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-[9px] font-medium text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 rounded">+39 more</span>
                </div>
            </div>
        </div>
    )
}
