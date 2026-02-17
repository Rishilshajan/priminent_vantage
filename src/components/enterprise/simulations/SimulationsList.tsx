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
    program_banner_url: string | null;
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
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Simulation Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Role & Industry</th>
                            <th className="px-6 py-4 text-center">Tasks</th>
                            <th className="px-6 py-4 text-center">Skills</th>
                            <th className="px-6 py-4">Last Updated</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {simulations.map((simulation) => {
                            const taskCount = Array.isArray(simulation.simulation_tasks) ? simulation.simulation_tasks.length : 0;
                            const skillCount = Array.isArray(simulation.simulation_skills) ? simulation.simulation_skills.length : 0;
                            const bannerUrl = simulation.company_logo_url;

                            return (
                                <tr
                                    key={simulation.id}
                                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                    onClick={() => handleEdit(simulation.id)}
                                >
                                    <td className="px-6 py-4 max-w-[300px]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                                                {bannerUrl ? (
                                                    <img src={bannerUrl} alt="" className="w-full h-full object-contain p-1" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-slate-400">api</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 dark:text-white truncate">
                                                    {simulation.title}
                                                </div>
                                                <div className="text-xs text-slate-500 truncate mt-0.5">
                                                    {simulation.short_description || simulation.description || 'No description'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(simulation.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-700 dark:text-slate-200 font-medium text-xs">
                                                {simulation.target_role || '-'}
                                            </span>
                                            <span className="text-slate-500 text-[10px]">
                                                {simulation.industry || '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                                            {taskCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                                            {skillCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {formatDate(simulation.updated_at)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => handleEdit(simulation.id)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(simulation.id, simulation.title)}
                                                disabled={deleting === simulation.id}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {deleting === simulation.id ? 'refresh' : 'delete'}
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {simulations.map((simulation) => {
                    const taskCount = Array.isArray(simulation.simulation_tasks) ? simulation.simulation_tasks.length : 0;
                    const skillCount = Array.isArray(simulation.simulation_skills) ? simulation.simulation_skills.length : 0;
                    const bannerUrl = simulation.program_banner_url || simulation.company_logo_url;

                    return (
                        <div
                            key={simulation.id}
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                            onClick={() => handleEdit(simulation.id)}
                        >
                            <div className="p-4 flex items-start gap-4 border-b border-slate-100 dark:border-slate-800/50">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                                    {bannerUrl ? (
                                        <img src={bannerUrl} alt="" className="w-full h-full object-contain p-1" />
                                    ) : (
                                        <span className="material-symbols-outlined text-slate-400">api</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate pr-2">
                                            {simulation.title}
                                        </h3>
                                        <div className="flex-shrink-0">
                                            {getStatusBadge(simulation.status)}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                        {simulation.short_description || simulation.description || 'No description'}
                                    </p>
                                </div>
                            </div>

                            <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs text-slate-500">
                                <div className="flex gap-3">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">task</span>
                                        {taskCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">psychology</span>
                                        {skillCount}
                                    </span>
                                </div>
                                <span>{formatDate(simulation.updated_at)}</span>
                            </div>

                            <div className="p-2 flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(simulation.id);
                                    }}
                                    className="flex-1 py-2 text-xs font-semibold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(simulation.id, simulation.title);
                                    }}
                                    disabled={deleting === simulation.id}
                                    className="px-4 py-2 text-xs font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors disabled:opacity-50"
                                >
                                    {deleting === simulation.id ? '...' : <span className="material-symbols-outlined text-[16px]">delete</span>}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
