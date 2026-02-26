import React, { useState, useEffect } from 'react';
import { Shield, Mail, Trash2, Edit2, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { deleteSpecialistAction, updateSpecialistRoleAction, resendInvitationAction } from '@/actions/enterprise/enterprise-management.actions';
import { cn } from '@/lib/utils';

interface InstructorsTableProps {
    instructors: any[];
    onRefresh: () => void;
}

const InstructorsTable = ({ instructors, onRefresh }: InstructorsTableProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isInvitationDelete, setIsInvitationDelete] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSpecialist, setEditingSpecialist] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(instructors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = instructors.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevious = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const handleNext = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (totalPages === 0) {
            setCurrentPage(1);
        }
    }, [instructors.length, totalPages, currentPage]);

    const handleDelete = async () => {
        if (!deletingId) return;
        setIsDeleting(true);
        try {
            const res = await deleteSpecialistAction(deletingId, isInvitationDelete);
            if (res.success) {
                onRefresh();
                setDeletingId(null);
            } else {
                alert(res.error || "Failed to delete");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("An unexpected error occurred during deletion.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateRole = async (newRole: any) => {
        if (!editingSpecialist) return;
        setIsUpdating(true);
        try {
            const res = await updateSpecialistRoleAction(editingSpecialist.id, newRole);
            if (res.success) {
                onRefresh();
                setIsEditModalOpen(false);
            } else {
                alert(res.error || "Failed to update role");
            }
        } catch (err) {
            console.error("Update role error:", err);
            alert("An unexpected error occurred while updating role.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleResend = async () => {
        if (!editingSpecialist) return;
        setIsUpdating(true);
        try {
            const res = await resendInvitationAction(editingSpecialist.id);
            if (res.success) {
                alert("Invitation resent successfully!");
                setIsEditModalOpen(false);
            } else {
                alert(res.error || "Failed to resend");
            }
        } catch (err) {
            console.error("Resend error:", err);
            alert("An unexpected error occurred while resending invitation.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 flex justify-between items-center">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Management Directory</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {instructors.length} Total
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Instructor</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest uppercase">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Activity</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {currentItems.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                    No instructors found
                                </td>
                            </tr>
                        ) : (
                            currentItems.map((instructor) => (
                                <tr key={instructor.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            {instructor.isInvitation ? (
                                                <div className="size-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-500/20 shrink-0">
                                                    <Mail className="size-5" />
                                                </div>
                                            ) : instructor.avatar ? (
                                                <div
                                                    className="size-10 rounded-2xl bg-cover bg-center shadow-inner border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform shrink-0"
                                                    style={{ backgroundImage: `url('${instructor.avatar}')` }}
                                                />
                                            ) : (
                                                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase shadow-inner border border-primary/20 group-hover:scale-105 transition-transform shrink-0">
                                                    {(instructor.name || "U").split(' ').map((n: any) => n[0]).join('').toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <p className="text-[13px] font-black text-slate-900 dark:text-white    leading-none group-hover:text-primary transition-colors truncate">{instructor.name}</p>
                                                    {instructor.isInvitation && (
                                                        <span className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-500/20">Invite</span>
                                                    )}
                                                </div>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{instructor.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${instructor.status === 'Active'
                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                            : instructor.status === 'Pending'
                                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                                : instructor.status === 'On Leave'
                                                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                                    : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                            <span className={`size-1 rounded-full ${instructor.status === 'Active' ? 'bg-emerald-500' : instructor.status === 'Pending' ? 'bg-blue-500' : instructor.status === 'On Leave' ? 'bg-amber-500' : 'bg-slate-400'
                                                }`}></span>
                                            {instructor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-[11px] font-bold text-slate-400   ">
                                        {instructor.lastActivity ? new Date(instructor.lastActivity).toLocaleDateString() : 'No Activity'}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingSpecialist(instructor);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="size-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-primary transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 shadow-sm"
                                                title="Edit specialist"
                                            >
                                                <Edit2 className="size-[16px]" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletingId(instructor.id);
                                                    setIsInvitationDelete(!!instructor.isInvitation);
                                                }}
                                                className="size-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 shadow-sm"
                                                title="Delete"
                                            >
                                                <Trash2 className="size-[16px]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/20">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, instructors.length)} of {instructors.length} Specialists
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="h-9 px-4 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="h-9 px-4 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Deletion Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 scale-in-center">
                        <div className="size-16 rounded-3xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6 mx-auto">
                            <AlertTriangle className="size-8" />
                        </div>
                        <h3 className="text-xl font-black text-center text-slate-900 dark:text-white mb-2   ">Remove Specialist?</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-8 leading-relaxed font-medium">
                            This will permanently remove the specialist from your organization. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="flex-1 h-12 rounded-2xl border border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 h-12 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                {isDeleting ? <Loader2 className="size-4 animate-spin" /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Specialist Modal */}
            {isEditModalOpen && editingSpecialist && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-200">
                    {/* overlay */}
                    <div
                        className="absolute inset-0"
                        onClick={() => setIsEditModalOpen(false)}
                    />

                    {/* Modal container: constrain height + prevent overflow */}
                    <div
                        className={cn(
                            "relative w-full",
                            "max-w-2xl lg:max-w-3xl",
                            "max-h-[85vh] flex flex-col overflow-hidden",
                            "rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/70 dark:border-white/10",
                            "animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
                        )}
                    >
                        {/* top accent */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/12 via-primary/6 to-transparent" />

                        {/* header (fixed) */}
                        <div className="relative px-7 pt-7 pb-5 shrink-0">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-2xl bg-primary/10 border border-primary/15 grid place-items-center">
                                            <span className="material-symbols-outlined text-primary">
                                                manage_accounts
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                                                Edit Specialist
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Update role or re-invite the specialist
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="size-10 rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 grid place-items-center transition"
                                    aria-label="Close modal"
                                >
                                    <span className="material-symbols-outlined text-slate-500 dark:text-slate-300">
                                        close
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* body (scrolls) */}
                        <div className="relative px-7 pb-7 space-y-6  overflow-y-auto min-h-0 max-h-[calc(85vh-96px)]">
                            {/* specialist card */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/15 flex items-center justify-center text-primary font-black text-sm">
                                        {editingSpecialist.name
                                            .split(" ")
                                            .filter(Boolean)
                                            .map((n: any) => n[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-black text-slate-900 dark:text-white leading-none truncate">
                                            {editingSpecialist.name}
                                        </p>
                                        <div className="mt-2">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                {editingSpecialist.email}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={cn(
                                            "shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-black tracking-wide",
                                            editingSpecialist.isInvitation
                                                ? "bg-amber-500/12 text-amber-800 border-amber-200 dark:text-amber-300 dark:border-amber-500/25"
                                                : "bg-emerald-500/12 text-emerald-800 border-emerald-200 dark:text-emerald-300 dark:border-emerald-500/25"
                                        )}
                                        title="Status"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            {editingSpecialist.isInvitation ? "schedule" : "verified"}
                                        </span>
                                        {editingSpecialist.isInvitation ? "Pending" : "Active"}
                                    </span>
                                </div>
                            </div>

                            {/* role section */}
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.22em] ml-1">
                                            Specialist Role
                                        </label>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 ml-1">
                                            Choose permissions for this specialist.
                                        </p>
                                    </div>

                                    {editingSpecialist.isInvitation ? (
                                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                                            <span className="material-symbols-outlined text-[16px]">
                                                lock
                                            </span>
                                            Locked
                                        </div>
                                    ) : null}
                                </div>

                                {/* role tiles: responsive grid + equal height + no overflow */}
                                {/* role tiles: responsive grid + equal height + NO truncation (always fully readable) */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { key: "instructor", icon: "school", desc: "Create & guide" },
                                        { key: "reviewer", icon: "fact_check", desc: "Review & score" },
                                        { key: "admin", icon: "admin_panel_settings", desc: "Manage access" },
                                    ].map((r) => {
                                        const active = editingSpecialist.role.toLowerCase() === r.key;

                                        return (
                                            <button
                                                key={r.key}
                                                onClick={() => handleUpdateRole(r.key)}
                                                disabled={isUpdating || editingSpecialist.isInvitation}
                                                className={cn(
                                                    "rounded-2xl border p-4 text-left transition-all",
                                                    "disabled:opacity-60 disabled:cursor-not-allowed",
                                                    // allow tile to grow to fit its content
                                                    "h-auto",
                                                    active
                                                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                                        : "bg-white/70 dark:bg-white/5 border-slate-200/70 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:shadow-sm"
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-2.5">
                                                        <div
                                                            className={cn(
                                                                "size-10 rounded-xl border grid place-items-center shrink-0",
                                                                active
                                                                    ? "bg-white/15 border-white/20"
                                                                    : "bg-slate-50 dark:bg-white/5 border-slate-200/70 dark:border-white/10"
                                                            )}
                                                        >
                                                            <span
                                                                className={cn(
                                                                    "material-symbols-outlined text-[18px]",
                                                                    active ? "text-white" : "text-slate-700 dark:text-slate-200"
                                                                )}
                                                            >
                                                                {r.icon}
                                                            </span>
                                                        </div>

                                                        {/* IMPORTANT: no truncate, no line-clamp */}
                                                        <div className="flex-1">
                                                            <div
                                                                className={cn(
                                                                    "text-[11px] font-black uppercase tracking-widest",
                                                                    active ? "text-white" : "text-slate-700 dark:text-slate-200"
                                                                )}
                                                            >
                                                                {r.key}
                                                            </div>
                                                            <div
                                                                className={cn(
                                                                    "mt-1 text-xs leading-snug whitespace-normal break-words",
                                                                    active ? "text-white/85" : "text-slate-500 dark:text-slate-400"
                                                                )}
                                                            >
                                                                {r.desc}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {active ? (
                                                        <CheckCircle2 className="size-5 shrink-0 text-white mt-0.5" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500 mt-0.5">
                                                            chevron_right
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {editingSpecialist.isInvitation && (
                                    <div className="rounded-2xl border border-amber-200/70 dark:border-amber-500/25 bg-amber-500/10 p-3">
                                        <p className="text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px] mt-0.5">
                                                info
                                            </span>
                                            <span className="leading-relaxed">
                                                Role updates are disabled for pending invitations. Delete and re-invite to change role.
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* resend section */}
                            {editingSpecialist.isInvitation && (
                                <div className="pt-4 border-t border-slate-200/70 dark:border-white/10">
                                    <button
                                        onClick={handleResend}
                                        disabled={isUpdating}
                                        className="w-full h-12 rounded-2xl border border-blue-200/70 dark:border-blue-500/25 bg-blue-50/80 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[12px] font-black uppercase tracking-widest hover:bg-blue-100/70 dark:hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="size-4" />
                                                Regenerate & Resend Email
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructorsTable;
