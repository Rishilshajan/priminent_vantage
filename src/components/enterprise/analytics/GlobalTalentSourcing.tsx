"use client"

import { Map } from "lucide-react"

export default function GlobalTalentSourcing() {
    return (
        <div className="card-container bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1f1629]">
                <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Global Talent Sourcing</h4>
                    <p className="text-xs text-slate-400 font-medium">Performance by regional and institutional cohorts</p>
                </div>
                <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded border border-slate-100 dark:border-slate-700">
                    <button className="px-4 py-1 bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600 text-[10px] font-bold text-slate-700 dark:text-white rounded uppercase tracking-wider">Regions</button>
                    <button className="px-4 py-1 text-[10px] font-bold text-slate-400 rounded uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300">Institutions</button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 border-r border-slate-100 dark:border-slate-800 flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/20">
                    <div className="text-center">
                        <Map className="size-32 text-slate-200 dark:text-slate-700 mx-auto" strokeWidth={1} />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Interactive Spatial Matrix Active</p>
                    </div>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3 border-b border-slate-100 dark:border-slate-800">Regional Segment</th>
                                <th className="px-6 py-3 border-b border-slate-100 dark:border-slate-800">Count</th>
                                <th className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 text-right">Avg Performance</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">North America - Ivy League</td>
                                <td className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 text-slate-500">2,410</td>
                                <td className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 text-right"><span className="font-bold text-primary">82.4</span></td>
                            </tr>
                            <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">Western Europe - Tech Hubs</td>
                                <td className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 text-slate-500">1,890</td>
                                <td className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 text-right"><span className="font-bold text-primary">79.8</span></td>
                            </tr>
                            <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">South East Asia - Top 50</td>
                                <td className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 text-slate-500">3,240</td>
                                <td className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 text-right"><span className="font-bold text-primary">74.2</span></td>
                            </tr>
                            <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">LATAM - Specialized Univ.</td>
                                <td className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 text-slate-500">1,120</td>
                                <td className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 text-right"><span className="font-bold text-primary">71.5</span></td>
                            </tr>
                            <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Oceania - Grad Programs</td>
                                <td className="px-6 py-4 text-slate-500">840</td>
                                <td className="px-6 py-4 text-right"><span className="font-bold text-primary">76.9</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
