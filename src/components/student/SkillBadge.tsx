"use client"

import React from "react"
import { Target, Award, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface SkillBadgeProps {
    skill: {
        skill_name: string;
        proficiency_level?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
    };
    brandColor?: string;
}

export function SkillBadge({ skill, brandColor }: SkillBadgeProps) {
    const brandColorStyle = brandColor ? { color: brandColor } : {};
    const brandBgStyle = brandColor ? { backgroundColor: `${brandColor}10` } : {};

    const proficiencyConfig: Record<string, { icon: any; color: string; bg: string }> = {
        'Beginner': { icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
        'Intermediate': { icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
        'Advanced': { icon: Shield, color: 'text-green-600', bg: 'bg-green-50' }
    };

    const config = proficiencyConfig[skill.proficiency_level || 'Beginner'] || proficiencyConfig['Beginner'];
    const Icon = config.icon;

    return (
        <div className="group relative flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/5 dark:bg-[#1e1429]">
            <div className={cn("flex size-14 items-center justify-center rounded-2xl", config.bg)} style={brandBgStyle}>
                <Icon size={24} className={config.color} style={brandColorStyle} />
            </div>

            <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    {skill.proficiency_level || "Skill"}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {skill.skill_name}
                </h4>
            </div>

            {/* Subtle glow on hover */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-primary/5 opacity-0 blur-xl transition-opacity group-hover:opacity-100" style={brandBgStyle} />
        </div>
    )
}
