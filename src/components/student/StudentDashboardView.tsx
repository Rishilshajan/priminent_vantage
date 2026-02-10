"use client"

import { Plus } from "lucide-react"
import { StudentSidebar } from "./StudentSidebar"
import { StatsCards } from "./StatsCards"
import { CurrentSimulations } from "./CurrentSimulations"
import { RecommendedSimulations } from "./RecommendedSimulations"

interface StudentDashboardViewProps {
    profile: any
}

export default function StudentDashboardView({ profile }: StudentDashboardViewProps) {
    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display">
            <StudentSidebar user={profile} />

            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 p-6 lg:p-10">
                    {/* Header Section */}
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold leading-tight tracking-tight text-text-main dark:text-white lg:text-4xl">
                                Ready for your next challenge, {profile?.first_name || 'Student'}?
                            </h1>
                            <p className="text-base text-text-secondary dark:text-gray-400">
                                You have 2 active simulations and 15 skills to master.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative hidden sm:block">
                                <input
                                    className="h-12 w-48 rounded-lg border border-border-color bg-white px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:bg-white/5 dark:border-white/10 dark:text-white outline-none transition-all"
                                    placeholder="Enter class code..."
                                    type="text"
                                />
                            </div>
                            <button className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark">
                                <Plus className="size-5" />
                                <span>Join with Code</span>
                            </button>
                        </div>
                    </div>

                    <StatsCards />
                    <CurrentSimulations />
                    <RecommendedSimulations />

                    <footer className="pb-10 pt-4 text-center text-sm text-text-secondary dark:text-gray-500">
                        © 2026 Priminent Vantage. Empowering future careers through simulation.
                    </footer>
                </div>
            </main>
        </div>
    )
}
