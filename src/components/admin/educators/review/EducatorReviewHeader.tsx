"use client"

import { Calendar, Fingerprint, Globe, CheckCircle2, XCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

interface EducatorReviewHeaderProps {
    application: any;
    onAction: (type: "approve" | "reject" | "clarify") => void;
    isSaving?: boolean;
}

export function EducatorReviewHeader({ application, onAction, isSaving }: EducatorReviewHeaderProps) {
    const isFinalized = application.status === 'APPROVED' || application.status === 'REJECTED'

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold    text-slate-900 dark:text-white">
                        {application.institution_name}
                    </h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${application.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : application.status === 'REJECTED'
                            ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        }`}>
                        {application.status.replace(/_/g, ' ')}
                    </span>
                </div>
                {/* ... existing info section ... */}
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="size-4" />
                        <span className="text-sm font-medium">Submitted {formatDate(application.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Fingerprint className="size-4" />
                        <span className="text-sm font-medium uppercase   ">REQ-ID: {application.id.split('-')[0].toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Globe className="size-4" />
                        <span className="text-sm font-medium">Global/Educator</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="default"
                    onClick={() => onAction('clarify')}
                    disabled={isSaving || isFinalized}
                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 font-bold shadow-sm disabled:opacity-50"
                >
                    <Info className="size-4 mr-2" />
                    Request Clarification
                </Button>
                <Button
                    variant="outline"
                    size="default"
                    onClick={() => onAction('reject')}
                    disabled={isSaving || isFinalized}
                    className="border-red-100 dark:border-red-900/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold disabled:opacity-50"
                >
                    <XCircle className="size-4 mr-2" />
                    Reject
                </Button>
                <Button
                    size="default"
                    onClick={() => onAction('approve')}
                    disabled={isSaving || isFinalized}
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold px-8 disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                >
                    <CheckCircle2 className="size-4 mr-2" />
                    Approve
                </Button>
            </div>
        </div>
    )
}
