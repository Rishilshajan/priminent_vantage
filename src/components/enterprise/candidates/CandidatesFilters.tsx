"use client"

import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CandidatesFiltersProps {
    candidates?: any[];
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedSimulation: string;
    onSimulationChange: (value: string) => void;
}

export default function CandidatesFilters({
    candidates = [],
    searchQuery = "",
    onSearchChange,
    selectedSimulation = "all",
    onSimulationChange
}: CandidatesFiltersProps) {
    const simulations = Array.from(new Set(candidates.map(c => c.simulationTitle))).sort();

    return (
        <div className="bg-white dark:bg-[#1f1629] p-3 md:p-4 rounded-xl border border-primary/5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-0 sm:min-w-[300px] relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                        className="w-full pl-10 pr-4 h-10 bg-[#f7f6f8] dark:bg-[#130d1a] border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm"
                        placeholder="Search by name or email..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-auto">
                    <select
                        value={selectedSimulation}
                        onChange={(e) => onSimulationChange(e.target.value)}
                        className="w-full sm:w-auto px-4 h-10 bg-[#f7f6f8] dark:bg-[#130d1a] text-slate-600 dark:text-slate-200 font-medium text-sm rounded-lg border-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer outline-none transition-all"
                    >
                        <option value="all">All Simulations</option>
                        {simulations.map(sim => (
                            <option key={sim} value={sim}>{sim}</option>
                        ))}
                    </select>
                </div>
            </div>

            {(searchQuery || selectedSimulation !== "all") && (
                <div className="flex flex-wrap gap-2 pt-3 md:pt-2 border-t border-primary/5">
                    {searchQuery && (
                        <div className="px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full flex items-center gap-2 text-[10px] md:text-xs font-bold text-primary">
                            <span>Search: {searchQuery}</span>
                            <X className="size-3 shrink-0 cursor-pointer hover:text-red-500" onClick={() => onSearchChange("")} />
                        </div>
                    )}
                    {selectedSimulation !== "all" && (
                        <div className="px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full flex items-center gap-2 text-[10px] md:text-xs font-bold text-primary">
                            <span>Simulation: {selectedSimulation}</span>
                            <X className="size-3 shrink-0 cursor-pointer hover:text-red-500" onClick={() => onSimulationChange("all")} />
                        </div>
                    )}
                    <button
                        onClick={() => {
                            onSearchChange("");
                            onSimulationChange("all");
                        }}
                        className="text-[10px] font-black text-slate-400 uppercase hover:text-red-500 transition-colors ml-2 py-1"
                    >
                        Clear All
                    </button>
                </div>
            )}
        </div>
    )
}
