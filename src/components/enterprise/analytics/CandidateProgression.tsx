"use client"

import { Info, AlertCircle } from "lucide-react"

export default function CandidateProgression() {
    return (
        <div className="card-container bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Candidate Progression</h4>
                <p className="text-xs text-slate-400 font-medium">Milestone conversion & attrition analysis</p>
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-4">
                    <div className="w-24 text-right"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Started</span></div>
                    <div className="flex-1 h-8 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded flex items-center px-4 relative overflow-hidden group">
                        <div className="absolute inset-y-0 left-0 bg-primary opacity-5 w-full"></div>
                        <span className="relative z-10 text-[11px] font-semibold text-slate-600 dark:text-slate-300">12,450 candidates</span>
                        <span className="ml-auto relative z-10 text-[11px] font-bold text-slate-400">100%</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-24 text-right"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Phase 1</span></div>
                    <div className="flex-1 h-8 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded flex items-center px-4 relative overflow-hidden group">
                        <div className="absolute inset-y-0 left-0 bg-primary opacity-10 w-[84%]"></div>
                        <span className="relative z-10 text-[11px] font-semibold text-slate-600 dark:text-slate-300">10,458 candidates</span>
                        <span className="ml-auto relative z-10 text-[11px] font-bold text-slate-500">84.0%</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-24 text-right"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Assessment</span></div>
                    <div className="flex-1 h-8 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded flex items-center px-4 relative overflow-hidden group">
                        <div className="absolute inset-y-0 left-0 bg-primary opacity-20 w-[71%]"></div>
                        <span className="relative z-10 text-[11px] font-semibold text-slate-600 dark:text-slate-300">8,839 candidates</span>
                        <span className="ml-auto relative z-10 text-[11px] font-bold text-slate-600 dark:text-slate-400">71.0%</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-24 text-right"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Certified</span></div>
                    <div className="flex-1 h-8 bg-primary/90 rounded shadow-sm flex items-center px-4 relative overflow-hidden group">
                        <div className="absolute inset-y-0 left-0 bg-white/10 w-[68%]"></div>
                        <span className="relative z-10 text-[11px] font-semibold text-white">8,491 candidates</span>
                        <span className="ml-auto relative z-10 text-[11px] font-bold text-white">68.2%</span>
                    </div>
                </div>
            </div>
            <div className="mt-5 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="size-4 text-red-500 mt-0.5" />
                <p className="text-[11px] text-red-800 dark:text-red-400 leading-relaxed"><span className="font-bold">Optimization Alert:</span> Phase 1 exhibits a 16% drop-off rate. Significant correlation with technical module 'B-3' complexity.</p>
            </div>
        </div>
    )
}
