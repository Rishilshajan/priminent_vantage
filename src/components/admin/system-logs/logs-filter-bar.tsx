import { Search, Calendar, Filter, X } from "lucide-react"
import { useState } from "react"
import { LogLevel } from "@/lib/logger"

export interface LogFilters {
    search: string
    dateRange: string // Keeping simple as string for now, could be {start, end}
    level: LogLevel | ''
    category: string
}

interface LogFilterBarProps {
    onFilter: (filters: LogFilters) => void
    isFiltering: boolean
}

export function LogFilterBar({ onFilter, isFiltering }: LogFilterBarProps) {
    const [filters, setFilters] = useState<LogFilters>({
        search: '',
        dateRange: '',
        level: '',
        category: ''
    })

    const handleApply = () => {
        onFilter(filters)
    }

    const handleClear = () => {
        const resetHandlers = { search: '', dateRange: '', level: '' as const, category: '' }
        setFilters(resetHandlers)
        onFilter(resetHandlers)
    }

    return (
        <div className="px-4 md:px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                <input
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    placeholder="Search by message, actor, or event type..."
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                />
            </div>
            <div className="md:col-span-3">
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                    <input
                        className="w-full pl-10 pr-4 py-2 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                        placeholder="Select Date Range (YYYY-MM-DD)"
                        type="text"
                        value={filters.dateRange}
                        onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                    />
                </div>
            </div>
            <div className="md:col-span-2">
                <select
                    className="w-full px-4 py-2 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    value={filters.level}
                    onChange={(e) => setFilters({ ...filters, level: e.target.value as LogLevel | '' })}
                >
                    <option value="">Levels</option>
                    <option value="SUCCESS">Success</option>
                    <option value="WARNING">Warning</option>
                    <option value="ERROR">Error</option>
                    <option value="INFO">Info</option>
                    <option value="CRITICAL">Critical</option>
                </select>
            </div>
            <div className="md:col-span-2">
                <select
                    className="w-full px-4 py-2 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                    <option value="">Categories</option>
                    <option value="SECURITY">Security</option>
                    <option value="ORGANIZATION">Org</option>
                    <option value="CONTENT">Content</option>
                    <option value="SYSTEM">System</option>
                </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
                {isFiltering && (
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-all"
                    >
                        <X className="size-4" />
                        Clear
                    </button>
                )}
                <button
                    onClick={handleApply}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-all shadow-sm"
                >
                    <Filter className="size-4" />
                    Apply Filters
                </button>
            </div>
        </div>
    )
}
