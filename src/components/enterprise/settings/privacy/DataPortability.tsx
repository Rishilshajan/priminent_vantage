"use client"

import { Share, CloudDownload, FileText } from "lucide-react"

export default function DataPortability() {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                <Share className="text-primary size-6" />
                <h2 className="font-bold text-slate-900 dark:text-white">Data Portability</h2>
            </div>
            <div className="p-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Extract your organization's data or generate compliance-ready audit logs for internal reviews or regulatory requests.</p>
                <div className="flex flex-wrap gap-4">
                    <button className="flex items-center gap-2 px-6 h-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                        <CloudDownload className="size-5 text-slate-500 dark:text-slate-400" />
                        Export All Organization Data (JSON/CSV)
                    </button>
                    <button className="flex items-center gap-2 px-6 h-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                        <FileText className="size-5 text-slate-500 dark:text-slate-400" />
                        Generate Privacy Audit Report
                    </button>
                </div>
            </div>
        </section>
    )
}
