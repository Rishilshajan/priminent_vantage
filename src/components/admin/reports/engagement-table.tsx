import { MoreVertical } from "lucide-react"

export function EngagementTable() {
    return (
        <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-[#382a4a] flex items-center justify-between">
                <h3 className="font-bold text-[#140d1b] dark:text-white">Enterprise Engagement Details</h3>
                <div className="flex gap-2">
                    <button className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded hover:bg-primary/20 transition-colors">View All</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-[#2d1e3d] text-[#734c9a] dark:text-[#a682cc] text-xs font-bold uppercase">
                            <th className="px-6 py-4">Company Name</th>
                            <th className="px-6 py-4">Active Sims</th>
                            <th className="px-6 py-4">Enrollments</th>
                            <th className="px-6 py-4">Completion %</th>
                            <th className="px-6 py-4">Health Score</th>
                            <th className="px-6 py-4">Last Active</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#3a2a4d]">
                        <tr className="hover:bg-slate-50 dark:hover:bg-[#2d1e3d] transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded bg-[#8013ec]/10 flex items-center justify-center text-primary font-bold text-sm">NV</div>
                                    <div>
                                        <p className="text-sm font-bold text-[#140d1b] dark:text-white">Nvidia Corp</p>
                                        <p className="text-xs text-[#734c9a] dark:text-[#a682cc]">nvidia.com</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-[#140d1b] dark:text-white">42</td>
                            <td className="px-6 py-4 text-sm font-medium text-[#140d1b] dark:text-white">8,420</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-slate-200 dark:bg-[#3a2a4d] rounded-full h-1.5 w-24 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: "88%" }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-[#140d1b] dark:text-white">88%</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Stable</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">Today, 14:20</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-[#734c9a] dark:text-[#a682cc] hover:text-primary dark:hover:text-white transition-colors">
                                    <MoreVertical className="size-4" />
                                </button>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-[#2d1e3d] transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">GS</div>
                                    <div>
                                        <p className="text-sm font-bold text-[#140d1b] dark:text-white">Goldman Sachs</p>
                                        <p className="text-xs text-[#734c9a] dark:text-[#a682cc]">gs.com</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-[#140d1b] dark:text-white">18</td>
                            <td className="px-6 py-4 text-sm font-medium text-[#140d1b] dark:text-white">3,150</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-slate-200 dark:bg-[#3a2a4d] rounded-full h-1.5 w-24 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: "45%" }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-[#140d1b] dark:text-white">45%</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Moderate</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">Oct 22, 2023</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-[#734c9a] dark:text-[#a682cc] hover:text-primary dark:hover:text-white transition-colors">
                                    <MoreVertical className="size-4" />
                                </button>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-[#2d1e3d] transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">AZ</div>
                                    <div>
                                        <p className="text-sm font-bold text-[#140d1b] dark:text-white">Amazon Inc</p>
                                        <p className="text-xs text-[#734c9a] dark:text-[#a682cc]">amazon.jobs</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-[#140d1b] dark:text-white">56</td>
                            <td className="px-6 py-4 text-sm font-medium text-[#140d1b] dark:text-white">12,890</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-slate-200 dark:bg-[#3a2a4d] rounded-full h-1.5 w-24 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: "72%" }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-[#140d1b] dark:text-white">72%</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Stable</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">Today, 11:05</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-[#734c9a] dark:text-[#a682cc] hover:text-primary dark:hover:text-white transition-colors">
                                    <MoreVertical className="size-4" />
                                </button>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-[#2d1e3d] transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">HS</div>
                                    <div>
                                        <p className="text-sm font-bold text-[#140d1b] dark:text-white">HealthSouth</p>
                                        <p className="text-xs text-[#734c9a] dark:text-[#a682cc]">h-south.org</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-[#140d1b] dark:text-white">5</td>
                            <td className="px-6 py-4 text-sm font-medium text-[#140d1b] dark:text-white">420</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-slate-200 dark:bg-[#3a2a4d] rounded-full h-1.5 w-24 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: "12%" }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-[#140d1b] dark:text-white">12%</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">At Risk</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#734c9a] dark:text-[#a682cc]">Oct 15, 2023</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-[#734c9a] dark:text-[#a682cc] hover:text-primary dark:hover:text-white transition-colors">
                                    <MoreVertical className="size-4" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
