import { Database, Calendar, Plus, Copy, RefreshCw, Ban, History, ChevronLeft, ChevronRight } from "lucide-react"

export function AccessCodeTable() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Enterprise Access Codes</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest font-semibold flex items-center gap-1">
                        <Database className="size-3" />
                        High-density management overview
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <select className="text-xs font-semibold border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-1.5 focus:ring-primary outline-none">
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>Expired</option>
                        <option>Revoked</option>
                    </select>
                    <select className="text-xs font-semibold border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-1.5 focus:ring-primary outline-none">
                        <option>All Industries</option>
                        <option>Technology</option>
                        <option>Healthcare</option>
                        <option>Finance</option>
                    </select>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all">
                        <Calendar className="size-3.5" />
                        Date Range
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg hover:opacity-90 transition-all">
                        <Plus className="size-3.5" />
                        Generate New Code
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-3 whitespace-nowrap">Access Code</th>
                            <th className="px-6 py-3 whitespace-nowrap">Organization</th>
                            <th className="px-6 py-3 whitespace-nowrap">Created</th>
                            <th className="px-6 py-3 whitespace-nowrap">Expiry</th>
                            <th className="px-6 py-3 whitespace-nowrap">Redemptions</th>
                            <th className="px-6 py-3 whitespace-nowrap">Status</th>
                            <th className="px-6 py-3 text-right whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {/* Row 1 */}
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">ABC-123-XYZ</span>
                                    <button className="text-slate-400 hover:text-primary transition-colors">
                                        <Copy className="size-4" />
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Quantum Dynamics</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Technology</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">2023-10-15</td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">2024-10-15</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-3/4"></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">1,240</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                    ACTIVE
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-slate-500 hover:bg-primary/10 hover:text-primary rounded transition-all" title="Regenerate">
                                        <RefreshCw className="size-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded transition-all" title="Revoke">
                                        <Ban className="size-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all" title="Audit Log">
                                        <History className="size-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        {/* Row 2 */}
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">HLX-492-WQV</span>
                                    <button className="text-slate-400 hover:text-primary transition-colors">
                                        <Copy className="size-4" />
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Hooli Ltd</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Media</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">2023-11-01</td>
                            <td className="px-6 py-4 text-sm text-amber-600 font-medium">2023-11-15</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 w-1/3"></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">42</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                    <span className="size-1.5 rounded-full bg-amber-500"></span>
                                    EXPIRING
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-slate-500 hover:bg-primary/10 hover:text-primary rounded transition-all" title="Regenerate">
                                        <RefreshCw className="size-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded transition-all" title="Revoke">
                                        <Ban className="size-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all" title="Audit Log">
                                        <History className="size-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        {/* Row 3 */}
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/30 px-2 py-1 rounded text-sm line-through">SKY-009-NET</span>
                                    <button className="text-slate-300 cursor-not-allowed">
                                        <Copy className="size-4" />
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white opacity-60">Cyberdyne Systems</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Manufacturing</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400">2023-01-20</td>
                            <td className="px-6 py-4 text-sm text-slate-400">2023-01-20</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 opacity-50">
                                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-400 w-full"></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">500</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    <span className="size-1.5 rounded-full bg-slate-400"></span>
                                    REVOKED
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-slate-500 hover:bg-primary/10 hover:text-primary rounded transition-all" title="Regenerate">
                                        <RefreshCw className="size-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all" title="Audit Log">
                                        <History className="size-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        {/* Row 4 */}
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">VNT-882-PLM</span>
                                    <button className="text-slate-400 hover:text-primary transition-colors">
                                        <Copy className="size-4" />
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Massive Dynamic</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Research</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">2023-09-12</td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">2024-09-12</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-1/4"></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">2,105</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                    ACTIVE
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-slate-500 hover:bg-primary/10 hover:text-primary rounded transition-all" title="Regenerate">
                                        <RefreshCw className="size-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded transition-all" title="Revoke">
                                        <Ban className="size-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all" title="Audit Log">
                                        <History className="size-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">Showing <span className="text-slate-900 dark:text-white">1 - 4</span> of 842 records</p>
                <div className="flex gap-1">
                    <button className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                        <ChevronLeft className="size-4" />
                    </button>
                    <button className="size-8 flex items-center justify-center rounded bg-primary text-white font-bold text-xs">1</button>
                    <button className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs">2</button>
                    <button className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs">3</button>
                    <button className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
