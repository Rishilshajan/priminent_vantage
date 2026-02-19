"use client"

import { Users, UserPlus, Award, Timer } from "lucide-react"

export default function CandidatesStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white dark:bg-[#1f1629] p-4 md:p-6 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Users className="size-4 md:size-5" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+12.4%</span>
                </div>
                <p className="text-slate-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Total Candidates</p>
                <h3 className="text-2xl md:text-3xl font-black mt-1 text-slate-900 dark:text-white">1,284</h3>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-4 md:p-6 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <UserPlus className="size-4 md:size-5" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+5.2%</span>
                </div>
                <p className="text-slate-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">New This Week</p>
                <h3 className="text-2xl md:text-3xl font-black mt-1 text-slate-900 dark:text-white">42</h3>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-4 md:p-6 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                        <Award className="size-4 md:size-5" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">Score &gt; 90</span>
                </div>
                <p className="text-slate-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Top Performers</p>
                <h3 className="text-2xl md:text-3xl font-black mt-1 text-slate-900 dark:text-white">85</h3>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-4 md:p-6 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                        <Timer className="size-4 md:size-5" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full">-2.1%</span>
                </div>
                <p className="text-slate-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Avg. Completion</p>
                <h3 className="text-2xl md:text-3xl font-black mt-1 text-slate-900 dark:text-white">42m</h3>
            </div>
        </div>
    )
}
