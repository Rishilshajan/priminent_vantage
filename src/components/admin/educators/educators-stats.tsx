import { TrendingUp, TrendingDown } from "lucide-react"

export function EducatorsStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Registered Educators</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#140d1b] dark:text-white">1,240</span>
                    <span className="text-green-600 text-sm font-semibold flex items-center">
                        <TrendingUp className="size-3 mr-1" />
                        +12%
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Active Educator Groups</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#140d1b] dark:text-white">856</span>
                    <span className="text-green-600 text-sm font-semibold flex items-center">
                        <TrendingUp className="size-3 mr-1" />
                        +5%
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Students Managed</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#140d1b] dark:text-white">12,403</span>
                    <span className="text-green-600 text-sm font-semibold flex items-center">
                        <TrendingUp className="size-3 mr-1" />
                        +18%
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Avg. Group Size</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#140d1b] dark:text-white">14.5</span>
                    <span className="text-red-500 text-sm font-semibold flex items-center">
                        <TrendingDown className="size-3 mr-1" />
                        -2%
                    </span>
                </div>
            </div>
        </div>
    )
}
