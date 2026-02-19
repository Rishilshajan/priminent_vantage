"use client"

import { Globe } from "lucide-react"

interface Institution {
    name: string
    count: number
    percentage: number
}

interface Region {
    name: string
    percentage: number
}

interface ImpactReportDemographicsProps {
    institutions: Institution[]
    regions: Region[]
}

export default function ImpactReportDemographics({ institutions, regions }: ImpactReportDemographicsProps) {
    return (
        <div className="flex flex-col gap-8 h-full">
            {/* Top Institutions */}
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mb-6 sm:mb-8">Top Contributing Institutions</h3>
                <div className="space-y-4 sm:space-y-6">
                    {institutions.map((inst, index) => (
                        <div key={index} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="size-2 rounded-full bg-primary shadow-sm shadow-primary/30 group-hover:scale-125 transition-transform"
                                    style={{ opacity: 1 - (index * 0.2) }}></div>
                                <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                                    {inst.name}
                                </span>
                            </div>
                            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight">
                                {inst.count.toLocaleString()} <span className="text-slate-400 font-bold ml-1">({inst.percentage}%)</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Regional Distribution */}
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-4 sm:mb-2">
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Regional Distribution</h3>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">Global reach of the simulation enrollment</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-auto mb-2">
                        <div className="space-y-4 sm:space-y-5">
                            {regions.map((region, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{region.name}</span>
                                        <span className="text-[11px] font-black text-slate-900 dark:text-white">{region.percentage}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${region.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="hidden sm:flex items-center justify-center relative">
                            <Globe className="size-20 lg:size-24 text-primary/5 dark:text-primary/10 select-none group-hover:rotate-[30deg] transition-transform duration-[2000ms] ease-in-out" />
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-50"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
