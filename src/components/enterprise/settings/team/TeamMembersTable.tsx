"use client"

import { Search, Filter, Settings, ArrowRight, Info } from "lucide-react"

export default function TeamMembersTable({ onManagePermissions }: { onManagePermissions: () => void }) {
    return (
        <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">Team Members</h3>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                        <input
                            className="pl-9 pr-4 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-xs w-full sm:w-64 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                            placeholder="Search members..."
                            type="text"
                        />
                    </div>
                    <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Filter className="size-4" />
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Name</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Assigned Role</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Last Active</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {/* Row 1 */}
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">JS</div>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">Jordan Smith</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">j.smith@prominentvantage.com</td>
                                <td className="px-6 py-4">
                                    <select className="text-xs font-semibold bg-[#f3effb] dark:bg-primary/20 border-none text-primary rounded-lg py-1 pl-2 pr-8 focus:ring-1 focus:ring-primary appearance-none cursor-pointer outline-none">
                                        <option>Admin</option>
                                        <option>Content Creator</option>
                                        <option>Analyst</option>
                                        <option>Recruiter</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-green-500"></span>
                                        <span className="text-xs font-medium text-slate-900 dark:text-white">Active now</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={onManagePermissions}
                                        className="text-primary hover:underline text-xs font-bold flex items-center gap-1 justify-end ml-auto"
                                    >
                                        <Settings className="size-3" />
                                        Manage Permissions
                                    </button>
                                </td>
                            </tr>
                            {/* Row 2 */}
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">SM</div>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">Sarah Miller</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">s.miller@prominentvantage.com</td>
                                <td className="px-6 py-4">
                                    <select className="text-xs font-semibold bg-[#f3effb] dark:bg-primary/20 border-none text-primary rounded-lg py-1 pl-2 pr-8 focus:ring-1 focus:ring-primary appearance-none cursor-pointer outline-none" defaultValue="Content Creator">
                                        <option>Admin</option>
                                        <option>Content Creator</option>
                                        <option>Analyst</option>
                                        <option>Recruiter</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-slate-200 dark:bg-slate-600"></span>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">2 hours ago</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={onManagePermissions}
                                        className="text-primary hover:underline text-xs font-bold flex items-center gap-1 justify-end ml-auto"
                                    >
                                        <Settings className="size-3" />
                                        Manage Permissions
                                    </button>
                                </td>
                            </tr>
                            {/* Row 3 */}
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">MT</div>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">Marcus Thorne</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">m.thorne@vantage-labs.io</td>
                                <td className="px-6 py-4">
                                    <select className="text-xs font-semibold bg-[#f3effb] dark:bg-primary/20 border-none text-primary rounded-lg py-1 pl-2 pr-8 focus:ring-1 focus:ring-primary appearance-none cursor-pointer outline-none" defaultValue="Analyst">
                                        <option>Admin</option>
                                        <option>Content Creator</option>
                                        <option>Analyst</option>
                                        <option>Recruiter</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-slate-200 dark:bg-slate-600"></span>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Yesterday</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={onManagePermissions}
                                        className="text-primary hover:underline text-xs font-bold flex items-center gap-1 justify-end ml-auto"
                                    >
                                        <Settings className="size-3" />
                                        Manage Permissions
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[12px]">
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic flex items-center gap-2">
                        <Info className="size-4" />
                        Last updated by <span className="text-slate-900 dark:text-white font-bold">Alex Chen</span> • Oct 24, 2023 at 2:14 PM
                    </p>
                    <a className="text-primary font-bold hover:text-primary/80 flex items-center gap-1" href="#">
                        View Audit Log
                        <ArrowRight className="size-3" />
                    </a>
                </div>
            </div>
        </section>
    )
}
