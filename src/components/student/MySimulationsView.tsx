"use client"

import React, { useState, useMemo } from "react"
import { Search, Rocket, X, Menu } from "lucide-react"
import { StudentSidebar } from "./StudentSidebar"
import { NotificationDropdown } from "./NotificationDropdown"
import { SimulationCard } from "./SimulationCard"
import { EmptyState } from "./EmptyState"
import { StatusFilters } from "./StatusFilters"
import { cn } from "@/lib/utils"

interface MySimulationsViewProps {
    initialEnrollments: any[];
    userProfile: any;
    orgBranding: any;
}

export function MySimulationsView({ initialEnrollments, userProfile, orgBranding }: MySimulationsViewProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const brandColorStyle = orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {}
    const brandColorBorder = orgBranding?.brand_color ? { borderColor: orgBranding.brand_color } : {}

    const filteredEnrollments = useMemo(() => {
        return initialEnrollments.filter((enrollment) => {
            const simulation = enrollment.simulations
            const matchesSearch =
                simulation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                simulation.organization_name?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus =
                statusFilter === "All" ||
                (statusFilter === "In Progress" && (enrollment.status === 'in_progress' || enrollment.status === 'not_started')) ||
                (statusFilter === "Completed" && enrollment.status === 'completed')

            return matchesSearch && matchesStatus
        })
    }, [initialEnrollments, searchQuery, statusFilter])

    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display">
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-white/80 px-4 backdrop-blur-md dark:bg-[#1e1429]/80 lg:hidden">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-text-main dark:text-white"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className="flex items-center gap-3">
                    <NotificationDropdown brandColor={orgBranding?.brand_color} />
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-text-main dark:text-white">Vantage</span>
                        <div className="flex size-9 items-center justify-center rounded bg-primary text-white font-black text-xs" style={brandColorStyle}>PV</div>
                    </div>
                </div>
            </div>

            <StudentSidebar
                user={userProfile}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto mt-16 lg:mt-0">
                <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 p-6 lg:p-10">

                    {/* Page Header */}
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white lg:text-4xl">
                                    My Simulations
                                </h1>
                                <p className="max-w-2xl text-base font-medium text-slate-500 dark:text-slate-400 lg:text-lg">
                                    Track your progress and continue your professional journey.
                                </p>
                            </div>

                            {/* Notifications & Avatar */}
                            <div className="hidden items-center gap-4 lg:flex">
                                <NotificationDropdown brandColor={orgBranding?.brand_color} />
                                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white font-black text-sm shadow-lg shadow-primary/20" style={brandColorStyle}>
                                    {userProfile?.first_name?.[0]?.toUpperCase()}{userProfile?.last_name?.[0]?.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <StatusFilters
                                currentFilter={statusFilter}
                                onFilterChange={setStatusFilter}
                                brandColor={orgBranding?.brand_color}
                            />

                            <div className="relative w-full lg:w-96">
                                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search your simulations..."
                                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-white/5 dark:text-white outline-none transition-all shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Simulation Grid / Empty State */}
                    {filteredEnrollments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEnrollments.map((enrollment) => (
                                <SimulationCard
                                    key={enrollment.id}
                                    simulation={enrollment.simulations}
                                    status={enrollment.status}
                                    progress={enrollment.progress_percentage}
                                    showProgress={true}
                                    brandColor={orgBranding?.brand_color}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Rocket}
                            title={searchQuery ? "No simulations found" : "No simulations yet"}
                            description={searchQuery
                                ? "No simulations match your current search or filter criteria."
                                : "You haven't enrolled in any simulations yet. Visit the library to find something that matches your career goals!"
                            }
                            ctaLabel={searchQuery ? "Clear Search" : "Explore Library"}
                            ctaHref={searchQuery ? undefined : "/student/library"}
                            brandColor={orgBranding?.brand_color}
                            className="min-h-[400px]"
                        />
                    )}
                </div>

                {/* Footer */}
                <footer className="mt-auto border-t border-border-color bg-white px-8 py-12 dark:bg-[#1e1429] dark:border-white/10"
                    style={orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {}}>
                    <div className="mx-auto max-w-[1400px]">
                        <p className="text-white text-center font-medium opacity-80">
                            {orgBranding?.footer_text || "© 2026 Priminent Vantage. Shaping tomorrow's workforce."}
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    )
}
