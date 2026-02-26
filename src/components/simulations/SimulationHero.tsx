"use client"

import { useState } from "react"
import { Zap, Trophy, Clock, ShieldCheck, BarChart3, Star } from "lucide-react"
import { enrollInSimulation } from "@/actions/student/simulation.actions"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface SimulationHeroProps {
    simulation: any;
    orgBranding?: any;
    isEnrolled?: boolean;
}

export function SimulationHero({ simulation, orgBranding, isEnrolled }: SimulationHeroProps) {
    const [enrollingId, setEnrollingId] = useState<string | null>(null);
    const router = useRouter();
    const brandColorStyle = orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {};
    const brandColorText = orgBranding?.brand_color ? { color: orgBranding.brand_color } : {};

    const handleEnroll = async () => {
        if (isEnrolled) {
            router.push(`/student/simulations/${simulation.id}/hub`);
            return;
        }

        setEnrollingId(simulation.id);
        try {
            const result = await enrollInSimulation(simulation.id);
            if (result.success) {
                // Redirect to the new Task Hub page
                router.push(`/student/simulations/${simulation.id}/hub`);
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

    const orgName = simulation.organization_name || "Global Tech Partner";

    return (
        <section className="relative overflow-hidden bg-slate-900 py-20 lg:py-32">
            {/* Background Image / Gradient */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: `url(${simulation.banner_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-white max-w-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-10 w-auto bg-white/10 backdrop-blur-md rounded-lg p-2 flex items-center justify-center border border-white/20">
                                <span className="text-xs font-black tracking-widest uppercase opacity-90 truncate max-w-[150px]">
                                    {orgName}
                                </span>
                            </div>
                            <span className="h-6 w-px bg-white/20"></span>
                            <span className="text-xs font-black tracking-widest uppercase opacity-60">
                                Certified Experience
                            </span>
                        </div>

                        <h1 className="font-display text-5xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                            {simulation.title}
                        </h1>

                        <p className="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
                            {simulation.short_description || "Design resilient, scalable infrastructure for global-scale applications. Bridge the gap between theory and world-class engineering practice."}
                        </p>

                        <div className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2 text-primary dark:text-primary-light" style={brandColorText}>
                                <Trophy className="size-5" />
                                Professional Certification
                            </span>
                            <span className="flex items-center gap-2 opacity-60">
                                <Clock className="size-5" />
                                {simulation.duration || "6-8 Hours"}
                            </span>
                            <span className="flex items-center gap-2 opacity-60 ml-4">
                                <Star className="size-5" />
                                <span className="capitalize">{simulation.difficulty_level || "Intermediate"}</span>
                            </span>
                        </div>
                    </div>

                    <div className="lg:justify-self-end w-full max-w-md">
                        <div className="bg-white dark:bg-[#1e1429] rounded-[32px] shadow-2xl p-8 lg:p-10 border border-slate-100 dark:border-white/5">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Get Career Ready</h3>
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Hiring Now
                                </div>
                            </div>

                            <div className="space-y-8 mb-10">
                                <div className="flex gap-4">
                                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                                        <Clock className="size-6 text-primary" style={brandColorText} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white mb-1">Self-paced</p>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Complete whenever it fits your schedule</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                                        <ShieldCheck className="size-6 text-primary" style={brandColorText} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white mb-1">Verifiable Credential</p>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Share your achievement with recruiters</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                                        <BarChart3 className="size-6 text-primary" style={brandColorText} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white mb-1">Industry Context</p>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Real-world scenarios from lead engineers</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleEnroll}
                                disabled={enrollingId === simulation.id}
                                className={cn(
                                    "w-full h-16 rounded-2xl text-[13px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                                    isEnrolled
                                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                                        : "bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                )}
                                style={!isEnrolled ? brandColorStyle : {}}
                            >
                                {enrollingId === simulation.id ? (
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                ) : isEnrolled ? (
                                    <>Already Enrolled</>
                                ) : (
                                    <>
                                        <Zap className="size-5 fill-current" />
                                        Enroll in Simulation
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-6">
                                Free for all registered students
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
