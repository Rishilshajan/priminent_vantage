"use client"

import React from "react"
import Image from "next/image"
import { ExternalLink, Calendar, ShieldCheck, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface CertificateCardProps {
    certificate: {
        id: string;
        certificate_id: string;
        simulation_title: string;
        student_name: string;
        issued_at: string;
        skills_acquired: string[];
        verification_url?: string;
        simulations?: {
            title: string;
            organizations: {
                name: string;
                logo_url: string;
            };
        };
    };
    brandColor?: string;
}

export function CertificateCard({ certificate, brandColor }: CertificateCardProps) {
    const brandColorStyle = brandColor ? { backgroundColor: brandColor } : {};
    const brandColorBorder = brandColor ? { borderColor: brandColor } : {};
    const brandColorText = brandColor ? { color: brandColor } : {};

    const orgName = certificate.simulations?.organizations?.name || "Global Partner";
    const orgLogo = certificate.simulations?.organizations?.logo_url || "/placeholder-company.png";
    const simTitle = certificate.simulations?.title || certificate.simulation_title;

    const formattedDate = new Date(certificate.issued_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="group flex flex-col overflow-hidden rounded-[32px] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 dark:border-white/5 dark:bg-[#1e1429] dark:shadow-none lg:rounded-[40px] lg:p-8">
            {/* Header: Org Logo & Badge */}
            <div className="mb-6 flex items-start justify-between lg:mb-8">
                <div className="relative size-14 overflow-hidden rounded-xl bg-slate-50 p-2 dark:bg-white/5 lg:size-16 lg:rounded-2xl">
                    <Image
                        src={orgLogo}
                        alt={orgName}
                        fill
                        className="object-contain p-2"
                    />
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-green-600 dark:bg-green-500/10 dark:text-green-400 lg:gap-2 lg:px-4 lg:py-2 lg:text-[10px]">
                    <ShieldCheck size={12} className="lg:size-[14px]" />
                    <span>Verified</span>
                </div>
            </div>

            {/* Content */}
            <div className="mb-6 flex-1 lg:mb-8">
                <div className="mb-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Awarded to</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white leading-tight">{certificate.student_name}</p>
                </div>
                <h3 className="mb-4 text-xl font-black leading-tight text-slate-900 group-hover:text-primary dark:text-white transition-colors lg:text-2xl">
                    {simTitle}
                </h3>

                <div className="flex flex-wrap gap-2">
                    {certificate.skills_acquired?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-white/5 dark:text-slate-400 lg:px-3 lg:py-1.5 lg:text-[11px]">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Footer Metadata */}
            <div className="mb-6 flex items-center gap-4 border-y border-slate-50 py-4 dark:border-white/5 lg:mb-8 lg:gap-6 lg:py-6">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 lg:text-[10px]">Issued Date</span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white lg:gap-2 lg:text-sm">
                        <Calendar size={12} className="text-slate-400 lg:size-[14px]" />
                        {formattedDate}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 lg:text-[10px]">Credential ID</span>
                    <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-400 lg:text-sm">{certificate.certificate_id}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-[1.02] hover:bg-primary active:scale-95 dark:bg-white/10 dark:hover:bg-primary lg:gap-3 lg:rounded-2xl lg:py-4 lg:text-[12px]"
                    style={brandColorStyle}
                >
                    <Download size={16} className="lg:size-[18px]" />
                    <span>Download</span>
                </button>
                <a
                    href={certificate.verification_url || "#"}
                    target="_blank"
                    className="flex size-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-white lg:size-14 lg:rounded-2xl"
                >
                    <ExternalLink size={18} className="lg:size-5" />
                </a>
            </div>
        </div>
    )
}
