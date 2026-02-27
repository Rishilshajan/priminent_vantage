import { MoreVertical } from "lucide-react"

export function EngagementTable({ data }: { data: any[] }) {
    return (
        <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-[#382a4a] flex items-center justify-between">
                <h3 className="font-bold text-[#140d1b] dark:text-white">Enterprise Engagement Details</h3>
                <div className="flex gap-2">
                    <button className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded hover:bg-primary/20 transition-colors">View All</button>
                </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-[#2d1e3d] text-[#734c9a] dark:text-[#a682cc] text-xs font-bold uppercase">
                            <th className="px-6 py-4">Company Name</th>
                            <th className="px-6 py-4">Active Sims</th>
                            <th className="px-6 py-4">Enrollments</th>
                            <th className="px-6 py-4">Enrollment Rate</th>
                            <th className="px-6 py-4">Completion %</th>
                            <th className="px-6 py-4">Health Score</th>
                            <th className="px-6 py-4">Last Active</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#3a2a4d]">
                        {data.length > 0 ? data.map((org) => {
                            const initials = org.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                            const lastActive = org.lastActive === 'Never' ? 'Never' : new Date(org.lastActive).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

                            return (
                                <tr key={org.id} className="hover:bg-slate-50 dark:hover:bg-[#2d1e3d] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {initials}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#140d1b] dark:text-white">{org.name}</p>
                                                <p className="text-xs text-[#734c9a] dark:text-[#a682cc]">{org.domain || 'no domain'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-[#140d1b] dark:text-white">{org.activeSims}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-[#140d1b] dark:text-white">
                                        {org.enrollments.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">Students</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                                            {org.enrollmentRate}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-slate-200 dark:bg-[#3a2a4d] rounded-full h-1.5 w-24 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${org.completionRate > 70 ? 'bg-emerald-500' : org.completionRate > 40 ? 'bg-primary' : 'bg-rose-500'}`}
                                                    style={{ width: `${org.completionRate}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-[#140d1b] dark:text-white">{org.completionRate}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${org.health === 'Stable'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : org.health === 'Moderate'
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {org.health}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc] whitespace-nowrap">
                                        {new Date(org.lastActive).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[#734c9a] dark:text-[#a682cc] hover:text-primary dark:hover:text-white transition-colors">
                                            <MoreVertical className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                                    No organization data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
