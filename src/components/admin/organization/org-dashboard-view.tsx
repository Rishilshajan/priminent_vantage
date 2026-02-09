"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { OrgStats } from "./org-stats"
import { OrgTable } from "./org-table"
import { OrgActivity } from "./org-activity"
import { OrgActions } from "./org-actions"

export default function OrgDashboardView({
    profile,
    requests,
    stats
}: {
    profile: any;
    requests: any[];
    stats: any;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50/30 dark:bg-black/20">
            <AdminSidebar
                user={profile}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col overflow-hidden w-full">
                <AdminHeader
                    onMenuClick={() => setSidebarOpen(true)}
                    title="Organization Requests & Management"
                />

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
                    {/* Stats */}
                    <OrgStats stats={stats} />

                    {/* Pending Requests Table */}
                    <OrgTable data={requests} />

                    {/* Bottom Grid: Activity & Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                        <OrgActivity />
                        <OrgActions />
                    </div>
                </div>
            </main>
        </div>
    )
}
