"use client"

import { Button } from "@/components/ui/button"

interface Program {
    id: number;
    name: string;
    department: string;
    status: string;
    duration: string;
    enrolled: string;
    rate: number;
    color: string;
}

interface ActiveProgramsProps {
    programs: Program[];
}

export default function ActivePrograms({ programs }: ActiveProgramsProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Programs</h3>
                <Button variant="link" asChild className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest p-0 h-auto">
                    <a href="/enterprise/simulations">View All</a>
                </Button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {programs.map((program) => (
                    <div key={program.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-center mb-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest border ${program.status === "STABLE" ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-900/30" :
                                program.status === "SCALING" ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-900/30" :
                                    "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-900/30"
                                }`}>
                                {program.status}
                            </span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active: {program.duration}</span>
                        </div>
                        <h4 className="font-black text-sm mb-0.5 text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">{program.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Dept: {program.department}</p>

                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                            <span className="text-slate-500">{program.enrolled} Enrolled</span>
                            <span className={program.rate < 50 ? "text-red-500" : "text-primary"}>{program.rate}% Rate</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${program.rate < 40 ? "bg-red-500" : "bg-primary"
                                    }`}
                                style={{ width: `${program.rate}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
