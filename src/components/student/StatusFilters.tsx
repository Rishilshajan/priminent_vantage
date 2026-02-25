"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface StatusFiltersProps {
    currentFilter: string;
    onFilterChange: (filter: string) => void;
    brandColor?: string;
}

export function StatusFilters({ currentFilter, onFilterChange, brandColor }: StatusFiltersProps) {
    const filters = ["All", "In Progress", "Completed"]

    const brandColorStyle = brandColor ? { backgroundColor: brandColor } : {};

    return (
        <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={cn(
                        "rounded-full px-6 py-2.5 text-sm font-bold transition-all",
                        currentFilter === filter
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 shadow-sm"
                    )}
                    style={currentFilter === filter ? brandColorStyle : {}}
                >
                    {filter}
                </button>
            ))}
        </div>
    )
}
