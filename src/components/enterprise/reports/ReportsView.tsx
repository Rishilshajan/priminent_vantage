"use client"

import { useState } from "react"
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import ReportsHeader from "@/components/enterprise/reports/ReportsHeader"
import ReportsSelectionGrid from "@/components/enterprise/reports/ReportsSelectionGrid"
import RecentReportsTable from "@/components/enterprise/reports/RecentReportsTable"

interface ReportsViewProps {
    userProfile?: any;
    organization?: {
        name: string;
    } | null;
    simulations: any[];
}

export default function ReportsView({ userProfile, organization, simulations }: ReportsViewProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const orgName = organization?.name || "Organization"

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8F9FC] dark:bg-[#191022]">
            {/* Desktop Sidebar */}
            <DashboardSidebar orgName={orgName} userProfile={userProfile} />

            {/* Mobile Sidebar */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent side="left" className="p-0 w-72 bg-white dark:bg-slate-900 border-r dark:border-slate-800">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <DashboardSidebar
                        orgName={orgName}
                        userProfile={userProfile}
                        className="flex border-none w-full h-full static"
                        onLinkClick={() => setIsSidebarOpen(false)}
                    />
                </SheetContent>
            </Sheet>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <ReportsHeader onMenuClick={() => setIsSidebarOpen(true)} userProfile={userProfile} />

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 custom-scrollbar">
                    <div className="max-w-[1440px] mx-auto w-full space-y-10">
                        {/* Page Title Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white    leading-tight">Simulation Performance Hub</h2>
                                <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm md:text-base mt-2">Deep-dive into organizational simulation results, student completion metrics, and cohort performance analytics.</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="hidden sm:flex px-6 py-3 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                                    Export Data
                                </button>
                            </div>
                        </div>

                        {/* Dynamic Grid Section */}
                        <div className="space-y-6">
                            <ReportsSelectionGrid
                                simulations={simulations}
                            />
                        </div>

                        {/* Recent Reports Section */}
                        <RecentReportsTable simulations={simulations} />
                    </div>
                </div>
            </main>
        </div>
    )
}
