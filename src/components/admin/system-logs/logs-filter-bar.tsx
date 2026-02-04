import { Search, Calendar, Filter } from "lucide-react"

export function LogFilterBar() {
    return (
        <div className="px-4 md:px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                <input
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    placeholder="Search by message, actor, or event type..."
                    type="text"
                />
            </div>
            <div className="md:col-span-3">
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                    <input
                        className="w-full pl-10 pr-4 py-2 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                        placeholder="Select Date Range"
                        type="text"
                    />
                </div>
            </div>
            <div className="md:col-span-3">
                <select className="w-full px-4 py-2 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none">
                    <option value="">All Log Levels</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="info">Information</option>
                </select>
            </div>
            <div className="md:col-span-2 flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-all shadow-sm">
                    <Filter className="size-4" />
                    Apply Filters
                </button>
            </div>
        </div>
    )
}
