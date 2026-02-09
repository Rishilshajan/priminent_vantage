"use client"

import { Calendar, Fingerprint, Globe, HelpCircle, Ban, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RequestHeaderProps {
    companyName: string
    requestId: string
    status: string
    submittedAt: string
    onApprove: () => void
    onReject: () => void
    onClarify: () => void
}

export function RequestHeader({
    companyName,
    requestId,
    status,
    submittedAt,
    onApprove,
    onReject,
    onClarify
}: RequestHeaderProps) {
    return (
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 mt-2 animate-fade-in-down">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {companyName}
                    </h2>
                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200 dark:border-amber-800">
                        {status}
                    </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="size-4" /> Submitted {submittedAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Fingerprint className="size-4" /> REQ-ID: {requestId}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Globe className="size-4" /> Global/Enterprise
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Button
                    variant="outline"
                    onClick={onClarify}
                    className="h-10 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-2"
                >
                    <HelpCircle className="size-4" /> Request Clarification
                </Button>
                <Button
                    variant="destructive"
                    onClick={onReject}
                    className="h-10 px-4 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 text-red-600 dark:text-red-400 text-sm font-bold rounded-lg border border-red-200 dark:border-red-900/30 transition-colors flex items-center gap-2"
                >
                    <Ban className="size-4" /> Reject
                </Button>
                <Button
                    onClick={onApprove}
                    className="h-10 px-5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
                >
                    <CheckCircle className="size-4" /> Approve & Issue Access Code
                </Button>
            </div>
        </div>
    )
}
