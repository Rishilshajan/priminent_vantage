import { Filter, Download, ChevronLeft, ChevronRight, Building2, HardHat, ShieldCheck, ShoppingBag, Stethoscope, Users, Link as LinkIcon, Key, XCircle } from "lucide-react"

export function OrgTable() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-8 overflow-x-auto">
                        <button className="py-4 text-sm font-bold text-primary border-b-2 border-primary relative whitespace-nowrap">
                            Pending Requests
                            <span className="ml-2 px-1.5 py-0.5 bg-primary/10 text-[10px] rounded-md">24</span>
                        </button>
                        <button className="py-4 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors whitespace-nowrap">
                            Active Organizations
                        </button>
                        <button className="py-4 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors whitespace-nowrap">
                            Archive
                        </button>
                    </div>
                    <div className="flex items-center gap-3 pb-4 md:pb-0">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all bg-white dark:bg-slate-900">
                            <Filter className="size-3.5" />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all bg-white dark:bg-slate-900">
                            <Download className="size-3.5" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 whitespace-nowrap">Organization</th>
                            <th className="px-6 py-4 whitespace-nowrap">Lead Source</th>
                            <th className="px-6 py-4 whitespace-nowrap">Applicant Details</th>
                            <th className="px-6 py-4 whitespace-nowrap">Company Metrics</th>
                            <th className="px-6 py-4 whitespace-nowrap">Status</th>
                            <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {/* Row 1 */}
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                                        <Building2 className="text-slate-400 size-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">Nexus Health Solutions</span>
                                        <span className="text-xs text-primary hover:underline cursor-pointer">nexushealth.io</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Request Access Form</span>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Sarah Jenkins</span>
                                        <a className="text-blue-500 hover:text-blue-600" href="#"><LinkIcon className="size-3.5" /></a>
                                    </div>
                                    <span className="text-xs text-slate-500">Director of Operations</span>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                        <Stethoscope className="size-3.5" />
                                        Healthcare
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                        <Users className="size-3.5" />
                                        501 - 1,000
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 border border-amber-200 dark:border-amber-800">
                                    <span className="size-1.5 rounded-full bg-amber-500"></span>
                                    In Review
                                </span>
                            </td>
                            <td className="px-6 py-5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-all">View Details</button>
                                    <button className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1">
                                        <Key className="size-3" />
                                        Approve & Code
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                        <XCircle className="size-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        {/* Row 2 */}
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                                        <HardHat className="text-slate-400 size-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">Ironwood Infrastructure</span>
                                        <span className="text-xs text-primary hover:underline cursor-pointer">ironwood.build</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Direct Referral</span>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Michael Vane</span>
                                        <a className="text-blue-500 hover:text-blue-600" href="#"><LinkIcon className="size-3.5" /></a>
                                    </div>
                                    <span className="text-xs text-slate-500">Chief Executive Officer</span>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                        <HardHat className="size-3.5" />
                                        Construction
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                        <Users className="size-3.5" />
                                        2,500+
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500 border border-blue-200 dark:border-blue-800">
                                    <span className="size-1.5 rounded-full bg-blue-500"></span>
                                    Awaiting Verification
                                </span>
                            </td>
                            <td className="px-6 py-5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-all">View Details</button>
                                    <button className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1">
                                        <Key className="size-3" />
                                        Approve & Code
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                        <XCircle className="size-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        {/* Row 3 */}
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                                        <ShieldCheck className="text-slate-400 size-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">Velocity Cybersecurity</span>
                                        <span className="text-xs text-primary hover:underline cursor-pointer">velocity-sec.com</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Enterprise Portal</span>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Arjun Mehta</span>
                                        <a className="text-blue-500 hover:text-blue-600" href="#"><LinkIcon className="size-3.5" /></a>
                                    </div>
                                    <span className="text-xs text-slate-500">Security Architect</span>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                        <ShieldCheck className="size-3.5" />
                                        Technology
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                        <Users className="size-3.5" />
                                        50 - 200
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 border border-amber-200 dark:border-amber-800">
                                    <span className="size-1.5 rounded-full bg-amber-500"></span>
                                    In Review
                                </span>
                            </td>
                            <td className="px-6 py-5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-all">View Details</button>
                                    <button className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1">
                                        <Key className="size-3" />
                                        Approve & Code
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                        <XCircle className="size-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        {/* Row 4 */}
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                                        <ShoppingBag className="text-slate-400 size-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">Terra Retail Group</span>
                                        <span className="text-xs text-primary hover:underline cursor-pointer">terra-retail.com</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Request Access Form</span>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Eliza Grant</span>
                                        <a className="text-blue-500 hover:text-blue-600" href="#"><LinkIcon className="size-3.5" /></a>
                                    </div>
                                    <span className="text-xs text-slate-500">VP Marketing</span>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                        <ShoppingBag className="size-3.5" />
                                        Retail
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                        <Users className="size-3.5" />
                                        1,000 - 2,500
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 border border-amber-200 dark:border-amber-800">
                                    <span className="size-1.5 rounded-full bg-amber-500"></span>
                                    In Review
                                </span>
                            </td>
                            <td className="px-6 py-5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-all">View Details</button>
                                    <button className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1">
                                        <Key className="size-3" />
                                        Approve & Code
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                        <XCircle className="size-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">Showing <span className="text-slate-900 dark:text-white font-bold">1 to 4</span> of 24 applications</p>
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
