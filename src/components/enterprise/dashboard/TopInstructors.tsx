"use client"

interface Instructor {
    id: string;
    name: string;
    role: string;
    score: number;
    initials: string;
    avatar?: string;
}

interface TopInstructorsProps {
    instructors: Instructor[];
}

export default function TopInstructors({ instructors }: TopInstructorsProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-5">Top Instructors</h3>
            <div className="space-y-5">
                {instructors.map((instructor) => (
                    <div key={instructor.id} className="flex items-center gap-4 group cursor-default">
                        <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[11px] font-black text-primary border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform overflow-hidden relative">
                            {instructor.avatar ? (
                                <img src={instructor.avatar} alt={instructor.name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{instructor.initials}</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1.5">
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-900 dark:text-white leading-none mb-0.5">{instructor.name}</span>
                                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">{instructor.role}</span>
                                </div>
                                <span className="text-[11px] font-black text-primary">{instructor.score}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-1000"
                                    style={{ width: `${instructor.score}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
