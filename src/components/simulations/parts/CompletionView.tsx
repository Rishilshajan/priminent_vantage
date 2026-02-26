"use client"

import React, { useEffect, useState } from "react";
import { Trophy, ArrowLeft, Download, Share2, PartyPopper, Medal, CheckCircle2 } from "lucide-react";
import { OfficialCertificate } from "@/components/student/OfficialCertificate";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CompletionViewProps {
    simulation: any;
    userData: any;
    orgBranding: any;
    certificateData: any;
}

export function CompletionView({ simulation, userData, orgBranding, certificateData }: CompletionViewProps) {
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 10000); // 10 seconds of confetti
        return () => clearTimeout(timer);
    }, []);

    const brandColor = orgBranding?.brand_color || "#4e2a84";
    const brandBgStyle = { backgroundColor: brandColor };
    const brandTextStyle = { color: brandColor };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f0a19] flex flex-col items-center py-20 px-6 overflow-x-hidden relative">
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={200}
                    recycle={false}
                    colors={[brandColor, '#f472b6', '#3b82f6', '#10b981', '#fbbf24']}
                />
            )}

            <div className="max-w-4xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Header Section */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center size-24 rounded-[32px] bg-white dark:bg-white/5 shadow-2xl relative mb-4">
                        <div className="absolute inset-0 rounded-[32px] bg-primary/10 blur-xl animate-pulse" style={{ backgroundColor: `${brandColor}20` }} />
                        <PartyPopper className="size-10 text-primary relative" style={brandTextStyle} />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                            Congratulations, {userData?.first_name || 'Student'}!
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            You have successfully completed the <span className="text-slate-900 dark:text-white font-black">{simulation.title}</span> simulation program.
                        </p>
                    </div>
                </div>

                {/* Certificate Showcase */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-[48px] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" style={{ backgroundImage: `linear-gradient(to right, ${brandColor}20, #a855f720, ${brandColor}20)` }} />
                    <div className="relative">
                        <h3 className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Generated Verified Credential</h3>
                        <div className="max-w-2xl mx-auto scale-100 md:scale-105 transform transition-transform duration-700 hover:scale-[1.07]">
                            {certificateData && (
                                <OfficialCertificate
                                    certificate={certificateData}
                                    brandColor={brandColor}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                    <div className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-slate-100 dark:border-white/5 text-center space-y-3 shadow-sm">
                        <div className="size-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto text-slate-400">
                            <CheckCircle2 className="size-6" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">100% Completed</p>
                    </div>
                    <div className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-slate-100 dark:border-white/5 text-center space-y-3 shadow-sm">
                        <div className="size-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto text-slate-400">
                            <Medal className="size-6" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Skills Verified</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{simulation.skills?.length || 3} Core Skills</p>
                    </div>
                    <div className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-slate-100 dark:border-white/5 text-center space-y-3 shadow-sm">
                        <div className="size-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto text-slate-400">
                            <Trophy className="size-6" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">Professional Badge</p>
                    </div>
                </div>

                {/* Navigation Actions */}
                <div className="pt-12 flex flex-col items-center gap-8">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/student/dashboard"
                            className="flex items-center gap-3 px-10 py-5 rounded-[24px] bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 dark:bg-white/10 dark:hover:bg-white/20"
                        >
                            <ArrowLeft className="size-4" /> Go to Dashboard
                        </Link>
                        <button
                            className="flex items-center gap-3 px-10 py-5 rounded-[24px] text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105 active:scale-95"
                            style={brandBgStyle}
                        >
                            <Share2 className="size-4" /> Share Achievement
                        </button>
                    </div>

                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        Awarded on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
}
