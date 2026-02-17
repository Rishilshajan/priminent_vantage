"use client"

export default function EngagementTrends() {
    return (
        <div className="card-container bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Engagement Trends</h4>
                    <p className="text-xs text-slate-400 font-medium">Volume of enrollments vs completions per day</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrollments</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completions</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 relative">
                <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none">
                    <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                    <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                    <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                    <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                    <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                </div>
                <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 1000 300">
                    <defs>
                        <linearGradient id="line-grad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#7f13ec" stopOpacity="0.05"></stop>
                            <stop offset="100%" stopColor="#7f13ec" stopOpacity="0"></stop>
                        </linearGradient>
                    </defs>
                    <path
                        d="M0,220 L100,180 L200,210 L300,140 L400,120 L500,160 L600,100 L700,130 L800,60 L900,90 L1000,70"
                        fill="none"
                        stroke="#7f13ec"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                    ></path>
                    <path
                        d="M0,220 L100,180 L200,210 L300,140 L400,120 L500,160 L600,100 L700,130 L800,60 L900,90 L1000,70 L1000,300 L0,300 Z"
                        fill="url(#line-grad)"
                    ></path>
                    <path
                        d="M0,260 L100,240 L200,255 L300,200 L400,210 L500,230 L600,180 L700,200 L800,150 L900,170 L1000,165"
                        fill="none"
                        stroke="#CBD5E1"
                        strokeDasharray="4"
                        strokeLinecap="round"
                        strokeWidth="2"
                    ></path>
                </svg>
                <div className="flex justify-between mt-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    <span>Sep 01</span>
                    <span>Sep 10</span>
                    <span>Sep 20</span>
                    <span>Sep 30</span>
                </div>
            </div>
        </div>
    )
}
