"use client";

import React, { useState, useEffect } from 'react';
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/enterprise/dashboard/DashboardHeader";
import InstructorsStats from "@/components/enterprise/instructors/InstructorsStats";
import InstructorsFilter from "@/components/enterprise/instructors/InstructorsFilter";
import InstructorsTable from "@/components/enterprise/instructors/InstructorsTable";
import InviteInstructorModal from "@/components/enterprise/instructors/InviteInstructorModal";
import { getInstructors, getEnterpriseUser, getInstructorStats } from '@/actions/enterprise/enterprise-management.actions';
import { Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function InstructorsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [instructors, setInstructors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [orgName, setOrgName] = useState("Enterprise");
    const [stats, setStats] = useState<any>(null);

    const [orgLogo, setOrgLogo] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

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

    const fetchStats = async () => {
        try {
            const result = await getInstructorStats();
            if (result.success) {
                setStats(result.data);
            }
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchInstructors(), fetchStats()]);
        setLoading(false);
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
        fetchData();
        fetchUserContext();
    }, []);

    // Filter Logic
    const filteredInstructors = instructors.filter(instructor => {
        const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || instructor.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleExport = () => {
        if (filteredInstructors.length === 0) return;

        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(18);
        doc.text('Specialist Directory', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);

        // Add metadata
        const date = new Date();
        const dateStr = date.toLocaleDateString();
        doc.text(`Generated on: ${dateStr}`, 14, 30);
        doc.text(`Organization: ${orgName}`, 14, 36);

        // Generate Table
        const tableData = filteredInstructors.map(i => [
            i.name,
            i.email,
            i.role,
            i.status
        ]);

        autoTable(doc, {
            startY: 45,
            head: [['Name', 'Email', 'Role', 'Status']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 5 },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 60 },
                2: { cellWidth: 40 },
                3: { cellWidth: 30 }
            }
        });

        // Format filename: Instructos_ddmmyy
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear().toString().slice(-2);
        const fileName = `Instructos_${d}${m}${y}.pdf`;

        doc.save(fileName);
    };

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
                    <InstructorsStats stats={stats} />

                    {/* Filter & Table Section */}
                    <div className="space-y-0">
                        <InstructorsFilter
                            onSearchChange={setSearchTerm}
                            onStatusFilterChange={setStatusFilter}
                            currentStatus={statusFilter}
                            onExport={handleExport}
                        />
                        {loading ? (
                            <div className="h-64 flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <Loader2 className="animate-spin text-primary size-8" />
                            </div>
                        ) : (
                            <InstructorsTable instructors={filteredInstructors} onRefresh={fetchData} />
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
