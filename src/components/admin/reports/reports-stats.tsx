import { TrendingUp, TrendingDown, Building2, Users, Ticket, BrainCircuit } from "lucide-react"

export function ReportsStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-start">
                    <p className="text-[#734c9a] dark:text-[#a682cc] text-sm font-medium">Total Partners</p>
                    <Building2 className="text-primary size-5" />
                </div>
                <p className="text-3xl font-bold text-[#140d1b] dark:text-white">128</p>
                <p className="text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="size-3.5" /> +5% vs last month
                </p>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-start">
                    <p className="text-[#734c9a] dark:text-[#a682cc] text-sm font-medium">Active Users</p>
                    <Users className="text-primary size-5" />
                </div>
                <p className="text-3xl font-bold text-[#140d1b] dark:text-white">45,200</p>
                <p className="text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="size-3.5" /> +12% vs last month
                </p>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-start">
                    <p className="text-[#734c9a] dark:text-[#a682cc] text-sm font-medium">Redemptions</p>
                    <Ticket className="text-primary size-5" />
                </div>
                <p className="text-3xl font-bold text-[#140d1b] dark:text-white">32,840</p>
                <p className="text-red-500 dark:text-red-400 text-xs font-bold flex items-center gap-1">
                    <TrendingDown className="size-3.5" /> -2% vs last month
                </p>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-start">
                    <p className="text-[#734c9a] dark:text-[#a682cc] text-sm font-medium">Avg. Simulations</p>
                    <BrainCircuit className="text-primary size-5" />
                </div>
                <p className="text-3xl font-bold text-[#140d1b] dark:text-white">14.5</p>
                <p className="text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="size-3.5" /> +8% vs last month
                </p>
            </div>
        </div>
    )
}
