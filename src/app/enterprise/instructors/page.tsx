"use client";

import React, { useState, useEffect } from 'react';
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/enterprise/dashboard/DashboardHeader";
import InstructorsStats from "@/components/enterprise/instructors/InstructorsStats";
import InstructorsFilter from "@/components/enterprise/instructors/InstructorsFilter";
import InstructorsTable from "@/components/enterprise/instructors/InstructorsTable";
import InviteInstructorModal from "@/components/enterprise/instructors/InviteInstructorModal";
import { getInstructors, getEnterpriseUser, getOrganizationBranding } from '@/actions/enterprise/enterprise-management.actions';
import { Loader2 } from 'lucide-react';

export default function InstructorsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [instructors, setInstructors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [orgName, setOrgName] = useState("Enterprise");

    const [orgLogo, setOrgLogo] = useState<string | null>(null);

    const fetchInstructors = async () => {
        try {
            const result = await getInstructors();
            if (result.success) {
                setInstructors(result.data);
            }
        } catch (err) {
            console.error("Failed to fetch instructors:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserContext = async () => {
        try {
            const data = await getEnterpriseUser();
            if (data) {
                setUserProfile(data.userProfile);
                setOrgName(data.orgName);
                setOrgLogo(data.orgLogo);
            }
        } catch (err) {
            console.error("Failed to fetch user context:", err);
        }
    };

    useEffect(() => {
        fetchInstructors();
        fetchUserContext();
    }, []);

    // Enriched profile for Header
    const enrichedProfile = userProfile ? { ...userProfile, orgLogo } : null;

    // Placeholder profile while loading
    const profile = userProfile || {
        first_name: "Admin",
        last_name: "User",
        email: "",
        role: "admin"
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <DashboardSidebar orgName={orgName} userProfile={profile as any} orgLogo={orgLogo} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <DashboardHeader orgName={orgName} userProfile={enrichedProfile || profile} />

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 space-y-10 custom-scrollbar">
                    {/* Page Heading */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Instructors</h1>
                            <p className="text-[10px] md:text-xs font-black text-slate-400 mt-3 uppercase tracking-[0.2em]">Management & Performance Overview</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="h-14 px-8 bg-primary hover:bg-primary/95 text-white rounded-2xl shadow-xl shadow-primary/20 text-[11px] font-black uppercase tracking-widest transition-all gap-3 flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <span className="material-symbols-outlined text-xl">person_add</span>
                            Invite Specialist
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <InstructorsStats />

                    {/* Filter & Table Section */}
                    <div className="space-y-0">
                        <InstructorsFilter />
                        {loading ? (
                            <div className="h-64 flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <Loader2 className="animate-spin text-primary size-8" />
                            </div>
                        ) : (
                            <InstructorsTable instructors={instructors} />
                        )}
                    </div>

                    {/* Footer */}
                    <div className="pt-12 pb-6 text-center">
                        <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">
                            Prominent Vantage • Enterprise Control Plane
                        </p>
                    </div>
                </div>
            </main>

            <InviteInstructorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onInviteSuccess={fetchInstructors}
            />
        </div>
    );
}
