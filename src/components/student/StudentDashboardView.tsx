"use client"

import { useState, useEffect } from "react"
import { Plus, Menu, X, Bell, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { StudentSidebar } from "./StudentSidebar"
import { StatsCards } from "./StatsCards"
import { CurrentSimulations } from "./CurrentSimulations"
import { RecommendedSimulations } from "./RecommendedSimulations"
import { NotificationDropdown } from "./NotificationDropdown"

interface StudentDashboardViewProps {
    profile: any
}

export default function StudentDashboardView({ profile: initialProfile }: StudentDashboardViewProps) {
    const [orgBranding, setOrgBranding] = useState<any>(null);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [joining, setJoining] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Branding
                const { getOrganizationBranding } = await import("@/actions/enterprise/enterprise-management.actions");
                const brandResult = await getOrganizationBranding();
                if (brandResult && brandResult.success && brandResult.data) {
                    setOrgBranding(brandResult.data);
                }

                // Fetch Dashboard Data
                const { getStudentDashboardData } = await import("@/actions/student/simulation.actions");
                const result = await getStudentDashboardData();
                if (result.success) {
                    setDashboardData(result.data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const profile = dashboardData?.profile || initialProfile;
    const stats = dashboardData?.stats || { inProgress: 0, completed: 0, skillPoints: 0, rank: "Beginner" };

    // Brand color style
    const brandColorStyle = orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {};

    const handleJoinCode = async () => {
        if (!joinCode || joinCode.length < 6) {
            alert("Please enter a valid access code.");
            return;
        }

        setJoining(true);
        try {
            const { joinByAccessCode } = await import("@/actions/student/simulation.actions");
            const result = await joinByAccessCode(joinCode);

            if (result.success) {
                if (result.message) alert(result.message);
                router.push(`/student/simulations/${result.simulationId}/preview`);
            } else {
                alert(result.error || "Failed to join simulation. Please check the code.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while joining.");
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" style={{ borderTopColor: orgBranding?.brand_color }}></div>
        </div>;
    }

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
                user={profile}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 p-6 lg:p-10">
                    {/* Header Section */}
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl font-black leading-tight    text-text-main dark:text-white lg:text-4xl">
                                    Ready for your next challenge, {profile?.first_name || 'Student'}?
                                </h1>
                                <p className="text-base font-medium text-text-secondary dark:text-gray-400">
                                    You have {stats.inProgress} active simulations and {stats.completed} skills to master.
                                </p>
                            </div>

                            {/* Notifications & Avatar */}
                            <div className="hidden items-center gap-4 lg:flex">
                                <NotificationDropdown brandColor={orgBranding?.brand_color} />
                                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white font-black text-sm shadow-lg shadow-primary/20" style={brandColorStyle}>
                                    {profile?.first_name?.[0]?.toUpperCase()}{profile?.last_name?.[0]?.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        {/* Join Code Row */}
                        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-2 dark:bg-white/5 lg:w-fit">
                            <div className="relative w-full sm:w-64">
                                <input
                                    className="h-12 w-full rounded-xl border border-border-color bg-white px-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 dark:bg-[#1e1429] dark:border-white/10 dark:text-white outline-none transition-all shadow-sm"
                                    placeholder="Enter access code..."
                                    type="text"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    onKeyPress={(e) => e.key === 'Enter' && handleJoinCode()}
                                    disabled={joining}
                                />
                            </div>
                            <button
                                onClick={handleJoinCode}
                                disabled={joining || !joinCode}
                                className="flex h-12 items-center justify-center gap-3 rounded-xl bg-primary px-8 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                                style={brandColorStyle}
                            >
                                {joining ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                                <span>{joining ? "Joining..." : "Join Code"}</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex flex-col gap-8">
                        <StatsCards stats={stats} />
                        <CurrentSimulations
                            enrollments={dashboardData?.enrollments || []}
                            orgBranding={orgBranding}
                        />
                        <RecommendedSimulations
                            recommendations={dashboardData?.recommendations || []}
                            orgBranding={orgBranding}
                        />
                    </div>
                </div>

                {/* Premium Footer */}
                <footer className="mt-auto border-t border-border-color bg-white px-8 py-12 dark:bg-[#1e1429] dark:border-white/10" style={brandColorStyle}>
                    <p className="text-white">
                        {orgBranding?.footer_text || "© 2026 Priminent Vantage. Empowering future careers through simulation."}
                    </p>
                </footer>
            </main>
        </div>
    )
}
