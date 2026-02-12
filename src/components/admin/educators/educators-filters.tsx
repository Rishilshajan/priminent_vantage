import { Search } from "lucide-react"

interface EducatorsFiltersProps {
    onSearch?: (term: string) => void;
}

export function EducatorsFilters({ onSearch }: EducatorsFiltersProps) {
    return (
        <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm mb-8 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-[#382a4a] flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[240px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm size-4" />
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#2d1e3d] border border-slate-200 dark:border-[#382a4a] rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-[#140d1b] dark:text-white"
                        placeholder="Search educators, institutions..."
                        type="text"
                        onChange={(e) => onSearch?.(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                    <select className="bg-slate-50 dark:bg-[#2d1e3d] border border-slate-200 dark:border-[#382a4a] rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-primary outline-none text-[#140d1b] dark:text-white w-full sm:w-auto">
                        <option>All Institutions</option>
                        <option>Harvard University</option>
                        <option>Stanford</option>
                        <option>MIT</option>
                    </select>
                    <select className="bg-slate-50 dark:bg-[#2d1e3d] border border-slate-200 dark:border-[#382a4a] rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-primary outline-none text-[#140d1b] dark:text-white w-full sm:w-auto">
                        <option>All Simulations</option>
                        <option>Market Leader Pro</option>
                        <option>Financial Analyst v2</option>
                        <option>Supply Chain Ops</option>
                    </select>
                    <select className="bg-slate-50 dark:bg-[#2d1e3d] border border-slate-200 dark:border-[#382a4a] rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-primary outline-none text-[#140d1b] dark:text-white w-full sm:w-auto">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
