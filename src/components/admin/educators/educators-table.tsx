import { MoreVertical, ChevronLeft, ChevronRight, Edit2, Trash2, UserX } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

interface Educator {
    id: string;
    userId: string;
    name: string;
    institution: string;
    course: string;
    avatar?: string;
    email: string;
    groups: number;
    students: number;
    lastLogin: string;
}

interface EducatorsTableProps {
    educators: Educator[];
    totalItems: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onDelete: (id: string, userId: string) => void;
    isLoading?: boolean;
}

export function EducatorsTable({
    educators,
    totalItems,
    currentPage,
    onPageChange,
    onDelete,
    isLoading
}: EducatorsTableProps) {
    const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

    const totalPages = Math.ceil(totalItems / 8);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm mb-8 overflow-hidden animate-pulse">
                <div className="h-12 bg-slate-50 dark:bg-[#2d1e3d] w-full"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 border-t border-slate-100 dark:border-[#382a4a] w-full"></div>
                ))}
            </div>
        )
    }

    if (educators.length === 0) {
        return (
            <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm mb-8 p-12 text-center">
                <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserX className="size-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Educators Found</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">There are no approved educators matching your current search or filters.</p>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm mb-8 overflow-hidden relative">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead className="bg-slate-50 dark:bg-[#2d1e3d] text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Educator & Institution</th>
                            <th className="px-6 py-4">Simulation / Course</th>
                            <th className="px-6 py-4">Groups</th>
                            <th className="px-6 py-4">Students</th>
                            <th className="px-6 py-4">Last Login</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#382a4a]">
                        {educators.map((educator) => (
                            <tr key={educator.id} className="hover:bg-slate-50 dark:hover:bg-[#2d1e3d] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary font-bold text-xs overflow-hidden">
                                            {educator.avatar ? (
                                                <img src={educator.avatar} alt={educator.name} className="w-full h-full object-cover" />
                                            ) : (
                                                educator.name.split(' ').map(n => n[0]).join('')
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{educator.name}</span>
                                            <span className="text-[11px] text-slate-500">{educator.institution}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{educator.course}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-[#140d1b] dark:text-white">{educator.groups}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-[#140d1b] dark:text-white">{educator.students}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{educator.lastLogin}</span>
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/educators/applications/${educator.id}`}
                                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                            title="Edit Educator"
                                        >
                                            <Edit2 className="size-4" />
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete ${educator.name}? This will remove them from Supabase.`)) {
                                                    onDelete(educator.id, educator.userId);
                                                }
                                            }}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Educator"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-[#382a4a] flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Showing {(currentPage - 1) * 8 + 1}-{Math.min(currentPage * 8, totalItems)} of {totalItems.toLocaleString()} Educators
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-slate-200 dark:border-[#382a4a] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d1e3d] disabled:opacity-30 text-slate-600 transition-colors"
                    >
                        <ChevronLeft className="size-4" />
                    </button>

                    <div className="flex items-center gap-1">
                        {[...Array(Math.min(3, totalPages))].map((_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={cn(
                                        "size-9 flex items-center justify-center text-xs font-black rounded-lg transition-all",
                                        currentPage === pageNum
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "hover:bg-slate-100 dark:hover:bg-[#2d1e3d] text-slate-600 dark:text-slate-400"
                                    )}
                                >
                                    {pageNum}
                                </button>
                            )
                        })}
                        {totalPages > 3 && <span className="px-1 text-slate-400 font-bold">...</span>}
                        {totalPages > 3 && (
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className={cn(
                                    "size-9 flex items-center justify-center text-xs font-black rounded-lg transition-all",
                                    currentPage === totalPages
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "hover:bg-slate-100 dark:hover:bg-[#2d1e3d] text-slate-600 dark:text-slate-400"
                                )}
                            >
                                {totalPages}
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 border border-slate-200 dark:border-[#382a4a] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d1e3d] disabled:opacity-30 text-slate-600 transition-colors"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
