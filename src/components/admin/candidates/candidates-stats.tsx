import { TrendingUp, TrendingDown } from "lucide-react"

export function CandidatesStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm">
                <p className="text-[#734c9a] dark:text-[#a682cc] text-sm font-medium mb-1">Total Registered Students</p>
                <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold text-[#140d1b] dark:text-white">12,450</h3>
                    <span className="text-green-600 text-sm font-bold flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                        <TrendingUp className="size-3.5" />12%
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm">
                <p className="text-[#734c9a] dark:text-[#a682cc] text-sm font-medium mb-1">Course Enrollments</p>
                <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold text-[#140d1b] dark:text-white">8,920</h3>
                    <span className="text-green-600 text-sm font-bold flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                        <TrendingUp className="size-3.5" />8%
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm">
                <p className="text-[#734c9a] dark:text-[#a682cc] text-sm font-medium mb-1">Active Participants</p>
                <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold text-[#140d1b] dark:text-white">1,240</h3>
                    <span className="text-green-600 text-sm font-bold flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                        <TrendingUp className="size-3.5" />5%
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm">
                <p className="text-[#734c9a] dark:text-[#a682cc] text-sm font-medium mb-1">Completion Rate</p>
                <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold text-[#140d1b] dark:text-white">68.2%</h3>
                    <span className="text-red-500 text-sm font-bold flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                        <TrendingDown className="size-3.5" />2%
                    </span>
                </div>
            </div>
        </div>
    )
}
