"use client"

import { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { StatsCards } from "./stats-grid"
import { PendingApprovals } from "./pending-approvals"
import { RecentLogs } from "./recent-logs"
import { QuickActions } from "./quick-actions"

interface AdminDashboardViewProps {
    profile: any;
    stats: {
        pendingRequests: number;
        activeOrgs: number;
        monthlyOnboardings: number;
    };
    pendingApplications: any[];
    recentLogs: any[];
}

export default function AdminDashboardView({ profile, stats, pendingApplications, recentLogs }: AdminDashboardViewProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50/30 dark:bg-black/20">
            {/* Sidebar with Profile prop typically */}
            <AdminSidebar
                user={profile}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col overflow-hidden w-full">
                <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
                    {/* Stats Grid */}
                    <StatsCards
                        pendingRequests={stats.pendingRequests}
                        activeOrgs={stats.activeOrgs}
                        monthlyOnboardings={stats.monthlyOnboardings}
                    />

                    {/* Pending Approvals Table */}
                    <PendingApprovals applications={pendingApplications} />

                    {/* Bottom Grid: Logs & Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RecentLogs logs={recentLogs} />
                        <QuickActions />
                    </div>
                </div>
            </main>
        </div>
    )
}
