"use client"

import { Info } from "lucide-react"

interface Skill {
    name: string
    mastery: number
}

interface ImpactReportHeatmapProps {
    skills: Skill[]
}

export default function ImpactReportHeatmap({ skills }: ImpactReportHeatmapProps) {
    return (
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm h-full flex flex-col">
            <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white   ">Skill Validation Heatmap</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-bold mt-1">Competency alignment across technical and behavioral pillars</p>
            </div>

            <div className="space-y-6 flex-1">
                {/* Column Headers - hidden on smallest screens when stacked */}
                <div className="hidden sm:grid grid-cols-5 items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] col-span-2">Skill</span>
                    <div className="col-span-3 flex items-center justify-between px-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Struggle</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mastery</span>
                    </div>
                </div>

                {/* Skill Rows */}
                {skills.map((skill, index) => (
                    <div key={index} className="flex flex-col sm:grid sm:grid-cols-5 sm:items-center gap-2 sm:gap-4 group">
                        <span className="text-sm font-black text-slate-700 dark:text-slate-200 sm:col-span-2 group-hover:text-primary transition-colors">
                            {skill.name}
                        </span>
                        <div className="sm:col-span-3 flex gap-1 sm:gap-1.5 h-8 sm:h-10">
                            {Array.from({ length: 5 }).map((_, i) => {
                                const stepMastery = (i + 1) * 20
                                const isFilled = skill.mastery >= stepMastery
                                const opacity = isFilled ? (i + 1) * 0.2 : 0

                                return (
                                    <div
                                        key={i}
                                        className="flex-1 rounded-lg transition-all duration-700 ease-out border border-slate-100 dark:border-white/5"
                                        style={{
                                            backgroundColor: isFilled ? `rgba(127, 19, 236, ${opacity})` : 'transparent',
                                            boxShadow: isFilled && i === 4 ? '0 0 12px rgba(127, 19, 236, 0.2)' : 'none'
                                        }}
                                    ></div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex gap-4 items-center bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                <div className="size-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-amber-500 text-lg">info</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-bold">
                    Candidates struggle most with <span className="text-primary">DCF Valuation</span> and <span className="text-primary">Market Research</span>, suggesting a need for additional preparatory resources in these areas.
                </p>
            </div>
        </div>
    )
}
