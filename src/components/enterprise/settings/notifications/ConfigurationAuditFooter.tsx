"use client"

import { Info } from "lucide-react"

interface ConfigurationAuditFooterProps {
    lastUpdatedBy?: string;
    lastUpdatedAt?: string;
}

export default function ConfigurationAuditFooter({ lastUpdatedBy, lastUpdatedAt }: ConfigurationAuditFooterProps) {
    const formattedDate = lastUpdatedAt
        ? new Date(lastUpdatedAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        })
        : "Never updated";

    return (
        <div className="flex items-center justify-between p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Info className="size-4" />
                <p className="text-[11px] font-medium uppercase tracking-tight">Configuration Audit</p>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                Last updated by <span className="text-slate-900 dark:text-white font-bold">{lastUpdatedBy || "System"}</span> on <span className="text-slate-900 dark:text-white font-bold">{formattedDate}</span>
            </p>
        </div>
    )
}
