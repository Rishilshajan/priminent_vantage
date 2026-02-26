"use client"

interface AuditFooterProps {
    lastUpdatedBy?: string;
    lastUpdatedAt?: string;
}

export default function AuditFooter({ lastUpdatedBy, lastUpdatedAt }: AuditFooterProps) {
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
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/60 dark:border-slate-700/60 mt-8 gap-4 sm:gap-0">
            <div className="flex items-center gap-2 text-slate-500">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <p className="text-[11px] font-medium uppercase   ">System Audit</p>
            </div>
            <p className="text-[11px] text-slate-500 font-medium text-center sm:text-right   ">
                Last modified by <span className="text-slate-900 dark:text-white font-bold">{lastUpdatedBy || "System"}</span> on <span className="text-slate-900 dark:text-white font-bold">{formattedDate}</span>
            </p>
        </div>
    )
}
