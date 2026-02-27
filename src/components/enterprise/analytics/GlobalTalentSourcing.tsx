"use client"

import { useState } from "react"
import { Map } from "lucide-react"

interface GlobalTalentSourcingProps {
    geoData?: { name: string; count: number; avgScore?: string }[];
    institutionData?: { name: string; count: number; avgScore?: string }[];
}

export default function GlobalTalentSourcing({ geoData = [], institutionData = [] }: GlobalTalentSourcingProps) {
    const [activeTab, setActiveTab] = useState<'regions' | 'institutions'>('regions');

    const displayData = activeTab === 'regions' ? geoData : institutionData;
    const hasRealData = displayData && displayData.length > 0;

    return (
        <div className="card-container bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-6 transition-all hover:shadow-md">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-[#1f1629] gap-4">
                <div>
                    <h4 className="text-base font-black text-[#140d1b] dark:text-white tracking-tight">Global Talent Sourcing</h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        {activeTab === 'regions' ? "Geographic Distribution of Candidates" : "Educational Institution Breakdown"}
                    </p>
                </div>
                <div className="flex bg-slate-50 dark:bg-[#130d1a]/50 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('regions')}
                        className={`px-5 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${activeTab === 'regions'
                            ? "bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            }`}
                    >
                        Regions
                    </button>
                    <button
                        onClick={() => setActiveTab('institutions')}
                        className={`px-5 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${activeTab === 'institutions'
                            ? "bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            }`}
                    >
                        Institutions
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-10 border-r border-slate-100 dark:border-slate-800 flex items-center justify-center bg-slate-50/50 dark:bg-[#130d1a]/20 min-h-[300px]">
                    <div className="text-center group">
                        <div className="relative">
                            <Map className="size-36 text-slate-200 dark:text-slate-800 group-hover:text-primary/20 transition-colors duration-500" strokeWidth={1} />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="p-3 bg-white/80 dark:bg-[#1f1629]/80 backdrop-blur-sm rounded-2xl border border-primary/20 shadow-xl">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-tighter">Live Spatial Map</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-6 opacity-60">Interactive Matrix Active</p>
                    </div>
                </div>
                <div className="p-0 overflow-x-auto bg-white dark:bg-[#1f1629]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#fcfdfe] dark:bg-[#130d1a]/30 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4 border-b border-slate-100 dark:border-slate-800">
                                    {activeTab === 'regions' ? "Regional Segment" : "Institution Name"}
                                </th>
                                <th className="px-8 py-4 border-b border-slate-100 dark:border-slate-800">Candidate Count</th>
                                <th className="px-8 py-4 border-b border-slate-100 dark:border-slate-800 text-right">Performance Index</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {hasRealData ? displayData.map((d, i) => (
                                <tr key={i} className="hover:bg-[#f8fafc] dark:hover:bg-[#130d1a]/50 transition-colors group">
                                    <td className="px-8 py-5 border-b border-slate-50 dark:border-slate-800/60">
                                        <div className="flex items-center gap-3">
                                            <div className="size-2 rounded-full bg-primary/40 group-hover:scale-125 transition-transform"></div>
                                            <span className="font-bold text-[#140d1b] dark:text-slate-200">{d.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 border-b border-slate-50 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 font-medium">{d.count}</td>
                                    <td className="px-8 py-5 border-b border-slate-50 dark:border-slate-800/60 text-right">
                                        <span className="font-black text-primary bg-primary/5 px-2 py-1 rounded-md">
                                            {d.avgScore || "0.0"}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                [1, 2, 3, 4, 5].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-5 border-b border-slate-50 dark:border-slate-800/60"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24"></div></td>
                                        <td className="px-8 py-5 border-b border-slate-50 dark:border-slate-800/60"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-12"></div></td>
                                        <td className="px-8 py-5 border-b border-slate-50 dark:border-slate-800/60 text-right"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-8 ml-auto"></div></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
