"use client"

import { useState, useMemo } from "react"
import { Database, Calendar, Plus, Copy, RefreshCw, Ban, History, ChevronLeft, ChevronRight, HelpCircle, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccessCode {
    id: string;
    code?: string;
    code_hash: string;
    status: string;
    expires_at: string;
    created_at: string;
    used_count: number;
    usage_limit: number;
    enterprise_requests?: {
        company_name?: string;
        industry?: string;
    };
}

export function AccessCodeTable({ codes = [] }: { codes: AccessCode[] }) {
    const [statusFilter, setStatusFilter] = useState("All Statuses")
    const [industryFilter, setIndustryFilter] = useState("All Industries")
    const [currentPage, setCurrentPage] = useState(1)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const itemsPerPage = 8

    // Handle Copy to Clipboard
    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    // Filter Logic
    const filteredCodes = codes.filter(code => {
        const matchesStatus = statusFilter === "All Statuses" ||
            (statusFilter === "Active" && code.status === "active") ||
            (statusFilter === "Expired" && code.status === "expired") ||
            (statusFilter === "Revoked" && code.status === "revoked") ||
            (statusFilter === "Used" && code.status === "used");

        const industry = code.enterprise_requests?.industry || "Other";
        const matchesIndustry = industryFilter === "All Industries" ||
            industry.toLowerCase() === industryFilter.toLowerCase();

        return matchesStatus && matchesIndustry;
    });

    const totalPages = Math.ceil(filteredCodes.length / itemsPerPage) || 1
    const pagedCodes = filteredCodes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    // Compute expiry threshold once to avoid calling Date.now() during render
    const expiryThreshold = useMemo(() => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), []);

    const getStatusStyle = (status: string, expiresAt: string) => {
        // Expiring logic: Active AND expires within 2 days (48 hours)
        const isExpiring = status === 'active' && new Date(expiresAt) <= expiryThreshold;

        if (isExpiring) return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"

        switch (status) {
            case 'active':
                return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
            case 'used':
                // Used status style (Blue/Green distinct from Active)
                return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            case 'expired':
                return "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30"
            case 'revoked':
                return "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700"
            default:
                return "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
        }
    }

    const getStatusLabel = (status: string, expiresAt: string) => {
        const isExpiring = status === 'active' && new Date(expiresAt) <= expiryThreshold;
        if (isExpiring) return 'EXPIRING';
        return status.toUpperCase();
    }

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toISOString().split('T')[0];
    }

    // Get unique industries for filter
    const industries = Array.from(new Set(codes.map(c => c.enterprise_requests?.industry).filter(Boolean)));

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50 transition-all">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Enterprise Access Codes</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest font-semibold flex items-center gap-1">
                        <Database className="size-3" />
                        High-density management overview
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="text-xs font-semibold border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-1.5 focus:ring-primary outline-none cursor-pointer transition-all hover:border-primary/30"
                    >
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>Used</option>
                        <option>Expired</option>
                        <option>Revoked</option>
                    </select>
                    <select
                        value={industryFilter}
                        onChange={(e) => { setIndustryFilter(e.target.value); setCurrentPage(1); }}
                        className="text-xs font-semibold border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-1.5 focus:ring-primary outline-none cursor-pointer transition-all hover:border-primary/30"
                    >
                        <option>All Industries</option>
                        {industries.map(ind => (
                            <option key={ind} value={ind}>{ind}</option>
                        ))}
                    </select>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all hover:border-primary/40">
                        <Calendar className="size-3.5" />
                        Date Range
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg hover:opacity-90 shadow-sm shadow-primary/20 transition-all">
                        <Plus className="size-3.5" />
                        Generate New Code
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-3 whitespace-nowrap">Access Code</th>
                            <th className="px-6 py-3 whitespace-nowrap">Organization</th>
                            <th className="px-6 py-3 whitespace-nowrap">Created</th>
                            <th className="px-6 py-3 whitespace-nowrap">Expiry</th>
                            <th className="px-6 py-3 whitespace-nowrap">Enrollments</th>
                            <th className="px-6 py-3 whitespace-nowrap">Status</th>
                            <th className="px-6 py-3 text-right whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {pagedCodes.length > 0 ? (
                            pagedCodes.map((code) => {
                                const companyName = code.enterprise_requests?.company_name || "Unknown Organization";
                                const industry = code.enterprise_requests?.industry || "Uncategorized";
                                const redemptionPercent = Math.min((code.used_count / (code.usage_limit || 1)) * 100, 100);
                                const isRevoked = code.status === 'revoked';
                                const isExpiring = code.status === 'active' && new Date(code.expires_at) <= expiryThreshold;

                                return (
                                    <tr key={code.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "font-mono font-bold px-2 py-1 rounded text-sm transition-all",
                                                    isRevoked ? "text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-800/30 line-through" : "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800"
                                                )}>
                                                    {code.code || `${code.code_hash.substring(0, 3)}-${code.code_hash.substring(3, 6)}-${code.code_hash.substring(6, 9)}`}
                                                </span>
                                                {!isRevoked && (
                                                    <button
                                                        onClick={() => copyToClipboard(code.code || code.code_hash, code.id)}
                                                        className={cn(
                                                            "flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold transition-all border shrink-0",
                                                            copiedId === code.id
                                                                ? "bg-emerald-500 text-white border-emerald-500"
                                                                : "bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary"
                                                        )}
                                                    >
                                                        {copiedId === code.id ? (
                                                            <>
                                                                <ShieldCheck className="size-3" />
                                                                Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="size-3" />
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className={cn("text-sm font-semibold transition-all", isRevoked ? "text-slate-400 opacity-60" : "text-slate-900 dark:text-white")}>{companyName}</span>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-tighter font-medium">{industry}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{formatDate(code.created_at)}</td>
                                        <td className={cn(
                                            "px-6 py-4 text-sm font-medium transition-all",
                                            isExpiring ? "text-amber-600" : "text-slate-600 dark:text-slate-400"
                                        )}>
                                            {formatDate(code.expires_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0">
                                                    <div
                                                        className={cn(
                                                            "h-full transition-all duration-1000",
                                                            isRevoked ? "bg-slate-300 dark:bg-slate-700" :
                                                                isExpiring ? "bg-amber-500" : "bg-emerald-500"
                                                        )}
                                                        style={{ width: `${redemptionPercent}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{code.used_count.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all",
                                                getStatusStyle(code.status, code.expires_at)
                                            )}>
                                                <span className={cn(
                                                    "size-1.5 rounded-full transition-all animate-pulse",
                                                    code.status === 'active' ? (isExpiring ? "bg-amber-500" : "bg-emerald-500") :
                                                        code.status === 'used' ? "bg-blue-500" :
                                                            code.status === 'expired' ? "bg-red-500" : "bg-slate-300"
                                                )}></span>
                                                {getStatusLabel(code.status, code.expires_at)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-slate-500 hover:bg-primary/10 hover:text-primary rounded transition-all" title="Regenerate">
                                                    <RefreshCw className="size-4" />
                                                </button>
                                                {!isRevoked && (
                                                    <button className="p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded transition-all" title="Revoke">
                                                        <Ban className="size-4" />
                                                    </button>
                                                )}
                                                <button className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all" title="Audit Log">
                                                    <History className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-24 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-3">
                                        <HelpCircle className="size-10 text-slate-300" />
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900 dark:text-white">No access codes found</p>
                                            <p className="text-xs text-slate-500">Adjust your filters or generate a new code to get started.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/30">
                <p className="text-xs text-slate-500 font-medium">
                    Showing <span className="text-slate-900 dark:text-white font-bold">{filteredCodes.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredCodes.length)}</span> of {filteredCodes.length} records
                </p>
                <div className="flex gap-1">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                                "size-8 flex items-center justify-center rounded font-bold text-xs transition-all",
                                currentPage === page ? "bg-primary text-white shadow-sm shadow-primary/20" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
