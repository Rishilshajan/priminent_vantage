import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

export function AccessCodeActivity() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                <button className="text-primary text-xs font-bold hover:underline">View Audit Log</button>
            </div>
            <div className="space-y-4">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="size-8 rounded bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="text-emerald-500 size-4" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Access Code Generated: Quantum Dynamics</p>
                        <div className="flex items-center justify-between mt-0.5">
                            <p className="text-[10px] text-slate-400">2 minutes ago • Super Admin (M. Chen)</p>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 rounded">ABC-123-XYZ</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="size-8 rounded bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="text-amber-500 size-4" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Expiring Code Alert: Hooli Ltd</p>
                        <div className="flex items-center justify-between mt-0.5">
                            <p className="text-[10px] text-slate-400">1 hour ago • System Automator</p>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 rounded">HLX-492-WQV</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="size-8 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                        <XCircle className="text-red-500 size-4" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Access Code Revoked: Cyberdyne Systems</p>
                        <div className="flex items-center justify-between mt-0.5">
                            <p className="text-[10px] text-slate-400">5 hours ago • Super Admin (M. Chen)</p>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 rounded">SKY-009-NET</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
