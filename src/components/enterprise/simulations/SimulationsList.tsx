"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteSimulation } from "@/actions/simulations";
import { cn } from "@/lib/utils";

interface Simulation {
    id: string;
    title: string;
    short_description: string | null;
    description: string | null;
    industry: string | null;
    target_role: string | null;
    duration: string | null;
    difficulty_level: string | null;
    status: 'draft' | 'published';
    company_logo_url: string | null;
    banner_url: string | null;
    created_at: string;
    updated_at: string;
    simulation_tasks?: any[];
    simulation_skills?: any[];
}

interface SimulationsListProps {
    simulations: Simulation[];
}

export default function SimulationsList({ simulations }: SimulationsListProps) {
    const router = useRouter();
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleEdit = (simulationId: string) => {
        router.push(`/enterprise/simulations/edit/${simulationId}`);
    };

    const handleDelete = async (simulationId: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return;
        }

        setDeleting(simulationId);
        const result = await deleteSimulation(simulationId);

        if (result.error) {
            alert(result.error);
            setDeleting(null);
        } else {
            // Refresh the page to show updated list
            router.refresh();
        }
    };


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simulations.map((simulation) => {
                const taskCount = Array.isArray(simulation.simulation_tasks) ? simulation.simulation_tasks.length : 0;
                const skillCount = Array.isArray(simulation.simulation_skills) ? simulation.simulation_skills.length : 0;
                const bannerUrl = simulation.banner_url;

                return (
                    <div
                        key={simulation.id}
                        className="group relative bg-white dark:bg-[#1f162e] rounded-[24px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
                    >
                        {/* Image Container */}
                        <div className="h-40 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden relative flex-shrink-0">
                            {bannerUrl ? (
                                <img
                                    src={bannerUrl}
                                    alt={simulation.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                            ) : null}

                            {/* Fallback Icon */}
                            <div className={`flex items-center justify-center h-full w-full absolute top-0 left-0 bg-gradient-to-br from-primary/10 to-primary/5 ${bannerUrl ? 'hidden' : ''}`}>
                                <span className="material-symbols-outlined text-5xl text-primary/30">
                                    account_tree
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors duration-300 mb-6 line-clamp-2 min-h-[3rem]">
                                    {simulation.title}
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[20px] border border-slate-100 dark:border-white/5">
                                        <span className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[10px]">task</span>
                                            Tasks
                                        </span>
                                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {taskCount}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[20px] border border-slate-100 dark:border-white/5">
                                        <span className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[10px]">psychology</span>
                                            Skills
                                        </span>
                                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {skillCount}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto border-t border-slate-100 dark:border-white/5 pt-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="size-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                                <span className="material-symbols-outlined text-base">calendar_today</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                                {formatDate(simulation.updated_at)}
                                            </span>
                                        </div>

                                        <span className={cn(
                                            "px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-widest text-white shadow-sm transition-colors",
                                            simulation.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                                        )}>
                                            {simulation.status === "published" ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pb-2">
                                    <button
                                        onClick={() => handleEdit(simulation.id)}
                                        className="flex-1 h-11 bg-primary dark:bg-primary/90 text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(simulation.id, simulation.title)}
                                        disabled={deleting === simulation.id}
                                        className="h-11 px-4 border border-red-200 dark:border-red-900/30 text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-50 flex items-center justify-center active:scale-95"
                                        title="Delete Simulation"
                                    >
                                        <span className="material-symbols-outlined text-lg font-bold">
                                            {deleting === simulation.id ? 'sync' : 'delete'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
