import { Search, Filter } from "lucide-react"

export function ReportsFilters() {
    return (
        <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] p-4 shadow-sm">
            <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[240px]">
                    <label className="text-[#140d1b] dark:text-white text-xs font-bold uppercase tracking-wider block mb-2">Search Companies</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#734c9a] dark:text-[#a682cc] size-4" />
                        <input
                            className="w-full bg-slate-50 dark:bg-[#2d1e3d] border border-slate-200 dark:border-[#382a4a] rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-[#140d1b] dark:text-white placeholder-[#734c9a]/60"
                            placeholder="Filter by name, ID or domain..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="w-full sm:w-48">
                    <label className="text-[#140d1b] dark:text-white text-xs font-bold uppercase tracking-wider block mb-2">Industry</label>
                    <select className="w-full bg-slate-50 dark:bg-[#2d1e3d] border border-slate-200 dark:border-[#382a4a] rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-[#140d1b] dark:text-white appearance-none">
                        <option>All Industries</option>
                        <option>Technology</option>
                        <option>Finance</option>
                        <option>Healthcare</option>
                    </select>
                </div>
                <div className="w-full sm:w-48">
                    <label className="text-[#140d1b] dark:text-white text-xs font-bold uppercase tracking-wider block mb-2">Health Status</label>
                    <select className="w-full bg-slate-50 dark:bg-[#2d1e3d] border border-slate-200 dark:border-[#382a4a] rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-[#140d1b] dark:text-white appearance-none">
                        <option>All Statuses</option>
                        <option>High (Stable)</option>
                        <option>Medium</option>
                        <option>Low (At Risk)</option>
                    </select>
                </div>
                <button className="bg-slate-100 dark:bg-[#2d1e3d] text-[#140d1b] dark:text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-[#382a4a] transition-colors w-full sm:w-auto">
                    <Filter className="size-4" />
                    More Filters
                </button>
            </div>
        </div>
    )
}
