"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteSimulation } from "@/actions/simulations";

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

    const getStatusBadge = (status: string) => {
        if (status === 'published') {
            return (
                <span className="text-[9px] font-extrabold px-2 py-1 rounded bg-green-100 text-green-700 uppercase tracking-wider">
                    Published
                </span>
            );
        }
        return (
            <span className="text-[9px] font-extrabold px-2 py-1 rounded bg-orange-100 text-orange-700 uppercase tracking-wider">
                Draft
            </span>
        );
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
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col h-full"
                    >
                        {/* Banner/Logo */}
                        <div className="aspect-[3/1] bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                            {bannerUrl ? (
                                <img
                                    src={bannerUrl}
                                    alt={simulation.title}
                                    className="w-full h-full object-cover"
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

                            <div className="absolute top-3 right-3">
                                {getStatusBadge(simulation.status)}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-4 flex flex-col flex-1">
                            {/* Title & Description */}
                            <div>
                                <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 mb-1">
                                    {simulation.title}
                                </h3>
                                <p className="text-xs text-slate-500 line-clamp-2">
                                    {simulation.short_description || simulation.description || 'No description'}
                                </p>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
                                {simulation.industry && (
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                                        {simulation.industry}
                                    </span>
                                )}
                                {simulation.target_role && (
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                                        {simulation.target_role}
                                    </span>
                                )}
                                {simulation.duration && (
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                                        {simulation.duration}
                                    </span>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 mt-auto">
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">task</span>
                                    <span>{taskCount} tasks</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">psychology</span>
                                    <span>{skillCount} skills</span>
                                </div>
                            </div>

                            {/* Updated Date */}
                            <p className="text-[10px] text-slate-400">
                                Updated {formatDate(simulation.updated_at)}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => handleEdit(simulation.id)}
                                    className="flex-1 px-4 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(simulation.id, simulation.title)}
                                    disabled={deleting === simulation.id}
                                    className="px-4 py-2 text-xs font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                    {deleting === simulation.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
