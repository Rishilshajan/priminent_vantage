"use client";

import { useState, useEffect, useRef } from "react";
import { getSimulation, updateSimulation, uploadAsset } from "@/actions/simulations";
import { Simulation } from "@/lib/simulations";
import {
    Award,
    ArrowLeft,
    CheckCircle2,
    QrCode,
    Printer,
    Share2,
    Verified,
    Activity,
    Globe,
    Upload
} from "lucide-react";
import QRCode from "react-qr-code";
import { cn } from "@/lib/utils";

interface CertificationSetupProps {
    simulationId: string;
    organizationName: string;
    saveTrigger?: number;
    onSaveSuccess?: () => void;
    onBack: () => void;
    onNext?: () => void;
    orgBranding?: any;
}

export default function CertificationSetup({
    simulationId,
    organizationName,
    saveTrigger,
    onSaveSuccess,
    onBack,
    onNext,
    orgBranding
}: CertificationSetupProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [simulation, setSimulation] = useState<Simulation | null>(null);
    const [directorName, setDirectorName] = useState("");
    const [directorTitle, setDirectorTitle] = useState("");
    const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

    // Save Trigger Logic
    const lastSaveTrigger = useRef(saveTrigger || 0);

    useEffect(() => {
        loadSimulation();
    }, [simulationId]);

    // Sync with Org Branding
    useEffect(() => {
        if (orgBranding) {
            // Only update if org has values. This ensures we prioritize org but fall back to simulation if needed.
            setDirectorName(orgBranding.certificate_director_name || simulation?.certificate_director_name || directorName);
            setDirectorTitle(orgBranding.certificate_director_title || simulation?.certificate_director_title || directorTitle);
            setSignatureUrl(orgBranding.certificate_signature_url || simulation?.certificate_signature_url || signatureUrl);
        }
    }, [orgBranding]);


    useEffect(() => {
        if (saveTrigger && saveTrigger > lastSaveTrigger.current) {
            handleSave();
            lastSaveTrigger.current = saveTrigger;
        }
    }, [saveTrigger]);

    const loadSimulation = async () => {
        if (!simulationId) return;

        try {
            const result = await getSimulation(simulationId);
            if (result.data) {
                setSimulation(result.data);

                // Initialize with values, priority: Org Prop > Simulation DB > State Default
                setDirectorName(orgBranding?.certificate_director_name || result.data.certificate_director_name || "");
                setDirectorTitle(orgBranding?.certificate_director_title || result.data.certificate_director_title || "");
                setSignatureUrl(orgBranding?.certificate_signature_url || result.data.certificate_signature_url || null);
            }
        } catch (error) {
            console.error("Failed to load simulation:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (loading) return;

        setSaving(true);
        // We persist data even if director name is empty, as users might clear it
        // If Org is managed, we save the Org values (prioritizing prop over state to avoid race conditions)
        const result = await updateSimulation(simulationId, {
            certificate_director_name: orgBranding?.certificate_director_name || directorName,
            certificate_director_title: orgBranding?.certificate_director_title || directorTitle,
            certificate_signature_url: orgBranding?.certificate_signature_url || signatureUrl,
            ...(simulation?.certificate_enabled !== undefined && { certificate_enabled: simulation.certificate_enabled })
        });

        if (!result.error) {
            onSaveSuccess?.();
            setSaving(false);
            return true;
        } else {
            console.error("Failed to save certification setup:", result.error);
            alert(`Failed to save: ${result.error}`);
            setSaving(false);
            return false;
        }
    };

    const handleNext = async () => {
        const success = await handleSave();
        if (success) {
            onNext?.();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="text-slate-400">Loading...</span>
            </div>
        );
    }

    const skills = simulation?.simulation_skills?.map(s => s.skill_name) || ["FinTech Analysis", "Strategic Risk", "Market Modeling"];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Inject Fonts for Certificate Preview ONLY */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@600&display=swap');
                .font-certificate-title { font-family: 'Playfair Display', serif; }
                .font-signature { font-family: 'Dancing Script', cursive; }
            `}} />

            {/* Standard Header */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm space-y-8">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Certificate Configuration
                    </h2>
                    <p className="text-sm text-slate-500">
                        Customize the credentials and verification details for student certificates.
                    </p>
                </div>

                {/* Signatory Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Signatory Details */}
                    <div className="space-y-6">
                        {orgBranding?.certificate_director_name ? (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Verified className="size-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Universal Management Active</p>
                                    <p className="text-xs text-slate-500 mt-1">Signatory details are strictly enforced by organization policies.</p>
                                </div>
                                <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Signatory</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{directorName}</p>
                                    <p className="text-[10px] font-medium text-slate-500">{directorTitle}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-100 dark:border-amber-900/30 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-full">
                                    <Award className="size-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-amber-900 dark:text-amber-100">Setup Required</p>
                                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                        Signatory details must be configured in <b>Organization Branding</b> settings.
                                    </p>
                                </div>
                                <button
                                    onClick={() => window.open('/enterprise/settings?tab=branding', '_blank')}
                                    className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider border border-amber-200 dark:border-amber-800 px-4 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                                >
                                    Go to Settings
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Verification Features List */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 h-fit">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                            Active Verification Features
                        </h4>
                        <div className="space-y-3">
                            {[
                                { icon: <QrCode size={14} />, label: "Dynamic QR Verification", active: true },
                                { icon: <Activity size={14} />, label: "Skills Achievement Ledger", active: true },
                                { icon: <Share2 size={14} />, label: "LinkedIn Integration", active: true },
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`size-6 rounded-full flex items-center justify-center ${feature.active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <CheckCircle2 size={12} />
                                    </div>
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{feature.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                {/* Strategic Note */}
                <div className="flex gap-3 items-start p-4 bg-primary/5 rounded-xl border border-primary/10 w-full">
                    <Activity size={16} className="text-primary mt-0.5 shrink-0" />
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Dual-Branded Credential
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            The certificate is co-branded with Vantage and your organization to maximize talent brand exposure.
                        </p>
                    </div>
                </div>

                {/* Bottom: Certificate Preview */}
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 text-center">
                        Certificate Preview
                    </h3>

                    {/* Right Column: Preview */}
                    <div className="space-y-4">
                        <div className="flex flex-col items-center space-y-8">
                            {/* Certificate Template Container */}
                            <div className="w-full flex justify-center">
                                {/* 
                                    Certificate Aspect Ratio: 1600/1131 (approx 1.414) 
                                    Export Requirement: 3508 x 2480 px (300 DPI) for PDF 
                                */}
                                <div className="relative w-full max-w-[1600px] aspect-[0.7] md:aspect-[1600/1131] bg-white text-slate-800 shadow-2xl rounded-lg md:rounded-2xl overflow-hidden border-[4px] md:border-[14px] border-[#e8e1f0] px-1 pt-3 pb-2 md:px-12 md:py-6 flex flex-col justify-between select-none">

                                    {/* Top Premium Strip */}
                                    <div className="absolute top-0 left-0 w-full h-1.5 md:h-3 bg-[#4e2a84]" />

                                    {/* Watermark Grid */}
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                                        style={{ backgroundImage: 'radial-gradient(circle, #4e2a84 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                                    {/* Certificate Content */}
                                    <div className="relative z-10 h-full flex flex-col justify-between space-y-2 md:space-y-5">
                                        {/* Header */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <div className="bg-[#4e2a84] p-1 md:p-1.5 rounded md:rounded-lg">
                                                    <Activity className="size-3 md:size-5 text-white" />
                                                </div>
                                                <span className="font-bold text-[8px] md:text-base tracking-tight text-[#4e2a84] uppercase">
                                                    Priminent Vantage
                                                </span>
                                            </div>
                                            {(orgBranding?.logo_url || simulation?.company_logo_url) ? (
                                                <img src={orgBranding?.logo_url || simulation?.company_logo_url} className="h-6 md:h-10 object-contain" alt="Company Logo" />
                                            ) : (
                                                <div className="px-2 py-1 md:px-3 md:py-1.5 border border-dashed border-slate-200 rounded text-[6px] md:text-[10px] font-bold text-slate-300 uppercase">
                                                    Company Logo
                                                </div>
                                            )}
                                        </div>

                                        {/* Main Title Area */}
                                        <div className="text-center space-y-1.5 md:space-y-4">
                                            <div className="space-y-0.5 md:space-y-1">
                                                <h2 className="text-xl md:text-4xl lg:text-5xl font-certificate-title font-bold uppercase tracking-wide text-slate-900 leading-none">
                                                    Certificate of Completion
                                                </h2>
                                                <div className="w-8 md:w-16 h-0.5 md:h-1 bg-[#4e2a84] mx-auto rounded-full opacity-20" />
                                                <p className="text-[8px] md:text-base italic text-slate-500 tracking-wide">
                                                    This certifies that
                                                </p>
                                            </div>

                                            <div className="space-y-1 md:space-y-2">
                                                <h3 className="text-2xl md:text-5xl lg:text-6xl font-certificate-title text-[#4e2a84] tracking-tight">
                                                    John Doe
                                                </h3>
                                                <div className="max-w-2xl mx-auto">
                                                    <p className="text-[8px] md:text-base text-slate-600 leading-relaxed px-2 md:px-4">
                                                        Has successfully completed the <span className="font-bold text-slate-900 border-b md:border-b-2 border-[#e8e1f0]">{simulation?.title || "Professional Strategy"}</span> <span className="capitalize">{simulation?.program_type?.replace(/_/g, ' ') || "job simulation"}</span>, demonstrating professional excellence and industry readiness.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer / Signatures */}
                                        <div className="mt-1 md:mt-2 border-t border-slate-100 pt-1.5 md:pt-2">
                                            <div className="flex justify-between items-end mb-1.5 md:mb-2 px-4 md:px-12">
                                                {/* Left Signature - Vantage CEO */}
                                                <div className="text-center w-24 md:w-56 space-y-0.5 md:space-y-1 relative">
                                                    <div className="pb-1 md:pb-2 leading-none">
                                                        <p className="text-[7px] md:text-sm font-bold text-slate-800 uppercase tracking-wider">A. Sterling</p>
                                                        <p className="text-[6px] md:text-xs font-medium text-slate-600 uppercase tracking-wide">CEO, Priminent Vantage</p>
                                                    </div>

                                                    <div className="border-t border-slate-300 pt-0.5 md:pt-1 flex justify-center">
                                                        <div className="font-signature text-sm md:text-2xl text-slate-800 h-6 md:h-10 flex items-center justify-center transform -rotate-2">
                                                            A. Sterling
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Signature - Company Head */}
                                                <div className="text-center w-24 md:w-56 space-y-0.5 md:space-y-1 relative">
                                                    <div className="pb-1 md:pb-2 leading-none">
                                                        <p className="text-[7px] md:text-sm font-bold text-slate-800 uppercase tracking-wider">
                                                            {orgBranding?.certificate_director_name || directorName || "James Thompson"}
                                                        </p>
                                                        <p className="text-[6px] md:text-xs font-medium text-slate-600 uppercase tracking-wide">
                                                            {orgBranding?.certificate_director_title || directorTitle || "Hiring Director"}, {orgBranding?.name || organizationName || "Your Company"}
                                                        </p>
                                                    </div>

                                                    <div className="border-t border-slate-300 pt-0.5 md:pt-1 flex justify-center">
                                                        {(orgBranding?.certificate_signature_url || signatureUrl) ? (
                                                            <div className="h-6 md:h-10 flex items-center justify-center">
                                                                <img src={orgBranding?.certificate_signature_url || signatureUrl} className="max-h-full max-w-full object-contain filter grayscale contrast-125" alt="Signature" />
                                                            </div>
                                                        ) : (
                                                            <div className="font-signature text-sm md:text-2xl text-slate-800 h-6 md:h-10 flex items-center justify-center transform -rotate-2">
                                                                {directorName || "James Thompson"}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Verification Footer */}
                                            <div className="flex justify-between items-center text-[5px] md:text-[10px] text-slate-400 font-mono border-t border-slate-50 pt-1 px-1">
                                                <div className="flex items-center gap-1 md:gap-2">
                                                    <div className="size-1 md:size-1.5 rounded-full bg-[#4e2a84]" />
                                                    <span>ID: PV-{simulationId?.slice(0, 8).toUpperCase() || "DEMO"}</span>
                                                </div>

                                                <div className="text-right flex items-center gap-2 md:gap-4">
                                                    <div className="space-y-0">
                                                        <div className="uppercase tracking-wider">Issued: {new Date().toLocaleDateString()}</div>
                                                    </div>

                                                    <div className="bg-white p-0.5 md:p-1 border border-slate-100 shadow-sm rounded md:rounded-md">
                                                        {/* Dynamic QR Placeholder */}
                                                        <QrCode className="size-5 md:size-10 text-[#4e2a84]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={saving}
                        className="px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? "Saving..." : "Continue to Visibility"}
                    </button>
                </div>
            </div >
        </div >
    );
}
