"use client"

import React, { useState } from "react"
import { Search, Award, Shield, X, Menu, GraduationCap, Medal, BadgeCheck } from "lucide-react"
import { StudentSidebar } from "./StudentSidebar"
import { NotificationDropdown } from "./NotificationDropdown"
import { CertificateCard } from "./CertificateCard"
import { SkillBadge } from "./SkillBadge"
import { EmptyState } from "./EmptyState"
import { cn } from "@/lib/utils"

interface SkillsCertificationsViewProps {
    data: {
        skills: any[];
        certificates: any[];
        profile: any;
    };
    orgBranding: any;
}

export function SkillsCertificationsView({ data, orgBranding }: SkillsCertificationsViewProps) {
    const [activeTab, setActiveTab] = useState<'certificates' | 'skills'>('certificates')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const brandColorStyle = orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {}
    const brandColorText = orgBranding?.brand_color ? { color: orgBranding.brand_color } : {}

    const { skills, certificates, profile } = data;

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

            <main className="flex-1 overflow-y-auto mt-16 lg:mt-0">
                <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 p-6 lg:p-10">

                    {/* Page Header */}
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white lg:text-4xl">
                                    Skills & Certifications
                                </h1>
                                <p className="max-w-2xl text-base font-medium text-slate-500 dark:text-slate-400 lg:text-lg">
                                    Showcase your verified achievements and professional capabilities.
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

                        {/* Navigation Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 pb-4 dark:border-white/5 lg:gap-4 no-scrollbar">
                            <button
                                onClick={() => setActiveTab('certificates')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap lg:gap-3 lg:px-6 lg:text-sm",
                                    activeTab === 'certificates' ? "text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                )}
                                style={activeTab === 'certificates' ? brandColorText : {}}
                            >
                                <Award size={18} className="shrink-0" />
                                <span>Verified Certificates</span>
                                {activeTab === 'certificates' && (
                                    <div className="absolute bottom-[-17px] left-0 h-1 w-full rounded-full bg-primary" style={brandColorStyle} />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('skills')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap lg:gap-3 lg:px-6 lg:text-sm",
                                    activeTab === 'skills' ? "text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                )}
                                style={activeTab === 'skills' ? brandColorText : {}}
                            >
                                <Medal size={18} className="shrink-0" />
                                <span>Acquired Skills</span>
                                {activeTab === 'skills' && (
                                    <div className="absolute bottom-[-17px] left-0 h-1 w-full rounded-full bg-primary" style={brandColorStyle} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="min-h-[600px]">
                        {activeTab === 'certificates' ? (
                            certificates.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    {certificates.map((cert: any) => (
                                        <CertificateCard
                                            key={cert.id}
                                            certificate={cert}
                                            brandColor={orgBranding?.brand_color}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Award}
                                    title="No certificates yet"
                                    description="Complete simulation programs to earn industry-verified certificates and showcase your expertise."
                                    ctaLabel="Explore Simulations"
                                    ctaHref="/student/library"
                                    brandColor={orgBranding?.brand_color}
                                    className="min-h-[400px]"
                                />
                            )
                        ) : (
                            skills.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    {skills.map((skill: any) => (
                                        <SkillBadge
                                            key={skill.id}
                                            skill={skill}
                                            brandColor={orgBranding?.brand_color}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={BadgeCheck}
                                    title="Start building your skill set"
                                    description="Earn skills by engaging with simulations and projects. Your proficiency levels will be tracked here."
                                    ctaLabel="Discover Projects"
                                    ctaHref="/student/library"
                                    brandColor={orgBranding?.brand_color}
                                    className="min-h-[400px]"
                                />
                            )
                        )}
                    </div>
                </div>

                {/* Profile Stats Mini-Section (Only if skills/certs exist) */}
                {(skills.length > 0 || certificates.length > 0) && (
                    <div className="mx-auto mt-10 w-full max-w-[1400px] px-6 lg:mt-20 lg:px-10 pb-20">
                        <div className="rounded-[40px] bg-slate-900 p-8 text-white dark:bg-white/5 shadow-2xl overflow-hidden relative lg:p-12" style={brandColorStyle}>
                            <div className="absolute right-[-100px] top-[-100px] size-[400px] rounded-full bg-white/5 blur-3xl" />
                            <div className="relative flex flex-col items-center justify-between gap-10 lg:flex-row lg:gap-12">
                                <div className="flex flex-col gap-4 text-center lg:text-left">
                                    <h2 className="text-2xl font-black tracking-tight lg:text-3xl">Professional Standing</h2>
                                    <p className="max-w-md text-base font-medium text-white/70 lg:text-lg">Your profile's visibility increases with every verified certification you earn.</p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16">
                                    <div className="flex flex-col items-center gap-1 lg:gap-2">
                                        <span className="text-4xl font-black lg:text-5xl">{certificates.length}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/50 lg:text-[11px]">Certificates</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-center lg:gap-2">
                                        <span className="text-4xl font-black lg:text-5xl">{skills.length}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/50 lg:text-[11px]">Verified Skills</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
