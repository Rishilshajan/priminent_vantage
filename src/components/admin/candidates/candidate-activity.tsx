import { MoreHorizontal, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface CandidateActivityProps {
    activities: {
        id: string;
        candidate: {
            name: string;
            email: string;
            avatar?: string;
        };
        lastAction: string;
        status: string;
        organization: string;
        date: string;
    }[];
    isLoading?: boolean;
}

export function CandidateActivity({ activities, isLoading }: CandidateActivityProps) {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] overflow-hidden animate-pulse">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-[#382a4a]">
                    <div className="h-5 w-40 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
                <div className="p-0">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="px-6 py-4 flex items-center justify-between border-b border-slate-50 dark:border-[#2d2238]">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                                    <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
                                </div>
                            </div>
                            <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded hidden md:block" />
                            <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-[#382a4a] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h4 className="text-base font-bold text-[#140d1b] dark:text-white">Recent Candidate Activity</h4>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#734c9a] dark:text-[#a682cc]">
                        <span className="size-2 rounded-full bg-green-500"></span> Completed
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-[#734c9a] dark:text-[#a682cc]">
                        <span className="size-2 rounded-full bg-blue-500"></span> In-Progress
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-[#734c9a] dark:text-[#a682cc]">
                        <span className="size-2 rounded-full bg-primary"></span> Enrolled
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                    <thead className="bg-slate-50 dark:bg-[#2d2238] border-b border-slate-200 dark:border-[#382a4a]">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-[#734c9a] dark:text-[#a682cc] uppercase tracking-wider">Candidate</th>
                            <th className="px-6 py-3 text-xs font-bold text-[#734c9a] dark:text-[#a682cc] uppercase tracking-wider">Last Action</th>
                            <th className="px-6 py-3 text-xs font-bold text-[#734c9a] dark:text-[#a682cc] uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-xs font-bold text-[#734c9a] dark:text-[#a682cc] uppercase tracking-wider">Organization</th>
                            <th className="px-6 py-3 text-xs font-bold text-[#734c9a] dark:text-[#a682cc] uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-xs font-bold text-[#734c9a] dark:text-[#a682cc] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#382a4a]">
                        {activities.length > 0 ? activities.map((item) => (
                            <tr key={item.id} className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold overflow-hidden">
                                            {item.candidate.avatar ? (
                                                <img src={item.candidate.avatar} alt="" className="size-full object-cover" />
                                            ) : (
                                                <User className="size-4" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#140d1b] dark:text-white">{item.candidate.name}</p>
                                            <p className="text-[10px] text-[#734c9a] dark:text-[#a682cc]">{item.candidate.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#140d1b] dark:text-white font-medium">{item.lastAction}</td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                                        item.status === "Completed" ? "bg-green-100 dark:bg-green-900/30 text-green-600" :
                                            item.status === "In-Progress" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" :
                                                "bg-primary/10 text-primary"
                                    )}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">{item.organization}</td>
                                <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">{item.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-1 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                        <MoreHorizontal className="size-5" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-[#734c9a] dark:text-[#a682cc]">No candidate activity found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-[#382a4a] flex items-center justify-between">
                <span className="text-xs text-[#734c9a] dark:text-[#a682cc]">Showing {activities.length} results</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-slate-200 dark:border-[#382a4a] rounded-lg text-xs font-bold text-[#734c9a] dark:text-[#a682cc] hover:bg-slate-50 dark:hover:bg-[#2d2238]">Previous</button>
                    <button className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90">Next</button>
                </div>
            </div>
        </div>
    )
}
