import { TrendingUp, ArrowDown, BarChart2, Users } from "lucide-react"

export function OrgStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">New Requests This Week</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">42</span>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <TrendingUp className="size-3.5" /> 12%
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Average Response Time</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">4.2h</span>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ArrowDown className="size-3.5" /> 15m
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Conversion Rate</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">68.4%</span>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <BarChart2 className="size-3.5" /> Stable
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Active Orgs</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">1,240</span>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Total</span>
                </div>
            </div>
        </div>
    )
}
