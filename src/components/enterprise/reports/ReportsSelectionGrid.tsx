"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReportsSelectionGridProps {
    simulations: any[];
}

export default function ReportsSelectionGrid({ simulations }: ReportsSelectionGridProps) {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState("all")

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredSimulations = simulations.filter(sim => {
        if (activeTab === "all") return true;
        if (activeTab === "active") return sim.status === "published";
        if (activeTab === "drafts") return sim.status === "draft";
        return true;
    });

    return (
        <div className="space-y-8">
            {/* Filter Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
                <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-full sm:w-auto">
                    {["all", "active", "drafts"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all",
                                activeTab === tab
                                    ? "bg-white dark:bg-slate-800 shadow-md text-primary"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSimulations.map((sim) => (
                    <div
                        key={sim.id}
                        className={cn(
                            "group relative bg-white dark:bg-[#1f162e] rounded-[24px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                        )}
                    >
                        {/* Image Container */}
                        <div className="h-40 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden relative flex-shrink-0">
                            <img
                                src={sim.banner_url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"}
                                alt={sim.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors duration-300 mb-6 line-clamp-2 min-h-[3rem]">
                                    {sim.title}
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[20px] border border-slate-100 dark:border-white/5">
                                        <span className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Completion</span>
                                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {sim.completion_rate ? `${sim.completion_rate}%` : "--"}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[20px] border border-slate-100 dark:border-white/5">
                                        <span className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Avg. Score</span>
                                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {sim.avg_score ? `${sim.avg_score}/100` : "--"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-6 pb-2">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="size-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                            <span className="material-symbols-outlined text-base">groups</span>
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{sim.cohort_count || 0} Groups</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="size-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                                <span className="material-symbols-outlined text-base">calendar_today</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                                {mounted ? new Date(sim.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ""}
                                            </span>
                                        </div>

                                        <span className={cn(
                                            "px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-widest text-white shadow-sm transition-colors",
                                            sim.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                                        )}>
                                            {sim.status === "published" ? "Active" : sim.status}
                                        </span>
                                    </div>
                                </div>

                                <button className="size-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95 group/arrow">
                                    <ArrowRight className="size-5 group-hover/arrow:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredSimulations.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50/50 dark:bg-white/[0.02] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[32px]">
                        <p className="text-slate-500 font-bold uppercase tracking-widest">No simulations found matching this filter</p>
                    </div>
                )}
            </div>
        </div>
    )
}
