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
                <div className="absolute -bottom-5 right-6 size-12 overflow-hidden rounded-xl border-4 border-white bg-white shadow-xl dark:border-[#1e1429] dark:bg-[#1e1429] lg:-bottom-6 lg:right-8 lg:size-16 lg:rounded-2xl">
                    <Image
                        src={simulation.company_logo_url || "/placeholder-company.png"}
                        alt="Company"
                        fill
                        className="object-contain p-2"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6 pt-8 lg:p-8 lg:pt-10">
                <div className="mb-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary lg:mb-4 lg:text-[10px]" style={brandColorText}>
                    <Building2 size={10} className="lg:size-3" />
                    <span>{simulation.organization_name || "Global Partner"}</span>
                </div>

                <h3 className="mb-2 text-lg font-bold leading-tight text-slate-900 group-hover:text-primary dark:text-white transition-colors lg:mb-3 lg:text-xl">
                    {simulation.title}
                </h3>

                <p className="mb-6 line-clamp-2 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400 lg:text-sm">
                    {simulation.short_description}
                </p>

                {/* Skills tags */}
                <div className="mb-6 flex flex-wrap gap-2 lg:mb-8">
                    {simulation.simulation_skills?.slice(0, 2).map((skill: any, idx: number) => (
                        <span key={idx} className="flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-white/5 dark:text-slate-400 lg:gap-1.5 lg:px-3 lg:py-1.5 lg:text-[11px]">
                            <Target size={10} className="lg:size-3" />
                            {skill.skill_name}
                        </span>
                    ))}
                </div>

                {/* Progress Bar (if applicable) */}
                {showProgress && (
                    <div className="mb-6 space-y-2 lg:mb-8">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 lg:text-[11px]">
                            <span>Progress</span>
                            <span className="text-primary" style={brandColorText}>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5 lg:h-2">
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
                <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-50 dark:border-white/5 lg:pt-6">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 lg:gap-4 lg:text-[11px]">
                        <div className="flex items-center gap-1">
                            <Clock size={12} className="lg:size-[14px]" />
                            <span>{simulation.duration || "2h"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Trophy size={12} className="lg:size-[14px]" />
                            <span>{simulation.difficulty_level || "Intermediate"}</span>
                        </div>
                    </div>

                    <Link
                        href={`/student/simulations/${simulation.id}/preview`}
                        className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition-all hover:scale-110 hover:bg-primary dark:bg-white/10 dark:hover:bg-primary lg:size-10"
                        style={brandColorStyle}
                    >
                        <ChevronRight size={18} className="lg:size-5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
