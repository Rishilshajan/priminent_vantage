import { CheckCircle2, AlertTriangle, Info } from "lucide-react"

export function RecentLogs() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white">Recent System Logs</h3>
                <button className="text-primary text-xs font-bold hover:underline">View All</button>
            </div>
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <div className="size-8 rounded bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="text-emerald-500 size-4" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Access Code Generated: Hooli Ltd</p>
                        <p className="text-xs text-slate-500 italic">Code: HLX-492-WQV</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">2 minutes ago • Marcus Chen</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="size-8 rounded bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="text-amber-500 size-4" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Failed Access Attempt: API-Node-04</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">15 minutes ago • System</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="size-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Info className="text-primary size-4" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Access Code Generated: Cyberdyne Systems</p>
                        <p className="text-xs text-slate-500 italic">Code: CYB-101-SKY</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">1 hour ago • Marcus Chen</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
