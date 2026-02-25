"use client"

import { useState, useEffect } from "react"
import { GraduationCap } from "lucide-react"
import { EducatorSidebar } from "./EducatorSidebar"
import { EducatorStats } from "./EducatorStats"
import { EducatorCurrentSimulations } from "./EducatorCurrentSimulations"
import Link from "next/link"

interface EducatorDashboardViewProps {
    profile: any
}

export default function EducatorDashboardView({ profile }: EducatorDashboardViewProps) {
    const [orgBranding, setOrgBranding] = useState<any>(null);

    useEffect(() => {
        const fetchOrgBranding = async () => {
            try {
                const { getOrganizationBranding } = await import("@/actions/enterprise/enterprise-management.actions");
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
            <EducatorSidebar user={profile} />

            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 p-6 lg:p-10">
                    {/* Header Section */}
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold leading-tight tracking-tight text-text-main dark:text-white lg:text-4xl">
                                Welcome back, {profile?.first_name || 'Educator'}!
                            </h1>
                            <p className="text-base text-text-secondary dark:text-gray-400">
                                You have 3 active simulations and 124 students enrolled.
                            </p>
                        </div>
                    </div>

                    {/* Apply as Educator Banner */}
                    <div className="relative overflow-hidden rounded-2xl p-8 shadow-2xl" style={brandColorStyle}>
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                    <GraduationCap className="size-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Are you an educator?</h3>
                                    <p className="text-sm text-white/90">Apply for Educator Access to unlock advanced features</p>
                                </div>
                            </div>
                            <Link
                                href="/educators/apply"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold shadow-lg transition-all hover:bg-white/90 hover:shadow-xl hover:-translate-y-0.5"
                                style={brandColorText}
                            >
                                <GraduationCap className="size-5" />
                                Apply Now
                            </Link>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="flex flex-col gap-10">
                        <EducatorStats />
                        <EducatorCurrentSimulations orgBranding={orgBranding} />
                    </div>
                </div>
            </main>

            {/* Premium Footer */}
            <footer className="border-t border-border-color bg-white px-8 py-12 dark:bg-[#1e1429] dark:border-white/10" style={brandColorStyle}>
                {orgBranding?.footer_text || "© 2026 Priminent Vantage. Empowering future educators through simulation."}
            </footer>
        </div>
    )
}
