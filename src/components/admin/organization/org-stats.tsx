import { TrendingUp, ArrowDown, BarChart2, Users } from "lucide-react"

export function OrgStats({ stats }: { stats: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">New Requests This Week</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.requestsThisWeek || 0}</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Average Response Time</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.avgResponseTime || "4.2h"}</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Conversion Rate</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.conversionRate || "68.4%"}</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Active Orgs</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.approvedOrgs || 0}</span>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Total</span>
                </div>
            </div>
        </div>
    )
}
