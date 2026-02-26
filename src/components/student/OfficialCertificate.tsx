"use client";

import React from "react";
import { Activity, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfficialCertificateProps {
    certificate: {
        certificate_id: string;
        simulation_title: string;
        student_name: string;
        issued_at: string;
        completion_date?: string;
        skills_acquired?: string[];
        simulations?: {
            title: string;
            program_type?: string;
            organizations: {
                name: string;
                logo_url: string;
                brand_color?: string;
                certificate_director_name?: string;
                certificate_director_title?: string;
                certificate_signature_url?: string;
            };
        };
    };
    brandColor?: string;
    className?: string;
}

export function OfficialCertificate({ certificate, brandColor, className }: OfficialCertificateProps) {
    const sim = Array.isArray(certificate.simulations) ? certificate.simulations[0] : certificate.simulations;
    const org = Array.isArray(sim?.organizations) ? sim?.organizations[0] : sim?.organizations;

    const finalBrandColor = org?.brand_color || brandColor || "#4e2a84";

    const signatoryName = org?.certificate_director_name || "A. Sterling"; // Fallback to Sterling if org director is missing
    const signatoryTitle = org?.certificate_director_title || "CEO";
    const signatureUrl = org?.certificate_signature_url;
    const orgName = org?.name || "Global Partner";

    // Fallback order: Org Logo > Sim Logo > Vantage Logo (Activity Icon handled below)
    const orgLogo = org?.logo_url || sim?.company_logo_url;

    const simTitle = sim?.title || certificate.simulation_title;
    const programType = sim?.program_type || "job simulation";

    const formattedDate = new Date(certificate.issued_at).toLocaleDateString();

    return (
        <div className={cn("w-full flex justify-center", className)}>
            {/* Inject Fonts for Certificate Preview ONLY */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@600&display=swap');
                .font-certificate-title { font-family: 'Playfair Display', serif; }
                .font-signature { font-family: 'Dancing Script', cursive; }
            `}} />

            {/* 
                Certificate Aspect Ratio: 1600/1131 (approx 1.414) 
                Export Requirement: 3508 x 2480 px (300 DPI) for PDF 
            */}
            <div className="relative w-full max-w-[1000px] aspect-[1600/1131] bg-white text-slate-800 shadow-2xl rounded-lg md:rounded-2xl overflow-hidden border-[4px] md:border-[12px] border-[#e8e1f0] px-4 py-4 md:px-12 md:py-8 flex flex-col justify-between select-none">

                {/* Top Premium Strip */}
                <div
                    className="absolute top-0 left-0 w-full h-1 md:h-2"
                    style={{ backgroundColor: finalBrandColor }}
                />

                {/* Watermark Grid */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle, ${finalBrandColor} 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Certificate Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 md:gap-2">
                            <div className="p-1 md:p-1.5 rounded md:rounded-lg" style={{ backgroundColor: finalBrandColor }}>
                                <Activity className="size-3 md:size-5 text-white" />
                            </div>
                            <span className="font-bold text-[8px] md:text-sm tracking-tight uppercase" style={{ color: finalBrandColor }}>
                                Priminent Vantage
                            </span>
                        </div>
                        {orgLogo && (
                            <img src={orgLogo} className="h-6 md:h-10 object-contain" alt={orgName} />
                        )}
                    </div>

                    {/* Main Title Area */}
                    <div className="text-center space-y-2 md:space-y-6">
                        <div className="space-y-1 md:space-y-2">
                            <h2 className="text-xl md:text-4xl lg:text-5xl font-certificate-title font-bold uppercase tracking-wide text-slate-900 leading-none">
                                Certificate of Completion
                            </h2>
                            <div
                                className="w-12 md:w-24 h-0.5 md:h-1 mx-auto rounded-full opacity-20"
                                style={{ backgroundColor: finalBrandColor }}
                            />
                            <p className="text-[10px] md:text-base italic text-slate-500 tracking-wide">
                                This certifies that
                            </p>
                        </div>

                        <div className="space-y-2 md:space-y-4">
                            <h3 className="text-2xl md:text-5xl lg:text-6xl font-certificate-title tracking-tight" style={{ color: finalBrandColor }}>
                                {certificate.student_name}
                            </h3>
                            <div className="max-w-2xl mx-auto">
                                <p className="text-[8px] md:text-base text-slate-600 leading-relaxed px-2">
                                    Has successfully completed the <span className="font-bold text-slate-900 border-b border-[#e8e1f0]">{simTitle}</span> <span className="capitalize">{programType.replace(/_/g, ' ')}</span>, demonstrating professional excellence and industry readiness.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="mt-4 border-t border-slate-100 pt-4">
                        <div className="flex justify-between items-end mb-4 px-6 md:px-16">
                            {/* Left Signature - Vantage CEO */}
                            <div className="text-center w-28 md:w-56 space-y-1 md:space-y-2 relative">
                                <div className="pb-1 md:pb-2 leading-none">
                                    <p className="text-[7px] md:text-xs font-bold text-slate-800 uppercase tracking-wider">A. Sterling</p>
                                    <p className="text-[6px] md:text-[10px] font-medium text-slate-500 uppercase tracking-wide">CEO, Priminent Vantage</p>
                                </div>

                                <div className="border-t border-slate-300 pt-1 md:pt-2 flex justify-center">
                                    <div className="font-signature text-sm md:text-2xl text-slate-800 h-6 md:h-10 flex items-center justify-center transform -rotate-2">
                                        A. Sterling
                                    </div>
                                </div>
                            </div>

                            {/* Right Signature - Company Head */}
                            <div className="text-center w-28 md:w-56 space-y-1 md:space-y-2 relative">
                                <div className="pb-1 md:pb-2 leading-none">
                                    <p className="text-[7px] md:text-xs font-bold text-slate-800 uppercase tracking-wider">
                                        {signatoryName}
                                    </p>
                                    <p className="text-[6px] md:text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                                        {signatoryTitle}, {orgName}
                                    </p>
                                </div>

                                <div className="border-t border-slate-300 pt-1 md:pt-2 flex justify-center">
                                    {signatureUrl ? (
                                        <div className="h-6 md:h-10 flex items-center justify-center">
                                            <img src={signatureUrl} className="max-h-full max-w-full object-contain filter grayscale contrast-125" alt="Signature" />
                                        </div>
                                    ) : (
                                        <div className="font-signature text-sm md:text-2xl text-slate-800 h-6 md:h-10 flex items-center justify-center transform -rotate-2">
                                            {signatoryName}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Verification Footer */}
                        <div className="flex justify-between items-center text-[6px] md:text-[10px] text-slate-400 font-mono border-t border-slate-50 pt-2 px-2">
                            <div className="flex items-center gap-1 md:gap-2">
                                <div className="size-1 md:size-1.5 rounded-full" style={{ backgroundColor: finalBrandColor }} />
                                <span>ID: PV-{certificate.certificate_id?.replace('CERT-', '').slice(0, 12).toUpperCase()}</span>
                            </div>

                            <div className="text-right flex items-center gap-2 md:gap-4">
                                <div className="uppercase tracking-wider">Issued: {formattedDate}</div>
                                <div className="bg-white p-0.5 md:p-1 border border-slate-100 shadow-sm rounded md:rounded-md">
                                    <QrCode className="size-4 md:size-8" style={{ color: finalBrandColor }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
