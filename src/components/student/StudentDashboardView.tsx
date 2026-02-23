"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { StudentSidebar } from "./StudentSidebar"
import { StatsCards } from "./StatsCards"
import { CurrentSimulations } from "./CurrentSimulations"
import { RecommendedSimulations } from "./RecommendedSimulations"

interface StudentDashboardViewProps {
    profile: any
}

export default function StudentDashboardView({ profile }: StudentDashboardViewProps) {
    const [orgBranding, setOrgBranding] = useState<any>(null);

    useEffect(() => {
        const fetchOrgBranding = async () => {
            try {
                const { getOrganizationBranding } = await import("@/actions/enterprise");
                const result = await getOrganizationBranding();
                if (result && result.success && result.data) {
                    setOrgBranding(result.data);
                }
            } catch (err) {
                console.error("Failed to fetch org branding", err);
            }
        };
        fetchOrgBranding();
    }, []);

    // Brand color style
    const brandColorStyle = orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {};
    const brandColorText = orgBranding?.brand_color ? { color: orgBranding.brand_color } : {};
    const brandBorderColor = orgBranding?.brand_color ? { borderColor: orgBranding.brand_color } : {};

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
                            <button
                                className="flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90"
                                style={brandColorStyle}
                            >
                                <Plus className="size-5" />
                                <span>Join with Code</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex flex-col gap-8">
                        <StatsCards />
                        <CurrentSimulations orgBranding={orgBranding} />
                        <RecommendedSimulations orgBranding={orgBranding} />
                    </div>
                </div>

                {/* Premium Footer */}
                <footer className="mt-auto border-t border-border-color bg-white px-8 py-12 dark:bg-[#1e1429] dark:border-white/10" style={brandColorStyle}>
                    {orgBranding?.footer_text || "© 2026 Priminent Vantage. Empowering future careers through simulation."}
                </footer>
            </main>
        </div>
    )
}
