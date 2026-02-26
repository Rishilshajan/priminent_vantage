"use client"

import { useState, useEffect } from "react"
import { Download, FileText, FileDown, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecentReportsTableProps {
    simulations: any[];
}

export default function RecentReportsTable({ simulations }: RecentReportsTableProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Filter simulations that have at least one group (cohort)
    const activeReports = simulations.filter(sim => (sim.cohort_count || 0) > 0);

    return (
        <section className="space-y-8 pb-10">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-slate-200 dark:border-white/5 pb-8 gap-4">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white    leading-tight">Organizational Group Reports</h3>
                    <p className="text-sm text-slate-500 font-bold mt-2 uppercase tracking-widest opacity-60">Consolidated analytics for student groups and simulation performance</p>
                </div>
            </div>

            {/* Table or Empty State */}
            {activeReports.length > 0 ? (
                <div className="bg-white dark:bg-[#1f162e] rounded-[32px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all hover:shadow-primary/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-white/[0.03] border-b border-slate-100 dark:border-white/5">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Simulation Name</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Date Created</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {activeReports.map((sim) => (
                                    <tr key={sim.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className={cn(
                                                    "size-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm bg-primary/10 text-primary"
                                                )}>
                                                    <FileText className="size-7" />
                                                </div>
                                                <div>
                                                    <span className="block text-base font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight mb-2   ">
                                                        {sim.title}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none">
                                                        {sim.industry || "General Industry"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300   ">
                                                    {mounted ? new Date(sim.created_at).toLocaleDateString() : ""}
                                                </span>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1 tracking-wider">
                                                    {mounted ? new Date(sim.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                sim.status === 'published' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500" : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500"
                                            )}>
                                                {sim.status === 'published' ? 'Active' : sim.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end items-center gap-8">
                                                <button className="text-[10px] font-black text-slate-400 hover:text-primary transition-all uppercase tracking-[0.15em] active:scale-95">
                                                    View Analytics
                                                </button>
                                                <button className="size-12 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:border-primary hover:text-white hover:scale-110 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
                                                    <Download className="size-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="py-24 flex flex-col items-center justify-center bg-white dark:bg-[#1f162e] rounded-[32px] border-2 border-dashed border-slate-200 dark:border-white/10 shadow-sm text-center px-10">
                    <div className="size-20 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-8 border border-slate-100 dark:border-white/5">
                        <span className="material-symbols-outlined text-5xl">description</span>
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white    uppercase">No Reports Generated</h4>
                    <p className="text-slate-500 font-bold mt-2 max-w-md leading-relaxed">There are currently no active group reports. Generate your first group report by selecting a simulation above.</p>
                </div>
            )}
        </section>
    )
}

