"use client";

import { useState, useEffect } from "react";
import { getSimulation, updateSimulation } from "@/actions/simulations";
import { Simulation, SimulationSkill } from "@/lib/simulations";
import {
    Award,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    UserCheck,
    Globe,
    QrCode,
    Printer,
    Share2,
    Verified,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CertificationSetupProps {
    simulationId: string;
    organizationName: string;
    onBack: () => void;
    onNext?: () => void;
}

export default function CertificationSetup({ simulationId, organizationName, onBack, onNext }: CertificationSetupProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [simulation, setSimulation] = useState<Simulation | null>(null);
    const [directorName, setDirectorName] = useState("");

    useEffect(() => {
        loadSimulation();
    }, [simulationId]);

    const loadSimulation = async () => {
        const result = await getSimulation(simulationId);
        if (result.data) {
            setSimulation(result.data);
            setDirectorName(result.data.certificate_director_name || "");
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        await updateSimulation(simulationId, {
            certificate_director_name: directorName
        });
        setSaving(false);
    };

    const handleNext = async () => {
        await handleSave();
        onNext?.();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Architecting Preview...</p>
                </div>
            </div>
        );
    }

    const skills = simulation?.simulation_skills?.map(s => s.skill_name) || ["FinTech Analysis", "Strategic Risk", "Market Modeling"];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@600&display=swap');
                .font-certificate-title { font-family: 'Playfair Display', serif; }
                .font-signature { font-family: 'Dancing Script', cursive; }
            `}} />

            {/* Header Section */}
            <div className="flex items-end justify-between px-6 pb-2">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-sm border border-primary/10">
                            <Award size={24} />
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-3">
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Certification Setup
                                </h2>
                                <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg shadow-primary/20">PREMIUM</span>
                            </div>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-green-500" />
                                Credentialing & Authority
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none">
                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                    Certificate Signature
                                </label>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Company Director</p>
                                        <input
                                            type="text"
                                            value={directorName}
                                            onChange={(e) => setDirectorName(e.target.value)}
                                            placeholder="e.g. James Thompson"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-0 transition-all font-semibold"
                                        />
                                        <p className="text-[10px] text-slate-400 italic">
                                            This name will appear as the "Hiring Manager" on the official certificate.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                    Verification Features
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { icon: <QrCode size={14} />, label: "Dynamic QR Verification" },
                                        { icon: <Activity size={14} />, label: "Skills Achievement Ledger" },
                                        { icon: <Share2 size={14} />, label: "LinkedIn Integration" },
                                        { icon: <Verified size={14} />, label: "Blockchain Validity Check" },
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="size-6 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                {feature.icon}
                                            </div>
                                            <span className="text-xs font-bold">{feature.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            <Verified size={12} />
                            Strategic Note
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed italic">
                            The certificate is dual-branded with Vantage and your organization to maximize talent brand exposure.
                        </p>
                    </div>
                </div>

                {/* Certificate Preview */}
                <div className="lg:col-span-2">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-4">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                                <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                                Achievement Preview
                            </h3>
                            <div className="flex gap-2">
                                <div className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center gap-2 shadow-sm">
                                    <Printer size={12} className="text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Print Ready</span>
                                </div>
                            </div>
                        </div>

                        {/* Certificate Template Container */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                            {/* Certificate UI */}
                            <div className="relative aspect-[1.414/1] bg-white text-slate-800 shadow-2xl rounded-[1.5rem] overflow-hidden border-[12px] border-primary/5 p-16 flex flex-col justify-between selection:bg-primary/20">
                                {/* Watermark Grid */}
                                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                                    style={{ backgroundImage: 'radial-gradient(circle, #5B3FD4 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                                {/* Inner Border */}
                                <div className="absolute inset-4 border border-primary/40 pointer-events-none rounded-lg" />

                                {/* Certificate Content */}
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
                                                <Activity size={24} className="text-white" />
                                            </div>
                                            <span className="font-black text-lg tracking-tighter text-slate-900 uppercase">
                                                Priminent Vantage
                                            </span>
                                        </div>
                                        {simulation?.company_logo_url ? (
                                            <img src={simulation.company_logo_url} className="h-12 object-contain grayscale opacity-60" alt="Partner Logo" />
                                        ) : (
                                            <div className="w-32 h-12 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                Partner Logo
                                            </div>
                                        )}
                                    </div>

                                    {/* Main Title Area */}
                                    <div className="text-center space-y-10">
                                        <div className="space-y-4">
                                            <div className="flex justify-center mb-2">
                                                <Verified size={56} className="text-primary text-opacity-80" />
                                            </div>
                                            <h2 className="text-4xl md:text-5xl font-certificate-title font-bold uppercase tracking-wide text-slate-800 leading-none">
                                                Certificate of Completion
                                            </h2>
                                            <p className="text-lg italic text-slate-500 tracking-wide">
                                                Issued by <span className="font-semibold text-slate-700">Priminent Vantage</span> in collaboration with <span className="font-semibold text-slate-700">{organizationName}</span>
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-600">
                                                This certificate is proudly presented to
                                            </p>
                                            <h3 className="text-6xl md:text-7xl font-certificate-title text-primary tracking-tight">
                                                John Doe
                                            </h3>
                                        </div>

                                        <div className="max-w-2xl mx-auto space-y-8">
                                            <p className="text-xl text-slate-700 leading-relaxed">
                                                For successfully completing the <span className="font-bold border-b-2 border-primary/20 text-slate-800">{simulation?.title || "Professional Strategy"}</span> job simulation, demonstrating industry-ready excellence.
                                            </p>

                                            <div className="flex items-center justify-center gap-3 py-4 border-y border-slate-100">
                                                <span className="text-sm font-bold uppercase tracking-tighter text-primary shrink-0">Skills Demonstrated:</span>
                                                <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
                                                    {skills.map((skill, idx) => (
                                                        <div key={idx} className="flex items-center gap-3">
                                                            <span className="text-sm font-medium text-slate-500">{skill}</span>
                                                            {idx < skills.length - 1 && <div className="size-1 rounded-full bg-slate-300" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer / Signatures */}
                                    <div className="flex justify-between items-end">
                                        <div className="flex gap-20">
                                            <div className="text-center space-y-2">
                                                <div className="font-signature text-4xl text-slate-800 h-10 flex items-end justify-center">
                                                    A. Sterling
                                                </div>
                                                <div className="w-48 border-t border-slate-300 pt-2">
                                                    <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                                                        Program Director
                                                    </p>
                                                    <p className="text-[9px] text-slate-500 uppercase">
                                                        Priminent Vantage
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-center space-y-2">
                                                <div className="font-signature text-4xl text-slate-800 h-10 flex items-end justify-center min-w-[12rem]">
                                                    {directorName || "J. Thompson"}
                                                </div>
                                                <div className="w-48 border-t border-slate-300 pt-2">
                                                    <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                                                        Hiring Manager
                                                    </p>
                                                    <p className="text-[9px] text-slate-500 uppercase tracking-tight">
                                                        {organizationName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-end gap-6 text-right">
                                            <div className="mb-1 space-y-0.5">
                                                <p className="text-[9px] font-mono font-medium text-slate-400 uppercase tracking-tight">Date: FEB 15, 2026</p>
                                                <p className="text-[9px] font-mono font-medium text-slate-400 uppercase tracking-tight">ID: PV-FIN-375-B92</p>
                                                <p className="text-[9px] font-mono font-medium text-slate-400 uppercase tracking-tight">Issued: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <div className="size-16 bg-white p-1 border border-slate-100 shadow-sm mb-1">
                                                    <QrCode size={56} className="text-slate-300 grayscale" />
                                                </div>
                                                <span className="text-[8px] font-bold text-slate-400 tracking-tighter uppercase">Scan to Verify</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom features list for Enterprise understanding */}
                        <div className="pt-8 text-center max-w-2xl mx-auto">
                            <p className="text-xs text-slate-500 leading-relaxed mb-6">
                                This high-end certificate is generated dynamically for technology corporate partners.
                                All placeholders will be replaced with real-time metadata upon issuance.
                            </p>
                            <div className="flex justify-center gap-8">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <Verified size={14} />
                                    100% Authentic
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <Share2 size={14} />
                                    LinkedIn Ready
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <QrCode size={14} />
                                    Cloud Verified
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
                <button
                    type="button"
                    onClick={onBack}
                    className="group px-8 py-4 text-xs font-black border-2 border-slate-100 dark:border-slate-800 text-slate-500 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 transition-all flex items-center gap-3 uppercase tracking-widest shadow-sm"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Branding
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={saving}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all flex items-center gap-3 group hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                    {saving ? "Saving Changes..." : "Global Visibility & Access"}
                    {!saving && <Globe size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
            </div>
        </div>
    );
}
