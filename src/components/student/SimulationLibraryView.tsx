"use client"

import { useState, useMemo } from "react"
import { Search, Zap, Trophy, Clock, Filter, ChevronRight, Rocket, Building2, Calendar, Menu, X, Bell } from "lucide-react"
import { enrollInSimulation } from "@/actions/student/simulation.actions"
import { useRouter } from "next/navigation"
import { INDUSTRIES } from "@/lib/simulations"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { StudentSidebar } from "./StudentSidebar"
import { NotificationDropdown } from "./NotificationDropdown"

interface SimulationLibraryViewProps {
    initialSims: any[];
    userProfile: any;
    orgBranding?: any;
}

const CATEGORIES = ["All Industries", ...INDUSTRIES];

export function SimulationLibraryView({ initialSims, userProfile, orgBranding }: SimulationLibraryViewProps) {
    const [sims, setSims] = useState(initialSims);
    const [selectedCategory, setSelectedCategory] = useState("All Industries");
    const [searchQuery, setSearchQuery] = useState("");
    const [enrollingId, setEnrollingId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    const brandColorStyle = orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {};
    const brandColorText = orgBranding?.brand_color ? { color: orgBranding.brand_color } : {};
    const brandBorderColor = orgBranding?.brand_color ? { borderColor: orgBranding.brand_color } : {};

    const filteredSims = useMemo(() => {
        return sims.filter(sim => {
            const matchesCategory = selectedCategory === "All Industries" || sim.industry === selectedCategory;
            const matchesSearch = sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sim.short_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sim.organization_name?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [sims, selectedCategory, searchQuery]);

    const handleEnroll = async (simId: string) => {
        setEnrollingId(simId);
        try {
            const result = await enrollInSimulation(simId);
            if (result.success) {
                // Update local state to show enrolled
                setSims(prev => prev.map(s => s.id === simId ? { ...s, isEnrolled: true } : s));
                router.refresh();
            } else {
                alert(result.error || "Failed to enroll");
            }
        } catch (err) {
            console.error("Enrollment error:", err);
            alert("An unexpected error occurred");
        } finally {
            setEnrollingId(null);
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
                user={userProfile}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto mt-16 lg:mt-0">
                <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 p-6 lg:p-10">
                    {/* Library Header */}
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                    Simulation Library
                                </h1>
                                <p className="max-w-2xl text-lg font-medium text-slate-500 dark:text-slate-400">
                                    Discover immersive professional experiences from top organizations across the globe.
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

                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search simulations, roles, or companies..."
                                className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-white/5 dark:text-white outline-none transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "rounded-full px-6 py-2.5 text-sm font-bold transition-all",
                                    selectedCategory === cat
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                                )}
                                style={selectedCategory === cat ? brandColorStyle : {}}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Simulation Grid */}
                    {filteredSims.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredSims.map((sim) => (
                                <div
                                    key={sim.id}
                                    className="group flex flex-col overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 dark:border-white/5 dark:bg-[#1e1429] dark:shadow-none"
                                >
                                    {/* Card Image Wrapper */}
                                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                                        {sim.banner_url ? (
                                            <Image
                                                src={sim.banner_url}
                                                alt={sim.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-indigo-500/20">
                                                <Zap className="size-12 text-primary opacity-20" />
                                            </div>
                                        )}

                                        {/* Badge */}
                                        <div className="absolute left-6 top-6">
                                            <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 backdrop-blur-md dark:bg-black/50">
                                                <div className="size-2 rounded-full bg-primary animate-pulse" style={brandColorStyle} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                                                    {sim.industry || "General"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex flex-1 flex-col p-8 lg:p-10">
                                        <div className="flex-1 space-y-4">
                                            <h3 className="line-clamp-2 text-xl font-black leading-tight text-slate-900 dark:text-white lg:text-2xl min-h-[3.5rem]">
                                                {sim.title}
                                            </h3>

                                            {/* Company Info Box */}
                                            <div className="rounded-[24px] bg-slate-50 p-6 dark:bg-white/5 transition-colors group-hover:bg-primary/[0.03]">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Partnering Organization</p>
                                                    <p className="text-base font-bold text-slate-900 dark:text-white">{sim.organization_name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                                                        <Calendar size={12} /> Published {formatDate(sim.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Footer Actions */}
                                        <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 dark:border-white/5 pt-8">
                                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                                                <span className="flex items-center gap-2"><Trophy size={14} className="text-amber-500" /> +250 XP</span>
                                                <span className="flex items-center gap-2"><Clock size={14} /> {sim.duration || "Self-paced"}</span>
                                            </div>

                                            {sim.isEnrolled ? (
                                                <button
                                                    onClick={() => router.push(`/student/simulations/${sim.id}`)}
                                                    className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-slate-100 text-[12px] font-black uppercase tracking-[0.2em] text-slate-600 transition-all hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                                >
                                                    <Rocket size={18} />
                                                    Resume Simulation
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleEnroll(sim.id)}
                                                    disabled={enrollingId === sim.id}
                                                    className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-primary text-[12px] font-black uppercase tracking-[0.2em] text-white shadow-[0_8px_20px_-4px_rgba(127,19,236,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_12px_24px_-4px_rgba(127,19,236,0.4)] active:scale-95 disabled:opacity-50"
                                                    style={brandColorStyle}
                                                >
                                                    {enrollingId === sim.id ? (
                                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                    ) : (
                                                        <>
                                                            <Zap size={18} className="fill-current" />
                                                            Enroll Now
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-white/5 rounded-[40px] border border-dashed border-slate-200 dark:border-white/10">
                            <div className="size-20 rounded-full bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm">
                                <Filter className="size-10 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No matching simulations</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
                            <button
                                onClick={() => { setSelectedCategory("All Industries"); setSearchQuery(""); }}
                                className="mt-6 text-primary font-bold hover:underline"
                                style={brandColorText}
                            >
                                Reset all filters
                            </button>
                        </div>
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
