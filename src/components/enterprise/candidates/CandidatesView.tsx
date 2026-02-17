"use client"

import CandidatesHeader from "./CandidatesHeader"
import CandidatesStats from "./CandidatesStats"
import CandidatesFilters from "./CandidatesFilters"
import CandidatesTable from "./CandidatesTable"
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"

export default function CandidatesView() {
    return (
        <div className="flex h-screen overflow-hidden bg-[#f7f6f8] dark:bg-[#191022]">
            <DashboardSidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <CandidatesHeader />
                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">
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
