"use client"

import { Trophy, ArrowLeft, Download, Share2, PartyPopper, Medal, CheckCircle2 } from "lucide-react";
import { CertificateCard } from "@/components/student/CertificateCard";

interface CompletionViewProps {
    certificate: any;
    orgBranding: any;
    onBack: () => void;
}

export function CompletionView({ certificate, orgBranding, onBack }: CompletionViewProps) {
    const brandColor = orgBranding?.brand_color || "#4e2a84";

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 animate-in fade-in duration-1000">

            <div className="max-w-5xl mx-auto py-20 px-8 flex flex-col items-center">
                {/* Achievement Header */}
                <div className="text-center space-y-6 mb-16 relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] animate-bounce">
                        <Trophy className="size-3" /> Achievement Unlocked
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        Congratulations, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-emerald-500">
                            {certificate.student_name}!
                        </span>
                    </h1>

                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                        You've successfully completed the <span className="text-slate-900 dark:text-white font-bold">{certificate.simulation_title}</span>. Your hard work and dedication have earned you this verified certification.
                    </p>
                </div>

                {/* Certificate Display */}
                <div className="w-full max-w-3xl transform hover:scale-[1.01] transition-all duration-500 shadow-2xl shadow-purple-500/10 rounded-[40px]">
                    <CertificateCard
                        certificate={certificate}
                        brandColor={brandColor}
                    />
                </div>

                {/* Secondary Stats/Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-16">
                    <div className="p-8 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center gap-4">
                        <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Medal className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Skills Verified</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">{certificate.skills_acquired?.length || 0}</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center gap-4">
                        <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <CheckCircle2 className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Status</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">Professional</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center gap-4">
                        <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <PartyPopper className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Next Step</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">Apply Now</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-20 flex flex-wrap items-center justify-center gap-6 pb-20">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-black dark:hover:text-white transition-all shadow-sm"
                    >
                        <ArrowLeft className="size-4" /> Return to Hub
                    </button>

                    <button
                        className="flex items-center gap-3 px-12 py-5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/20"
                        style={{ backgroundColor: brandColor }}
                    >
                        <Share2 className="size-4" /> Share Achievement
                    </button>
                </div>
            </div>
        </div>
    );
}
