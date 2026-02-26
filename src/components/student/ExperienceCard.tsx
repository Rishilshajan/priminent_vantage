"use client"

import React from "react"
import { Building2, Calendar, Briefcase } from "lucide-react"

interface ExperienceCardProps {
    experience: {
        id: string;
        company: string;
        role: string;
        industry?: string;
        start_date: string;
        end_date?: string;
        currently_working: boolean;
        description?: string;
    };
    brandColor?: string;
}

export function ExperienceCard({ experience, brandColor }: ExperienceCardProps) {
    const brandColorBorder = brandColor ? { borderLeftColor: brandColor } : { borderLeftColor: '#3b82f6' };
    const brandBgIcon = brandColor ? { backgroundColor: `${brandColor}10`, color: brandColor } : { backgroundColor: '#eff6ff', color: '#3b82f6' };

    const startDate = new Date(experience.start_date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });

    const endDate = experience.currently_working
        ? "Present"
        : (experience.end_date ? new Date(experience.end_date).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        }) : "");

    return (
        <div className="group relative flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:border-white/5 dark:bg-[#1e1429] dark:hover:shadow-none lg:p-8"
            style={{ borderLeftWidth: '4px', ...brandColorBorder }}>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl sm:size-14" style={brandBgIcon}>
                        <Building2 size={24} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white lg:text-xl">
                            {experience.role}
                        </h4>
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <span>{experience.company}</span>
                            {experience.industry && (
                                <>
                                    <span className="size-1 rounded-full bg-slate-300" />
                                    <span className="text-slate-400">{experience.industry}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:bg-white/5 sm:shrink-0">
                    <Calendar size={14} />
                    <span>{startDate} — {endDate}</span>
                </div>
            </div>

            {experience.description && (
                <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {experience.description}
                </p>
            )}
        </div>
    )
}
