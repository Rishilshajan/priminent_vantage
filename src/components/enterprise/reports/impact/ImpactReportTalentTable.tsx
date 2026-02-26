"use client"

import { ArrowRight, Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Talent {
    id: string
    name: string
    institution: string
    score: number
    completionDate: string
    location: string
    avatar_url: string | null
}

interface ImpactReportTalentTableProps {
    talent: Talent[]
    totalCandidates: number
}

export default function ImpactReportTalentTable({ talent, totalCandidates }: ImpactReportTalentTableProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden mb-8 sm:mb-12">
            <div className="p-5 sm:p-8 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white   ">Top Talent Highlights</h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-bold mt-1">Top highest scoring candidates ready for recruitment contact</p>
                </div>
                <button className="text-[10px] sm:text-[11px] font-black text-primary uppercase tracking-[0.15em] hover:translate-x-1 transition-transform inline-flex items-center gap-1.5 group w-fit">
                    View All {totalCandidates.toLocaleString()} Candidates
                    <ArrowRight className="size-3 sm:size-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[700px] sm:min-w-full">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-white/[0.02] text-slate-400 uppercase text-[9px] font-black tracking-[0.2em]">
                            <th className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-white/5">Candidate Name</th>
                            <th className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-white/5">Institution</th>
                            <th className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-white/5">Performance Score</th>
                            <th className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-white/5">Completion Date</th>
                            <th className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-white/5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {talent.map((candidate) => (
                            <tr key={candidate.id} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.01] transition-colors group">
                                <td className="px-5 sm:px-8 py-4 sm:py-6">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="size-9 sm:size-11 rounded-full bg-primary/10 border border-primary/20 overflow-hidden shrink-0 shadow-inner">
                                            {candidate.avatar_url ? (
                                                <img
                                                    src={candidate.avatar_url}
                                                    alt={candidate.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-black text-primary text-[10px] sm:text-xs">
                                                    {candidate.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{candidate.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                                                <MapPin className="size-3" />
                                                {candidate.location}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 sm:px-8 py-4 sm:py-6">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{candidate.institution}</p>
                                </td>
                                <td className="px-5 sm:px-8 py-4 sm:py-6">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-slate-900 dark:text-white">{candidate.score}</span>
                                        <div className="h-1.5 w-16 sm:w-20 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${candidate.score}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 sm:px-8 py-4 sm:py-6">
                                    <p className="text-xs font-bold text-slate-500">{candidate.completionDate}</p>
                                </td>
                                <td className="px-5 sm:px-8 py-4 sm:py-6 text-right">
                                    <Button variant="outline" className="h-8 sm:h-9 px-4 sm:px-5 rounded-lg border-primary/20 text-primary text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95">
                                        View Profile
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
