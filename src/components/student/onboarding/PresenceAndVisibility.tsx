'use client';

import React, { useState } from 'react';
import { Linkedin, Github, Globe, Twitter, Eye, Briefcase, CheckCircle2 } from 'lucide-react';

interface PresenceAndVisibilityProps {
    initialData?: {
        linkedinUrl?: string;
        githubUrl?: string;
        portfolioUrl?: string;
        twitterUrl?: string;
        isPublic: boolean;
        isOpenToOpportunities: boolean;
    };
    onBack: () => void;
    onNext: (data: any) => void;
    onChange?: (data: any) => void;
    isSubmitting?: boolean;
}

export default function PresenceAndVisibility({ initialData, onBack, onNext, onChange, isSubmitting }: PresenceAndVisibilityProps) {
    const [formData, setFormData] = useState({
        linkedinUrl: initialData?.linkedinUrl || '',
        githubUrl: initialData?.githubUrl || '',
        portfolioUrl: initialData?.portfolioUrl || '',
        twitterUrl: initialData?.twitterUrl || '',
        isPublic: initialData?.isPublic ?? true,
        isOpenToOpportunities: initialData?.isOpenToOpportunities ?? true
    });

    const handleChange = (field: string, value: any) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        if (onChange) onChange(newData);
    };

    const SocialInput = ({ icon: Icon, label, field, placeholder }: { icon: any, label: string, field: string, placeholder: string }) => (
        <div className="group space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">{label}</label>
            <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7f13ec] transition-colors">
                    <Icon size={18} />
                </div>
                <input
                    type="url"
                    className="w-full rounded-2xl border border-slate-200/60 bg-white py-4 pl-14 pr-5 text-[15px] font-bold text-slate-900 outline-none ring-[#7f13ec]/10 transition-all focus:border-[#7f13ec] focus:ring-4 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                    placeholder={placeholder}
                    value={(formData as any)[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                />
            </div>
        </div>
    );

    const ToggleCard = ({ icon: Icon, title, description, field }: { icon: any, title: string, description: string, field: string }) => (
        <div
            onClick={() => handleChange(field, !(formData as any)[field])}
            className={`cursor-pointer rounded-[32px] border-2 p-6 sm:p-8 transition-all duration-300 ${(formData as any)[field]
                ? 'border-[#7f13ec] bg-[#7f13ec]/5 shadow-lg shadow-[#7f13ec]/5'
                : 'border-slate-100 bg-slate-50/50 dark:border-slate-800/60 dark:bg-[#1a1325]'
                }`}
        >
            <div className="flex items-start gap-6">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl transition-colors ${(formData as any)[field] ? 'bg-[#7f13ec] text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'
                    }`}>
                    <Icon size={24} />
                </div>
                <div className="space-y-2">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">{title}</h4>
                    <p className="text-sm font-medium leading-relaxed text-slate-500">{description}</p>
                </div>
                <div className="ml-auto">
                    <div className="relative">
                        <div className={`h-6 w-11 rounded-full transition-all ${(formData as any)[field] ? 'bg-[#7f13ec]' : 'bg-slate-300 dark:bg-slate-700'
                            }`}></div>
                        <div className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${(formData as any)[field] ? 'left-6' : 'left-1'
                            }`}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <section className="space-y-16">
            <div className="space-y-3 text-center lg:text-left">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">Presence & Visibility</h1>
                <p className="text-base font-medium text-slate-500">How would you like to be seen by employers and the community?</p>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <SocialInput icon={Linkedin} label="LinkedIn Profile" field="linkedinUrl" placeholder="linkedin.com/in/username" />
                <SocialInput icon={Github} label="GitHub Profile" field="githubUrl" placeholder="github.com/username" />
                <SocialInput icon={Globe} label="Personal Portfolio" field="portfolioUrl" placeholder="yourwebsite.com" />
                <SocialInput icon={Twitter} label="Twitter / X" field="twitterUrl" placeholder="twitter.com/username" />
            </div>

            {/* Visibility Settings */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ToggleCard
                    icon={Eye}
                    title="Public Profile"
                    description="Allow your profile to be discovered by employers and listed in our talent directory."
                    field="isPublic"
                />
                <ToggleCard
                    icon={Briefcase}
                    title="Open to Opportunities"
                    description="Show a badge on your profile indicating you are actively looking for new career challenges."
                    field="isOpenToOpportunities"
                />
            </div>

            <div className="rounded-[40px] bg-gradient-to-br from-[#7f13ec]/5 to-[#a344ff]/5 p-8 sm:p-12 text-center border border-[#7f13ec]/10">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[30px] bg-white shadow-xl shadow-[#7f13ec]/20 text-[#7f13ec]">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                </div>
                <h3 className="mb-4 text-2xl font-black text-slate-900 dark:text-white">You're almost there!</h3>
                <p className="mx-auto max-w-md text-base font-medium leading-relaxed text-slate-500">
                    Completing your profile allows us to provide personalized mentorship and match you with the best career opportunities.
                </p>
                <button
                    onClick={() => onNext(formData)}
                    disabled={isSubmitting}
                    className="mt-10 inline-flex h-16 items-center gap-3 rounded-[24px] bg-[#7f13ec] px-12 text-[14px] font-black uppercase tracking-widest text-white shadow-2xl shadow-[#7f13ec]/40 transition-all hover:scale-[1.05] hover:shadow-[#7f13ec]/60 active:scale-[0.98] disabled:opacity-50"
                >
                    {isSubmitting ? 'Finalizing Profile...' : 'Complete My Profile'}
                    {!isSubmitting && <span className="material-symbols-outlined font-black">celebration</span>}
                </button>
            </div>
        </section>
    );
}
