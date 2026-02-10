"use client"

import { useState } from "react"
import Link from "next/link"
import { Filter, Download, ChevronLeft, ChevronRight, Building2, HardHat, ShieldCheck, ShoppingBag, Stethoscope, Users, Link as LinkIcon, Key, XCircle, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function OrgTable({ data = [] }: { data: any[] }) {
    const [activeTab, setActiveTab] = useState<"pending" | "active" | "rejected">("pending")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Filter logic
    const filteredData = data.filter(item => {
        if (activeTab === "pending") {
            return item.status !== "approved" && item.status !== "rejected"
        }
        if (activeTab === "active") {
            return item.status === "approved" || item.status === "contacted"
        }
        if (activeTab === "rejected") {
            return item.status === "rejected"
        }
        return true
    })

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1
    const pagedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending':
                return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 border-amber-200 dark:border-amber-800"
            case 'reviewed':
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500 border-blue-200 dark:border-blue-800"
            case 'clarification_requested':
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-500 border-purple-200 dark:border-purple-800"
            case 'approved':
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500 border-emerald-200 dark:border-emerald-800"
            case 'rejected':
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500 border-red-200 dark:border-red-800"
            case 'contacted':
                return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-500 border-indigo-200 dark:border-indigo-800"
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-500 border-slate-200 dark:border-slate-800"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'New Request'
            case 'reviewed': return 'In Review'
            case 'clarification_requested': return 'Awaiting Info'
            case 'approved': return 'Verified'
            case 'rejected': return 'Rejected'
            case 'contacted': return 'Contacted'
            default: return status
        }
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-8 overflow-x-auto">
                        <button
                            onClick={() => { setActiveTab("pending"); setCurrentPage(1); }}
                            className={cn(
                                "py-4 text-sm font-bold transition-all relative whitespace-nowrap",
                                activeTab === "pending" ? "text-primary border-b-2 border-primary" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            )}
                        >
                            Pending Requests
                            <span className="ml-2 px-1.5 py-0.5 bg-primary/10 text-[10px] rounded-md">
                                {data.filter(item => item.status !== "approved" && item.status !== "rejected").length}
                            </span>
                        </button>
                        <button
                            onClick={() => { setActiveTab("active"); setCurrentPage(1); }}
                            className={cn(
                                "py-4 text-sm font-bold transition-all relative whitespace-nowrap",
                                activeTab === "active" ? "text-primary border-b-2 border-primary" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            )}
                        >
                            Active Organizations
                            <span className="ml-2 px-1.5 py-0.5 bg-primary/10 text-[10px] rounded-md text-primary">
                                {data.filter(item => item.status === "approved" || item.status === "contacted").length}
                            </span>
                        </button>
                        <button
                            onClick={() => { setActiveTab("rejected"); setCurrentPage(1); }}
                            className={cn(
                                "py-4 text-sm font-bold transition-all relative whitespace-nowrap",
                                activeTab === "rejected" ? "text-primary border-b-2 border-primary" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            )}
                        >
                            Rejected Organizations
                            <span className="ml-2 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded-md text-slate-500">
                                {data.filter(item => item.status === "rejected").length}
                            </span>
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
                        {pagedData.length > 0 ? (
                            pagedData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                                                <Building2 className="text-slate-400 size-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white text-sm">{item.company_name}</span>
                                                <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline cursor-pointer">
                                                    {item.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Enterprise Portal</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.admin_name}</span>
                                                {item.admin_linkedin && (
                                                    <a className="text-blue-500 hover:text-blue-600" href={item.admin_linkedin} target="_blank" rel="noopener noreferrer">
                                                        <LinkIcon className="size-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                            <span className="text-xs text-slate-500">{item.admin_title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                                <Stethoscope className="size-3.5" />
                                                {item.industry}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                                <Users className="size-3.5" />
                                                {item.company_size}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                            getStatusStyle(item.status)
                                        )}>
                                            <span className={cn(
                                                "size-1.5 rounded-full",
                                                item.status === 'pending' ? "bg-amber-500" :
                                                    item.status === 'reviewed' ? "bg-blue-500" :
                                                        item.status === 'clarification_requested' ? "bg-purple-500" :
                                                            item.status === 'approved' ? "bg-emerald-500" :
                                                                item.status === 'rejected' ? "bg-red-500" :
                                                                    "bg-indigo-500"
                                            )}></span>
                                            {getStatusLabel(item.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/enterprise-requests/${item.id}`}>
                                                <button className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-all">View Details</button>
                                            </Link>
                                            {activeTab === "pending" && (
                                                <Link href={`/admin/enterprise-requests/${item.id}`}>
                                                    <button className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1">
                                                        <Key className="size-3" />
                                                        Process
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <HelpCircle className="size-8 text-slate-300" />
                                        <p className="font-medium">No organizations found in this category.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">Showing <span className="text-slate-900 dark:text-white font-bold">{(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of {filteredData.length} applications</p>
                <div className="flex gap-1">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                                "size-8 flex items-center justify-center rounded font-bold text-xs transition-all",
                                currentPage === page ? "bg-primary text-white" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
