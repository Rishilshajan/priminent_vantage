import { Verified, Timer, UserPlus } from "lucide-react"

export function AccessCodeStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Verified className="size-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Codes</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">842</span>
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">Current</span>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
                <div className="size-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                    <Timer className="size-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Codes Expiring Soon</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">12</span>
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">&lt; 7 Days</span>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
                <div className="size-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                    <UserPlus className="size-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Enrollments</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">14,208</span>
                        <span className="text-xs font-semibold text-emerald-600">+12%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
