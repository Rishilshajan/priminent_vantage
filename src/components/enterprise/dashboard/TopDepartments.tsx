"use client"

interface Department {
    name: string;
    code: string;
    score: number;
    color: string;
}

interface TopDepartmentsProps {
    departments: Department[];
}

export default function TopDepartments({ departments }: TopDepartmentsProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-5">Top Departments</h3>
            <div className="space-y-5">
                {departments.map((dept) => (
                    <div key={dept.code} className="flex items-center gap-4 group cursor-default">
                        <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[11px] font-black text-primary border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                            {dept.code}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{dept.name}</span>
                                <span className="text-[11px] font-black text-primary">{dept.score}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${dept.color === "green" ? "bg-green-500" : "bg-primary"
                                        }`}
                                    style={{ width: `${dept.score}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
