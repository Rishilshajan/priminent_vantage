"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Trophy, ChevronRight, Building2, Calendar, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface SimulationCardProps {
    simulation: any;
    status?: 'not_started' | 'in_progress' | 'completed';
    progress?: number;
    showProgress?: boolean;
    brandColor?: string;
    actionButton?: React.ReactNode;
}

export function SimulationCard({
    simulation,
    status,
    progress = 0,
    showProgress = false,
    brandColor,
    actionButton
}: SimulationCardProps) {
    const brandColorStyle = brandColor ? { backgroundColor: brandColor } : {};
    const brandColorBorder = brandColor ? { borderColor: brandColor } : {};
    const brandColorText = brandColor ? { color: brandColor } : {};

    const statusConfig = {
        not_started: { label: "Not Started", color: "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400" },
        in_progress: { label: "In Progress", color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
        completed: { label: "Completed", color: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" }
    };

    const currentStatus = status || 'not_started';

    return (
        <div className="group flex flex-col overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 dark:border-white/5 dark:bg-[#1e1429] dark:shadow-none">
            {/* Card Image Wrapper */}
            <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                    src={simulation.banner_url || "/placeholder-sim.jpg"}
                    alt={simulation.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Status Badge */}
                <div className="absolute left-6 top-6">
                    <span className={cn(
                        "rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md",
                        statusConfig[currentStatus].color
                    )}>
                        {statusConfig[currentStatus].label}
                    </span>
                </div>

                {/* Company Logo overlap */}
                <div className="absolute -bottom-6 right-8 size-16 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl dark:border-[#1e1429] dark:bg-[#1e1429]">
                    <Image
                        src={simulation.company_logo_url || "/placeholder-company.png"}
                        alt="Company"
                        fill
                        className="object-contain p-2"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-8 pt-10">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary" style={brandColorText}>
                    <Building2 size={12} />
                    <span>{simulation.organization_name || "Global Partner"}</span>
                </div>

                <h3 className="mb-3 text-xl font-bold leading-tight text-slate-900 group-hover:text-primary dark:text-white transition-colors">
                    {simulation.title}
                </h3>

                <p className="mb-6 line-clamp-2 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {simulation.short_description}
                </p>

                {/* Skills tags */}
                <div className="mb-8 flex flex-wrap gap-2">
                    {simulation.simulation_skills?.slice(0, 2).map((skill: any, idx: number) => (
                        <span key={idx} className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:bg-white/5 dark:text-slate-400">
                            <Target size={12} />
                            {skill.skill_name}
                        </span>
                    ))}
                </div>

                {/* Progress Bar (if applicable) */}
                {showProgress && (
                    <div className="mb-8 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                            <span>Progress</span>
                            <span className="text-primary" style={brandColorText}>{progress}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-1000"
                                style={{
                                    width: `${progress}%`,
                                    ...(brandColor ? { backgroundColor: brandColor } : {})
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Action Footer */}
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            <span>{simulation.duration || "2h"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Trophy size={14} />
                            <span>{simulation.difficulty_level || "Intermediate"}</span>
                        </div>
                    </div>

                    <Link
                        href={`/student/simulation/${simulation.id}`}
                        className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition-all hover:scale-110 hover:bg-primary dark:bg-white/10 dark:hover:bg-primary"
                        style={brandColorStyle}
                    >
                        <ChevronRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    )
}
