import { CheckCircle2, ClipboardCheck, PlusSquare } from "lucide-react"
import Link from "next/link"

export function OrgActivity() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white">Request Lifecycle Activity</h3>
                <Link href="/admin/system-logs?category=ORGANIZATION">
                    <button className="text-primary text-xs font-bold hover:underline cursor-pointer">View History</button>
                </Link>
            </div>
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <div className="size-8 rounded bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="text-emerald-500 size-4" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Organization Approved: Hooli Ltd</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide font-semibold">Access Code HLX-492-WQV Dispatched</p>
                        <p className="text-[10px] text-slate-400">2 minutes ago • Marcus Chen</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="size-8 rounded bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                        <ClipboardCheck className="text-amber-500 size-4" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Review Started: Velocity Cybersecurity</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Assigned to: Sarah Jenkins (Operations Team)</p>
                        <p className="text-[10px] text-slate-400">15 minutes ago • System</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="size-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <PlusSquare className="text-primary size-4" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">New Request: Terra Retail Group</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Application Source: Public Onboarding API</p>
                        <p className="text-[10px] text-slate-400">1 hour ago • Auto-ingested</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
