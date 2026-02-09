import { FileClock, Building, TrendingUp } from "lucide-react"

interface StatsCardsProps {
    pendingRequests: number;
    activeOrgs: number;
    monthlyOnboardings: number;
}

export function StatsCards({ pendingRequests, activeOrgs, monthlyOnboardings }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileClock className="size-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Requests</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{pendingRequests}</span>
                        {pendingRequests > 0 && (
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">New</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
                <div className="size-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                    <Building className="size-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Organizations</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{activeOrgs.toLocaleString()}</span>
                        {/* <span className="text-xs font-semibold text-emerald-600">+5%</span> */}
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
                <div className="size-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                    <TrendingUp className="size-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Onboardings</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{monthlyOnboardings}</span>
                        <span className="text-xs font-semibold text-slate-400">This Month</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
