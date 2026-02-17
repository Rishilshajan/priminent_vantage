"use client"

import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CandidatesFilters() {
    return (
        <div className="bg-white dark:bg-[#1f1629] p-4 rounded-xl border border-primary/5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                        className="w-full pl-10 pr-4 h-10 bg-[#f7f6f8] dark:bg-[#130d1a] border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm"
                        placeholder="Search by name, email, or skill..."
                        type="text"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2 px-4 h-10 bg-[#f7f6f8] dark:bg-[#130d1a] text-slate-600 dark:text-slate-300 font-medium text-sm rounded-lg border-transparent hover:border-primary/20 transition-all">
                        <Filter className="size-4" />
                        Advanced Filters
                    </Button>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-primary/5">
                <div className="px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full flex items-center gap-2 text-xs font-bold text-primary">
                    Simulation: Software Engineering
                    <X className="size-3 cursor-pointer hover:text-red-500" />
                </div>
                <div className="px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full flex items-center gap-2 text-xs font-bold text-primary">
                    Performance: Top 10%
                    <X className="size-3 cursor-pointer hover:text-red-500" />
                </div>
                <div className="px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full flex items-center gap-2 text-xs font-bold text-primary">
                    Skill: React
                    <X className="size-3 cursor-pointer hover:text-red-500" />
                </div>
                <button className="text-[10px] font-bold text-slate-400 uppercase hover:text-red-500 transition-colors ml-2">Clear All</button>
            </div>
        </div>
    )
}
