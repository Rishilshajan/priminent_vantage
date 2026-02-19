"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const candidates = [
    {
        id: 1,
        name: "Jane Cooper",
        email: "jane.c@enterprise.com",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXRWa3Ylsw6uz31pc7b--NQ9JNGhBP6-4N1IbraLUfhC7f2pdKvGqlvxhEM4U09VfdGz1E9sYg8qHNn-YN0e7V-2fUxXn1zifOIuyWVsepxLVshn7UwgDQt1CRmmlZqENRCmir2cyC5Gh6Chs51KzYrbU6CqcGsjziAjKSUlkUaxP0thsfR4g9GYE-9pfGQ-pTkvkdv093uiKm9uTtc6EgxB05bgRB1LFnLNsTJUl9hEVE8zGeDqs3jNxOs1u262KGqW8o3gMqa14",
        simulation: "Software Engineering",
        progress: 85,
        score: 94,
        scoreMax: 100,
        skills: ["React", "TypeScript", "+2"],
        dateJoined: "Oct 24, 2023",
        status: "completed"
    },
    {
        id: 2,
        name: "Robert Fox",
        email: "fox.rob@gmail.com",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2aSlVtjKz8rtjDyzckT2XzLSq14L80pdUDiE5r3ezMOqlZYy1aqaRJBoA5kTAlgK_bR5hOs4dV-DpMqmy2TVrSFRleuoCLHDxtxPyON_-H6oPP0krdPYf6KBH_gi5AgGY1GDDd6p4W9kHci2YdbzJaAkWFKS_5JyNBLRMWNSQgVBqEfuKinieGioxdIqGBxJjBuGFQYVCo1L6u1h3LpirPQBd26GSBGl6oCW2U9T0Cu98K5qzjTCXbfm0KD8in6lcTFMnbeQpzCE",
        simulation: "Software Engineering",
        progress: 100,
        score: 82,
        scoreMax: 100,
        skills: ["Node.js", "SQL"],
        dateJoined: "Oct 26, 2023",
        status: "completed"
    },
    {
        id: 3,
        name: "Arlene Stewart",
        email: "arlene@stewart.io",
        initials: "AS",
        simulation: "Software Engineering",
        progress: 45,
        score: null,
        skills: ["React", "Git"],
        dateJoined: "Nov 01, 2023",
        status: "pending"
    },
    {
        id: 4,
        name: "Cody Fisher",
        email: "cody.fisher@outlook.com",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlqYWzzZSKeTKlbNRAxBEl-ZXaeDLE7qSCbI5dhJGKHWn05PgUzD_HTeEIBacmdwc-xYH_lh4eJ7w99KRiHXstPeLEXU6z1OpxlF84WrKqu5RJKwtuNXM1CPbSiGKdZIIOfKAXqA6L-9mPLlDR_qnPSeQ8oNSyGHPCnMdM4ptsAs6-LNsV60EoS3PF4x_lIpn3SdzWEO4JgW3cSxX4Jh5X7yrqtfcJziGrWedzAEHt8CAoyAfotcgjyK0iiQytYoKItq1zIiO7HB0",
        simulation: "Software Engineering",
        progress: 100,
        score: 92,
        scoreMax: 100,
        skills: ["Algorithms", "Python"],
        dateJoined: "Nov 03, 2023",
        status: "completed"
    }
]

export default function CandidatesTable() {
    return (
        <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-primary/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-[#f7f6f8] dark:bg-[#130d1a]/50 border-b border-primary/5">
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400">Candidate</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400">Simulation</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400">Progress</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">Score</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400">Skills</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400">Date Joined</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400 text-right sticky right-0 bg-[#f7f6f8] dark:bg-[#130d1a] z-10 shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.05)]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                        {candidates.map((candidate) => (
                            <tr key={candidate.id} className="hover:bg-primary/5 transition-colors group">
                                <td className="px-4 md:px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {candidate.avatar ? (
                                            <img
                                                src={candidate.avatar}
                                                alt={candidate.name}
                                                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover ring-2 ring-primary/10"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-400 text-[10px] md:text-xs">
                                                {candidate.initials}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-[13px] md:text-sm font-bold text-[#140d1b] dark:text-white truncate max-w-[120px] md:max-w-none">{candidate.name}</p>
                                            <p className="text-[10px] md:text-[11px] text-slate-500 truncate max-w-[120px] md:max-w-none">{candidate.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-4">
                                    <span className="text-[11px] md:text-xs font-medium text-slate-600 dark:text-slate-300">{candidate.simulation}</span>
                                </td>
                                <td className="px-4 md:px-6 py-4">
                                    <div className="flex items-center gap-2 md:gap-3 min-w-[100px] md:min-w-[120px]">
                                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${candidate.progress < 50 ? 'bg-amber-500' : 'bg-primary'}`}
                                                style={{ width: `${candidate.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-300">{candidate.progress}%</span>
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-4 text-center">
                                    {candidate.status === 'completed' && candidate.score ? (
                                        <span className={`px-2 md:px-2.5 py-1 text-[10px] md:text-xs font-bold rounded-lg shadow-sm ${candidate.score >= 90 ? 'bg-primary text-white' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                            {candidate.score}/100
                                        </span>
                                    ) : (
                                        <span className="px-2 md:px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] md:text-xs font-bold rounded-lg">Pending</span>
                                    )}
                                </td>
                                <td className="px-4 md:px-6 py-4">
                                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                                        {candidate.skills.slice(0, 3).map((skill) => (
                                            <span key={skill} className="text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 bg-primary/5 border border-primary/10 text-primary font-bold rounded">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                    <span className="text-[11px] md:text-xs text-slate-500">{candidate.dateJoined}</span>
                                </td>
                                <td className="px-4 md:px-6 py-4 text-right sticky right-0 bg-white dark:bg-slate-900 group-hover:bg-primary/5 transition-colors z-10 shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.05)]">
                                    <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8 text-slate-400 hover:text-primary transition-colors">
                                            <Download className="size-3.5 md:size-4" />
                                        </Button>
                                        <Button variant="ghost" className="h-7 md:h-8 px-2 md:px-3 py-1 text-[10px] md:text-xs font-bold text-primary bg-primary/10 rounded hover:bg-primary transition-all hover:text-white">
                                            View Profile
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            <div className="px-6 py-4 bg-[#f7f6f8] dark:bg-[#130d1a]/50 flex justify-between items-center border-t border-primary/5">
                <p className="text-xs text-slate-500 font-medium">Showing <span className="text-primary font-bold">1-10</span> of 1,284 candidates</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs font-bold bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed" disabled>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs font-bold bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary transition-all">
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
