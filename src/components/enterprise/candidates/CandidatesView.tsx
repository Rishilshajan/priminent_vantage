"use client"

import { useState } from "react"
import CandidatesHeader from "./CandidatesHeader"
import CandidatesStats from "./CandidatesStats"
import CandidatesFilters from "./CandidatesFilters"
import CandidatesTable from "./CandidatesTable"
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"

interface CandidatesViewProps {
    userProfile?: any;
    organization?: {
        name: string;
    } | null;
}

export default function CandidatesView({ userProfile, organization }: CandidatesViewProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const orgName = organization?.name || "Organization"

    return (
        <div className="flex h-screen overflow-hidden bg-[#f7f6f8] dark:bg-[#191022]">
            {/* Desktop Sidebar */}
            <DashboardSidebar orgName={orgName} userProfile={userProfile} />

            {/* Mobile Sidebar */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent side="left" className="p-0 w-72">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <DashboardSidebar
                        orgName={orgName}
                        userProfile={userProfile}
                        className="flex border-none w-full h-full static"
                        onLinkClick={() => setIsSidebarOpen(false)}
                    />
                </SheetContent>
            </Sheet>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <CandidatesHeader onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8 space-y-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-8 w-full">
                        <CandidatesStats />
                        <CandidatesFilters />
                        <CandidatesTable />
                    </div>
                </div>
            </main>
        </div>
    )
}
