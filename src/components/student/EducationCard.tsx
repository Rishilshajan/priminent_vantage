"use client"

import React from "react"
import { GraduationCap, Calendar, BookOpen } from "lucide-react"

interface EducationCardProps {
    education: {
        id: string;
        institution: string;
        degree_type: string;
        field_of_study: string;
        graduation_year: number;
        cgpa_value?: string;
        cgpa_scale?: number;
    };
    brandColor?: string;
}

export function EducationCard({ education, brandColor }: EducationCardProps) {
    const brandColorBorder = brandColor ? { borderLeftColor: brandColor } : { borderLeftColor: '#3b82f6' };
    const brandBgIcon = brandColor ? { backgroundColor: `${brandColor}10`, color: brandColor } : { backgroundColor: '#eff6ff', color: '#3b82f6' };

    return (
        <div className="group relative flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:border-white/5 dark:bg-[#1e1429] dark:hover:shadow-none lg:p-8"
            style={{ borderLeftWidth: '4px', ...brandColorBorder }}>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl sm:size-14" style={brandBgIcon}>
                        <GraduationCap size={24} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white lg:text-xl">
                            {education.degree_type} in {education.field_of_study}
                        </h4>
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <span>{education.institution}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:bg-white/5 sm:shrink-0">
                    <Calendar size={14} />
                    <span>Class of {education.graduation_year}</span>
                </div>
            </div>

            {education.cgpa_value && (
                <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:bg-white/5 dark:text-slate-400">
                        <span className="text-slate-400">CGPA:</span>
                        <span className="text-slate-900 dark:text-white">{education.cgpa_value}/{education.cgpa_scale || 4.0}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
