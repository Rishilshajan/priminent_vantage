"use client"

import { useMemo } from "react"

interface Skill {
    name: string;
    count: number;
    pct: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface CoreCompetenciesProps {
    skills?: Skill[];
}

const FALLBACK_SKILLS: Skill[] = [
    { name: "Python", count: 92, pct: 92, level: "Advanced" },
    { name: "Analysis", count: 88, pct: 88, level: "Advanced" },
    { name: "SQL", count: 81, pct: 81, level: "Intermediate" },
    { name: "Logic", count: 74, pct: 74, level: "Intermediate" },
    { name: "Cloud", count: 94, pct: 94, level: "Advanced" },
    { name: "Comm.", count: 62, pct: 62, level: "Intermediate" },
    { name: "Strategy", count: 45, pct: 45, level: "Beginner" },
    { name: "Design", count: 68, pct: 68, level: "Intermediate" },
];

export default function CoreCompetencies({ skills }: CoreCompetenciesProps) {
    const hasRealData = skills !== undefined && skills !== null && skills.length > 0;
    const displaySkills = skills && skills.length > 0 ? skills : (skills === undefined ? FALLBACK_SKILLS : []);

    const maxPct = Math.max(...displaySkills.map(s => s.pct), 1);

    return (
        <div className="bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-base font-black text-[#140d1b] dark:text-white tracking-tight">Core Competencies</h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        {hasRealData ? "Skill frequency across your talent pool" : "Simulated · No skills data yet"}
                    </p>
                </div>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-lg">
                    {displaySkills.length} Skills
                </span>
            </div>

            <div className="space-y-3">
                {displaySkills.map((skill, i) => {
                    const barWidth = `${(skill.pct / maxPct) * 100}%`;
                    const isTop = skill.pct >= 80;
                    const isMid = skill.pct >= 50;
                    return (
                        <div key={i} className="group flex items-center gap-3">
                            {/* Skill name */}
                            <div className="w-24 text-right shrink-0">
                                <span className={`text-[11px] font-black uppercase tracking-widest ${isTop ? 'text-primary' : isMid ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}>
                                    {skill.name.length > 9 ? skill.name.slice(0, 9) + '.' : skill.name}
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="flex-1 h-7 bg-slate-50 dark:bg-[#130d1a]/50 rounded-lg border border-slate-100 dark:border-slate-800/60 overflow-hidden relative">
                                <div
                                    className={`h-full rounded-lg transition-all duration-700 ${isTop ? 'bg-gradient-to-r from-primary/80 to-primary' :
                                        isMid ? 'bg-gradient-to-r from-indigo-400/60 to-indigo-500/60' :
                                            'bg-slate-200 dark:bg-slate-700/50'
                                        }`}
                                    style={{ width: barWidth }}
                                />
                                <div className="absolute inset-0 flex items-center px-3">
                                    <span className={`text-[11px] font-black ${isTop ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {skill.pct}%
                                    </span>
                                    <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider ${isTop ? 'text-white/70' : 'text-slate-400'}`}>
                                        {skill.level}
                                    </span>
                                </div>
                            </div>

                            {/* Count chip */}
                            <div className="w-10 text-right shrink-0">
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-600">
                                    {skill.count}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
