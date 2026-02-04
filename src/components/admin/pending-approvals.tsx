import { Wand2, Filter, Download, ChevronLeft, ChevronRight, Check } from "lucide-react"

export function PendingApprovals() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-4 py-4 md:px-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Pending Enterprise Applications</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest font-semibold flex items-center gap-1">
                        <Wand2 className="size-3" />
                        Approval generates unique 9-digit alphanumeric access code
                    </p>
                </div>
                <div className="flex gap-2 self-start md:self-auto">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all">
                        <Filter className="size-3.5" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all">
                        <Download className="size-3.5" />
                        Export
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Legal Entity Name</th>
                            <th className="px-6 py-4">Website</th>
                            <th className="px-6 py-4">Contact Person</th>
                            <th className="px-6 py-4">Date Submitted</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {/* Example Row 1 */}
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-5 font-medium text-slate-900 dark:text-white">Acme Corp</td>
                            <td className="px-6 py-5 text-sm text-primary hover:underline cursor-pointer">acme.com</td>
                            <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">John Doe</td>
                            <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">2023-10-24</td>
                            <td className="px-6 py-5 text-right space-x-2">
                                <button className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all">View</button>
                                <button className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded shadow-sm hover:opacity-90 transition-all group-hover:ring-2 ring-primary/20 relative">
                                    Approve
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                </button>
                                <button className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">Reject</button>
                            </td>
                        </tr>
                        {/* Example Row 2 */}
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-5 font-medium text-slate-900 dark:text-white">Globex Inc</td>
                            <td className="px-6 py-5 text-sm text-primary hover:underline cursor-pointer">globex.org</td>
                            <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">Alice Smith</td>
                            <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">2023-10-23</td>
                            <td className="px-6 py-5 text-right space-x-2">
                                <button className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all">View</button>
                                <button className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded shadow-sm hover:opacity-90 transition-all group-hover:ring-2 ring-primary/20 relative">Approve</button>
                                <button className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">Reject</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">Showing 1 to 2 of 24 applications</p>
                <div className="flex gap-1">
                    <button className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 cursor-pointer">
                        <ChevronLeft className="size-4" />
                    </button>
                    <button className="size-8 flex items-center justify-center rounded bg-primary text-white font-bold text-xs">1</button>
                    <button className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 text-xs">2</button>
                    <button className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 cursor-pointer">
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
