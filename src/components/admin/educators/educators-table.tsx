import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react"

export function EducatorsTable() {
    return (
        <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm mb-8 overflow-hidden">

            {/* Note: Filters were in a separate component in design, but HTML had them merged or close. 
                 The user requested modularity, so we have a separate Filters component. 
                 This table component will just handle the table part. */}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead className="bg-slate-50 dark:bg-[#2d1e3d] text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Educator & Institution</th>
                            <th className="px-6 py-4">Simulation / Course</th>
                            <th className="px-6 py-4">Groups</th>
                            <th className="px-6 py-4">Students</th>
                            <th className="px-6 py-4">Last Login</th>
                            <th className="px-6 py-4">Access Code</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#382a4a]">
                        <tr className="hover:bg-slate-50 dark:hover:bg-[#2d1e3d] transition-colors cursor-pointer group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-slate-200 dark:bg-white/10 flex-shrink-0 bg-cover bg-center overflow-hidden">
                                        {/* Mock Avatar */}
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs">SJ</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">Dr. Sarah Jenkins</span>
                                        <span className="text-xs text-slate-500">Harvard University</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-slate-600 dark:text-slate-300">Market Leader Pro</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-medium text-[#140d1b] dark:text-white">12</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-medium text-[#140d1b] dark:text-white">342</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-slate-500">2 hours ago</span>
                            </td>
                            <td className="px-6 py-4">
                                <code className="text-xs bg-slate-100 dark:bg-white/10 px-2 py-1 rounded font-mono text-primary font-bold">HVD-2024-XJ</code>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-primary transition-colors">
                                    <MoreVertical className="size-4" />
                                </button>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-[#2d1e3d] transition-colors cursor-pointer group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-slate-200 dark:bg-white/10 flex-shrink-0 bg-cover bg-center overflow-hidden">
                                        {/* Mock Avatar */}
                                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xs">MC</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">Prof. Marcus Chen</span>
                                        <span className="text-xs text-slate-500">Stanford Graduate School</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-slate-600 dark:text-slate-300">Financial Analyst v2</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-medium text-[#140d1b] dark:text-white">8</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-medium text-[#140d1b] dark:text-white">156</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-slate-500">1 day ago</span>
                            </td>
                            <td className="px-6 py-4">
                                <code className="text-xs bg-slate-100 dark:bg-white/10 px-2 py-1 rounded font-mono text-primary font-bold">STAN-FIN-99</code>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-primary transition-colors">
                                    <MoreVertical className="size-4" />
                                </button>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-[#2d1e3d] transition-colors cursor-pointer group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-slate-200 dark:bg-white/10 flex-shrink-0 bg-cover bg-center overflow-hidden">
                                        {/* Mock Avatar */}
                                        <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-600 font-bold text-xs">ER</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">Elena Rodriguez</span>
                                        <span className="text-xs text-slate-500">ESADE Business School</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-slate-600 dark:text-slate-300">Supply Chain Ops</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-medium text-[#140d1b] dark:text-white">4</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-medium text-[#140d1b] dark:text-white">88</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-slate-500">3 days ago</span>
                            </td>
                            <td className="px-6 py-4">
                                <code className="text-xs bg-slate-100 dark:bg-white/10 px-2 py-1 rounded font-mono text-primary font-bold">ESD-SUPP-01</code>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-primary transition-colors">
                                    <MoreVertical className="size-4" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-[#382a4a] flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Showing 1-15 of 1,240 Educators</span>
                <div className="flex items-center gap-1">
                    <button className="p-1 border border-slate-200 dark:border-[#382a4a] rounded hover:bg-slate-100 dark:hover:bg-[#2d1e3d] disabled:opacity-50 text-slate-500" disabled>
                        <ChevronLeft className="size-4" />
                    </button>
                    <button className="size-8 flex items-center justify-center bg-primary text-white text-xs font-bold rounded">1</button>
                    <button className="size-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-[#2d1e3d] text-xs font-bold rounded text-slate-600 dark:text-slate-400">2</button>
                    <button className="size-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-[#2d1e3d] text-xs font-bold rounded text-slate-600 dark:text-slate-400">3</button>
                    <span className="px-1 text-slate-400">...</span>
                    <button className="size-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-[#2d1e3d] text-xs font-bold rounded text-slate-600 dark:text-slate-400">83</button>
                    <button className="p-1 border border-slate-200 dark:border-[#382a4a] rounded hover:bg-slate-100 dark:hover:bg-[#2d1e3d] text-slate-500">
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
