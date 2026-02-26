"use client"

import { useState, useEffect, useCallback } from "react"
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/enterprise/dashboard/DashboardHeader"
import SettingsNav from "@/components/enterprise/settings/SettingsNav"
import InstructorsTable from "@/components/enterprise/instructors/InstructorsTable"
import InviteInstructorModal from "@/components/enterprise/instructors/InviteInstructorModal"
import { Button } from "@/components/ui/button"
import { UserPlus, Search, Users, ShieldCheck, Mail } from "lucide-react"
import { getInstructors } from "@/actions/enterprise/enterprise-management.actions"

interface TeamAccessViewProps {
    userProfile?: any;
    orgName?: string;
}

export default function TeamAccessView({ userProfile, orgName }: TeamAccessViewProps) {
    const [instructors, setInstructors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchInstructors = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getInstructors();
            if (result.success) {
                setInstructors(result.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch instructors:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInstructors();
    }, [fetchInstructors]);

    const filteredInstructors = instructors.filter(instructor =>
        (instructor.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (instructor.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { label: "Total Members", value: instructors.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Admins", value: instructors.filter(i => i.role === 'admin' || i.role === 'enterprise_admin').length, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Pending Invites", value: instructors.filter(i => i.isInvitation).length, icon: Mail, color: "text-amber-500", bg: "bg-amber-50" },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8F9FC] dark:bg-[#191022] font-poppins">
            <DashboardSidebar orgName={orgName} userProfile={userProfile} />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <DashboardHeader orgName={orgName || "Enterprise"} userProfile={userProfile} />
                <SettingsNav />

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
                        {/* Page Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 dark:text-white    leading-none">Team & Role Access</h1>
                                <p className="text-slate-500 mt-3 max-w-lg font-medium">Manage your organization's professionals, control access levels, and invite new specialists to your workflow.</p>
                            </div>
                            <Button
                                onClick={() => setIsInviteModalOpen(true)}
                                className="h-14 px-8 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1 flex items-center gap-3 active:translate-y-0"
                            >
                                <UserPlus className="size-5" />
                                Invite Specialist
                            </Button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`size-14 rounded-2xl ${stat.bg} dark:bg-slate-800 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                            <stat.icon className="size-7" />
                                        </div>
                                        <span className="text-4xl font-black text-slate-900 dark:text-white   er">{stat.value}</span>
                                    </div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Directory Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email or role..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 h-12 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400 outline-none"
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button variant="outline" className="flex-1 sm:px-6 h-12 rounded-2xl border-slate-100 dark:border-slate-800 font-bold text-xs">
                                    Export List
                                </Button>
                                <Button variant="outline" className="flex-1 sm:px-6 h-12 rounded-2xl border-slate-100 dark:border-slate-800 font-bold text-xs">
                                    Activity Log
                                </Button>
                            </div>
                        </div>

                        {/* Directory Table */}
                        <div className="relative">
                            {isLoading ? (
                                <div className="h-64 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 animate-pulse">
                                    <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synchronizing Directory...</p>
                                </div>
                            ) : (
                                <InstructorsTable
                                    instructors={filteredInstructors}
                                    onRefresh={fetchInstructors}
                                />
                            )}
                        </div>

                        <div className="pt-10">
                            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-50">
                                Protected by Enterprise Grade Access Control System
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <InviteInstructorModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInviteSuccess={fetchInstructors}
            />
        </div>
    )
}
