"use client"

import { Info } from "lucide-react"

export default function PrivacyAuditFooter() {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Info className="size-4" />
                <p className="text-[11px] font-medium uppercase tracking-tight">Privacy Compliance Audit</p>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Last modified by <span className="text-slate-900 dark:text-white font-bold">Alex Sterling</span> on <span className="text-slate-900 dark:text-white font-bold">Oct 24, 2023 · 14:42 GMT</span>
            </p>
        </div>
    )
}
