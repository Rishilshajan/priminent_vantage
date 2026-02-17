"use client"

import { useState } from "react"
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import SettingsNav from "@/components/enterprise/settings/SettingsNav"
import DomainAccessControl from "./DomainAccessControl"
import TeamMembersTable from "./TeamMembersTable"
import PermissionDrawer from "./PermissionDrawer"
import { Button } from "@/components/ui/button"
import { ChevronRight, Bell, UserPlus } from "lucide-react"

export default function TeamAccessView() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8F9FC] dark:bg-[#191022]">
            <DashboardSidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <SettingsNav />

                {/* Top Header Content Overlay (if needed for specific header actions unique to this page) */}
                <div className="absolute top-0 right-8 h-14 flex items-center gap-4 z-30 pointer-events-none">
                    <div className="pointer-events-auto flex items-center gap-4">
                        <div className="relative group cursor-pointer">
                            <Bell className="size-5 text-slate-400 hover:text-primary transition-colors" />
                            <span className="absolute top-0 right-0 size-2 bg-red-500 border-2 border-white dark:border-[#1f1629] rounded-full"></span>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2 h-9">
                            <UserPlus className="size-4" />
                            Invite Team Member
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-6xl mx-auto p-8 space-y-8">
                        {/* Page Title */}
                        <div>
                            <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-1">
                                <span className="text-primary">Enterprise Settings</span>
                                <span className="text-slate-300">/</span>
                                <span className="text-slate-900 dark:text-white">Team & Access</span>
                            </nav>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Team & Access</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your organization’s members, roles, and security protocols across the enterprise.</p>
                        </div>

                        <DomainAccessControl />
                        <TeamMembersTable onManagePermissions={() => setIsDrawerOpen(true)} />
                    </div>
                </div>

                <PermissionDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            </main>
        </div>
    )
}
