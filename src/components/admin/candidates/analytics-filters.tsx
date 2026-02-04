import { Filter, Calendar } from "lucide-react"

export function AnalyticsFilters() {
    return (
        <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] p-6 h-fit">
            <h4 className="text-base font-bold text-[#140d1b] dark:text-white mb-6 flex items-center gap-2">
                <Filter className="text-primary size-5" />
                Filter Analytics
            </h4>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-[#734c9a] dark:text-[#a682cc] mb-2 uppercase tracking-wider">Date Range</label>
                    <button className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-[#2d2238] rounded-lg border border-slate-200 dark:border-[#382a4a] text-sm text-[#140d1b] dark:text-white">
                        <span>Oct 1 - Oct 31, 2023</span>
                        <Calendar className="text-[#140d1b] dark:text-white size-4" />
                    </button>
                </div>
                <div>
                    <label className="block text-xs font-bold text-[#734c9a] dark:text-[#a682cc] mb-2 uppercase tracking-wider">Simulation/Course</label>
                    <select className="w-full bg-slate-50 dark:bg-[#2d2238] border-slate-200 dark:border-[#382a4a] rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent text-[#140d1b] dark:text-white outline-none">
                        <option>All Simulations</option>
                        <option>Goldman Sachs Simulation</option>
                        <option>McKinsey Strategy Lead</option>
                        <option>Google UX Sprint</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-[#734c9a] dark:text-[#a682cc] mb-2 uppercase tracking-wider">Organization</label>
                    <select className="w-full bg-slate-50 dark:bg-[#2d2238] border-slate-200 dark:border-[#382a4a] rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent text-[#140d1b] dark:text-white outline-none">
                        <option>All Organizations</option>
                        <option>London School of Economics</option>
                        <option>Enterprise Access Group</option>
                        <option>Global Talent Inc</option>
                    </select>
                </div>
                <div className="pt-4 flex flex-col gap-2">
                    <button className="w-full bg-primary text-white font-bold py-2 rounded-lg text-sm hover:opacity-90 transition-all shadow-sm shadow-primary/20">Apply Filters</button>
                    <button className="w-full bg-transparent text-[#734c9a] dark:text-[#a682cc] font-medium py-2 text-xs hover:underline">Clear all filters</button>
                </div>
            </div>
        </div>
    )
}
