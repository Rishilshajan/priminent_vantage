"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
    status: "draft" | "published";
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
        if (
            !confirm(
                `Are you sure you want to delete "${title}"? This action cannot be undone.`
            )
        )
            return;

        setDeleting(simulationId);
        const result = await deleteSimulation(simulationId);

        if (result.error) {
            alert(result.error);
            setDeleting(null);
        } else {
            router.refresh();
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getStatusBadge = (status: Simulation["status"]) => {
        return status === "published"
            ? "bg-emerald-500/12 text-emerald-700 border-emerald-200 dark:text-emerald-300 dark:border-emerald-500/25"
            : "bg-amber-500/12 text-amber-800 border-amber-200 dark:text-amber-300 dark:border-amber-500/25";
    };

    const getDifficultyStyles = (level: string | null) => {
        const v = (level ?? "").toLowerCase();
        if (v.includes("easy"))
            return "bg-sky-500/10 text-sky-700 border-sky-200 dark:text-sky-300 dark:border-sky-500/25";
        if (v.includes("medium"))
            return "bg-violet-500/10 text-violet-700 border-violet-200 dark:text-violet-300 dark:border-violet-500/25";
        if (v.includes("hard") || v.includes("advanced"))
            return "bg-rose-500/10 text-rose-700 border-rose-200 dark:text-rose-300 dark:border-rose-500/25";
        return "bg-slate-500/10 text-slate-700 border-slate-200 dark:text-slate-300 dark:border-white/10";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {simulations.map((simulation) => {
                const taskCount = Array.isArray(simulation.simulation_tasks)
                    ? simulation.simulation_tasks.length
                    : 0;
                const skillCount = Array.isArray(simulation.simulation_skills)
                    ? simulation.simulation_skills.length
                    : 0;

                const bannerUrl = simulation.banner_url;

                const metaPills = useMemo(() => {
                    const pills: { icon: string; label: string; className?: string }[] =
                        [];

                    if (simulation.industry)
                        pills.push({
                            icon: "apartment",
                            label: simulation.industry,
                            className:
                                "bg-slate-500/10 text-slate-700 border-slate-200 dark:text-slate-200 dark:border-white/10",
                        });

                    if (simulation.target_role)
                        pills.push({
                            icon: "person",
                            label: simulation.target_role,
                            className:
                                "bg-indigo-500/10 text-indigo-700 border-indigo-200 dark:text-indigo-300 dark:border-indigo-500/25",
                        });

                    if (simulation.duration)
                        pills.push({
                            icon: "schedule",
                            label: simulation.duration,
                            className:
                                "bg-cyan-500/10 text-cyan-700 border-cyan-200 dark:text-cyan-300 dark:border-cyan-500/25",
                        });

                    if (simulation.difficulty_level)
                        pills.push({
                            icon: "bolt",
                            label: simulation.difficulty_level,
                            className: getDifficultyStyles(simulation.difficulty_level),
                        });

                    return pills.slice(0, 4);
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [
                    simulation.industry,
                    simulation.target_role,
                    simulation.duration,
                    simulation.difficulty_level,
                ]);

                return (
                    <div
                        key={simulation.id}
                        className={cn(
                            "group relative overflow-hidden rounded-3xl border",
                            "bg-white/80 dark:bg-[#1b1427]/70",
                            "border-slate-200/70 dark:border-white/10",
                            "shadow-sm hover:shadow-xl transition-all duration-300",
                            "flex flex-col h-full"
                        )}
                    >
                        {/* Top glow */}
                        <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Banner */}
                        <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-900/40 overflow-hidden">
                            {bannerUrl ? (
                                <img
                                    src={bannerUrl}
                                    alt={simulation.title}
                                    className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-[1400ms] ease-out"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        e.currentTarget.nextElementSibling?.classList.remove(
                                            "hidden"
                                        );
                                    }}
                                />
                            ) : null}

                            {/* Fallback */}
                            <div
                                className={cn(
                                    "absolute inset-0 flex items-center justify-center",
                                    "bg-gradient-to-br from-primary/15 via-primary/5 to-transparent",
                                    bannerUrl ? "hidden" : ""
                                )}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="size-14 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-primary/60">
                                            account_tree
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300/80">
                                        No banner
                                    </span>
                                </div>
                            </div>

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
                        </div>

                        {/* Body */}
                        <div className="p-6 flex-1 flex flex-col">
                            {/* Header row (Title + status + date) */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="text-lg font-extrabold leading-snug text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                                        {simulation.title}
                                    </h3>

                                    {/* Move status + date UNDER title (cleaner, less busy) */}
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border",
                                                "text-[11px] font-extrabold tracking-wide",
                                                getStatusBadge(simulation.status)
                                            )}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">
                                                {simulation.status === "published" ? "public" : "draft"}
                                            </span>
                                            {simulation.status === "published" ? "Published" : "Draft"}
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                            <span className="material-symbols-outlined text-[16px]">
                                                update
                                            </span>
                                            Updated {formatDate(simulation.updated_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions (right aligned) */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleEdit(simulation.id)}
                                        className={cn(
                                            "size-10 rounded-xl border",
                                            "border-slate-200 dark:border-white/10",
                                            "bg-white/70 dark:bg-white/5",
                                            "hover:bg-slate-50 dark:hover:bg-white/10 transition",
                                            "grid place-items-center"
                                        )}
                                        title="Edit"
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-slate-700 dark:text-slate-200">
                                            edit
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => handleDelete(simulation.id, simulation.title)}
                                        disabled={deleting === simulation.id}
                                        className={cn(
                                            "size-10 rounded-xl border grid place-items-center transition",
                                            "border-red-200 dark:border-red-900/30",
                                            "bg-white/70 dark:bg-white/5",
                                            "hover:bg-red-50 dark:hover:bg-red-950/25",
                                            "disabled:opacity-60 disabled:cursor-not-allowed"
                                        )}
                                        title="Delete"
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-red-600 dark:text-red-300">
                                            {deleting === simulation.id ? "sync" : "delete"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Short description */}
                            {simulation.short_description ? (
                                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
                                    {simulation.short_description}
                                </p>
                            ) : (
                                <p className="mt-3 text-sm text-slate-400 dark:text-slate-500 italic">
                                    No description added yet.
                                </p>
                            )}

                            {/* Meta pills */}
                            {metaPills.length ? (
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    {metaPills.map((p, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "group/meta rounded-2xl border p-3",
                                                "bg-slate-50 dark:bg-white/5",
                                                "border-slate-500/50 border-dashed dark:border-white/10",
                                                "hover:bg-white dark:hover:bg-white/7 transition-all"
                                            )}
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="mt-0.5 size-9 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 grid place-items-center">
                                                    <span className="material-symbols-outlined text-[18px] text-slate-700 dark:text-slate-200">
                                                        {p.icon}
                                                    </span>
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="text-[10px] font-extrabold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                                                        {p.icon === "apartment"
                                                            ? "Industry"
                                                            : p.icon === "person"
                                                                ? "Role"
                                                                : p.icon === "schedule"
                                                                    ? "Duration"
                                                                    : "Difficulty"}
                                                    </div>
                                                    <div className="mt-0.5 text-[12px] font-semibold text-slate-900 dark:text-white truncate">
                                                        {p.label}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {/* Stats row (more compact + readable) */}
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4">
                                    <div className="flex items-center gap-2 text-[11px] font-extrabold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
                                        <span className="material-symbols-outlined text-[16px]">
                                            checklist
                                        </span>
                                        Tasks
                                    </div>
                                    <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                                        {taskCount}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4">
                                    <div className="flex items-center gap-2 text-[11px] font-extrabold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
                                        <span className="material-symbols-outlined text-[16px]">
                                            psychology
                                        </span>
                                        Skills
                                    </div>
                                    <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                                        {skillCount}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom CTA */}
                            <div className="mt-6">
                                <button
                                    onClick={() => handleEdit(simulation.id)}
                                    className={cn(
                                        "w-full h-12 rounded-2xl font-extrabold text-[12px] tracking-widest uppercase",
                                        "text-white",
                                        "bg-gradient-to-r from-primary to-primary/80",
                                        "hover:brightness-[1.05] active:scale-[0.99] transition",
                                        "shadow-lg shadow-primary/20",
                                        "flex items-center justify-center gap-2"
                                    )}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        tune
                                    </span>
                                    Manage Simulation
                                </button>
                            </div>
                        </div>

                        {/* Bottom separator */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200/70 to-transparent dark:via-white/10" />
                    </div>
                );
            })}
        </div>
    );
}