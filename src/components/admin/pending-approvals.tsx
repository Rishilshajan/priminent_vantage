import { Wand2, Filter, Download, ChevronLeft, ChevronRight, School, Building2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { formatDate, cn } from "@/lib/utils"

interface PendingApplication {
    id: string;
    entityName: string;
    website: string;
    contactName: string;
    createdAt: string;
    type: 'enterprise' | 'educator';
}

interface PendingApprovalsProps {
    applications: PendingApplication[];
}

export function PendingApprovals({ applications }: PendingApprovalsProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(applications.length / itemsPerPage);
    const pagedApplications = applications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-4 py-4 md:px-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Pending Applications</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest font-semibold flex items-center gap-1">
                        <Wand2 className="size-3" />
                        Consolidated review queue for all intake channels
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
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Organization / Institution</th>
                            <th className="px-6 py-4">Contact Person</th>
                            <th className="px-6 py-4">Date Submitted</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {pagedApplications.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    No pending applications found.
                                </td>
                            </tr>
                        ) : (
                            pagedApplications.map((app) => (
                                <tr key={`${app.type}-${app.id}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight",
                                            app.type === 'educator'
                                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                        )}>
                                            {app.type === 'educator' ? <School className="size-3" /> : <Building2 className="size-3" />}
                                            {app.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900 dark:text-white capitalize">{app.entityName}</span>
                                            <span className="text-[10px] text-primary transition-all cursor-pointer truncate max-w-[200px]">
                                                {app.website ? (
                                                    <a href={app.website} target="_blank" rel="noopener noreferrer" className="hover:underline italic">
                                                        {app.website.replace(/^https?:\/\//, '')}
                                                    </a>
                                                ) : 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">{app.contactName}</td>
                                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">{formatDate(app.createdAt)}</td>
                                    <td className="px-6 py-5 text-right space-x-2">
                                        <Link href={app.type === 'educator' ? `/admin/educators/applications/${app.id}` : `/admin/enterprise-requests/${app.id}`}>
                                            <button className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all">View</button>
                                        </Link>
                                        <Link href={app.type === 'educator' ? `/admin/educators/applications/${app.id}` : `/admin/enterprise-requests/${app.id}`}>
                                            <button className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded shadow-sm hover:opacity-90 transition-all group-hover:ring-2 ring-primary/20 relative">
                                                Approve
                                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                                </span>
                                            </button>
                                        </Link>
                                        <Link href={app.type === 'educator' ? `/admin/educators/applications/${app.id}` : `/admin/enterprise-requests/${app.id}`}>
                                            <button className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">Reject</button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {applications.length > itemsPerPage && (
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
                    <p className="text-xs text-slate-500 font-medium">
                        Showing <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, applications.length)}</span> of {applications.length} applications
                    </p>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="size-4" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={cn(
                                    "size-8 flex items-center justify-center rounded font-bold text-xs transition-all",
                                    currentPage === page
                                        ? "bg-primary text-white shadow-sm shadow-primary/20"
                                        : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                                )}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
