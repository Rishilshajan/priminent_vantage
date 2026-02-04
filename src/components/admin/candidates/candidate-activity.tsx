import { MoreVertical } from "lucide-react"

export function CandidateActivity() {
    return (
        <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm overflow-hidden flex flex-col">
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
                        <tr className="hover:bg-primary/5 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">AD</div>
                                    <div>
                                        <p className="text-sm font-bold text-[#140d1b] dark:text-white">Alexandre Dubois</p>
                                        <p className="text-[10px] text-[#734c9a] dark:text-[#a682cc]">a.dubois@university.edu</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#140d1b] dark:text-white font-medium">Joined Goldman Sachs Simulation</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">Enrolled</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">LSE - Campus Access</td>
                            <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">Oct 28, 2023</td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-1 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                    <MoreVertical className="size-5" />
                                </button>
                            </td>
                        </tr>
                        <tr className="hover:bg-primary/5 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">SK</div>
                                    <div>
                                        <p className="text-sm font-bold text-[#140d1b] dark:text-white">Sarah Kovic</p>
                                        <p className="text-[10px] text-[#734c9a] dark:text-[#a682cc]">skovic@techcorp.com</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#140d1b] dark:text-white font-medium">In-Progress: McKinsey Lead</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 uppercase">In-Progress</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">Global Talent Inc.</td>
                            <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">Oct 27, 2023</td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-1 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                    <MoreVertical className="size-5" />
                                </button>
                            </td>
                        </tr>
                        <tr className="hover:bg-primary/5 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">MR</div>
                                    <div>
                                        <p className="text-sm font-bold text-[#140d1b] dark:text-white">Marcus Reed</p>
                                        <p className="text-[10px] text-[#734c9a] dark:text-[#a682cc]">marcus.reed@email.com</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#140d1b] dark:text-white font-medium">Completed: UX Sprint Simulation</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-600 uppercase">Completed</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">Individual Access</td>
                            <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">Oct 26, 2023</td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-1 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                    <MoreVertical className="size-5" />
                                </button>
                            </td>
                        </tr>
                        <tr className="hover:bg-primary/5 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">JL</div>
                                    <div>
                                        <p className="text-sm font-bold text-[#140d1b] dark:text-white">Jenny Lee</p>
                                        <p className="text-[10px] text-[#734c9a] dark:text-[#a682cc]">j.lee99@college.edu</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#140d1b] dark:text-white font-medium">Joined Goldman Sachs Simulation</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">Enrolled</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">LSE - Campus Access</td>
                            <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">Oct 25, 2023</td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-1 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                    <MoreVertical className="size-5" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-[#382a4a] flex items-center justify-between">
                <span className="text-xs text-[#734c9a] dark:text-[#a682cc]">Showing 4 of 12,450 results</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-slate-200 dark:border-[#382a4a] rounded-lg text-xs font-bold text-[#734c9a] dark:text-[#a682cc] hover:bg-slate-50 dark:hover:bg-[#2d2238]">Previous</button>
                    <button className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90">Next</button>
                </div>
            </div>
        </div>
    )
}
