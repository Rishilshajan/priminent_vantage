'use client';

import React from 'react';
import type { BasicIdentityData } from '@/app/student/onboarding/page';
import { CountrySelect } from '@/components/ui/country-select';
import { StateSelect } from '@/components/ui/state-select';
import { CitySelect } from '@/components/ui/city-select';

interface PersonaSelectionProps {
    data: BasicIdentityData;
    onChange: (data: BasicIdentityData) => void;
}

export default function PersonaSelection({ data, onChange }: PersonaSelectionProps) {
    const personas = [
        {
            id: 'University Student',
            title: 'University Student',
            description: 'Currently enrolled or recently graduated, looking for internships or entry roles.',
            icon: 'school',
        },
        {
            id: 'Working Professional',
            title: 'Working Professional',
            description: 'Experienced individual looking for the next career leap or mid-senior roles.',
            icon: 'work',
        },
        {
            id: 'Career Switcher',
            title: 'Career Switcher',
            description: 'Moving from one industry to another and pivoting your career trajectory.',
            icon: 'shuffle',
        },
        {
            id: 'Returning Professional',
            title: 'Returning Professional',
            description: 'Coming back from a career break, sabbatical, or parental leave.',
            icon: 'restart_alt',
        },
        {
            id: 'Freelancer',
            title: 'Freelancer',
            description: 'Independent professional or business owner exploring new ventures or clients.',
            icon: 'person_pinnacle',
        },
    ];

    const handleChange = (field: keyof BasicIdentityData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <section className="space-y-12">
            <div className="space-y-3">
                <h1 className="text-3xl font-black    text-slate-900 dark:text-white md:text-4xl">Basic Identity</h1>
                <p className="text-base font-medium text-slate-500">Provide your core details to help us personalize your Prominent Vantage experience.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">First Name</label>
                    <input
                        type="text"
                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="John"
                        value={data.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Last Name</label>
                    <input
                        type="text"
                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="Doe"
                        value={data.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                </div>

                <div className="space-y-3 md:col-span-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Email Address</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                        <input
                            type="email"
                            className="w-full rounded-2xl border border-slate-200/60 bg-white py-4 pl-14 pr-32 text-[15px] font-medium text-slate-600 shadow-sm outline-none dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-slate-400 cursor-not-allowed opacity-70"
                            value={data.email}
                            disabled
                        />
                        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-xl bg-emerald-50 px-2 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-emerald-500 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400">
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                            <span className="hidden sm:inline">Verified</span>
                        </div>
                    </div>
                </div>

                {/* New Personal Details Fields */}
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Date of Birth</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">calendar_month</span>
                        <input
                            type="date"
                            className="w-full rounded-2xl border border-slate-200/60 bg-white py-4 pl-14 pr-5 text-[15px] font-medium text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                            value={data.dateOfBirth}
                            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Gender</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                        <select
                            className="w-full appearance-none rounded-2xl border border-slate-200/60 bg-white py-4 pl-14 pr-5 text-[15px] font-medium text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                            value={data.gender}
                            onChange={(e) => handleChange('gender', e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                    </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Phone Number</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">phone_iphone</span>
                        <input
                            type="tel"
                            className="w-full rounded-2xl border border-slate-200/60 bg-white py-4 pl-14 pr-5 text-[15px] font-medium text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                            placeholder="+1 (555) 000-0000"
                            value={data.phoneNumber}
                            onChange={(e) => handleChange('phoneNumber', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Country</label>
                    <CountrySelect
                        value={data.country}
                        onChange={(val) => {
                            onChange({ ...data, country: val, state: '', city: '' });
                        }}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">State / Province</label>
                    <StateSelect
                        countryCode={data.country}
                        value={data.state}
                        onChange={(val) => {
                            onChange({ ...data, state: val, city: '' });
                        }}
                    />
                </div>

                <div className="space-y-3 md:col-span-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">City</label>
                    <CitySelect
                        countryCode={data.country}
                        stateCode={data.state}
                        value={data.city}
                        onChange={(val) => handleChange('city', val)}
                    />
                </div>
            </div>

            <div className="space-y-8 border-t border-slate-200/60 pt-12 dark:border-slate-800/60">
                <div className="space-y-3">
                    <h2 className="text-2xl font-black    text-slate-900 dark:text-white md:text-3xl">User Type</h2>
                    <p className="text-base font-medium text-slate-500">Which best describes you? This determines your onboarding path and next steps.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {personas.map((persona) => {
                        const isSelected = data.userType === persona.id;

                        return (
                            <button
                                key={persona.id}
                                onClick={() => handleChange('userType', persona.id)}
                                className={`group relative flex items-start gap-4 overflow-hidden rounded-2xl border-2 p-5 text-left transition-all duration-300 ${isSelected
                                    ? 'border-[#7f13ec] bg-white shadow-xl shadow-[#7f13ec]/10 ring-4 ring-[#7f13ec]/10 dark:bg-slate-900'
                                    : 'border-slate-200/60 bg-white shadow-sm hover:-translate-y-1 hover:border-[#7f13ec]/30 hover:shadow-lg hover:shadow-[#7f13ec]/5 dark:border-slate-800/60 dark:bg-[#1e1429] dark:shadow-none'
                                    }`}
                            >
                                {isSelected && (
                                    <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-gradient-to-br from-[#7f13ec]/10 to-transparent blur-2xl"></div>
                                )}

                                <div
                                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${isSelected
                                        ? 'bg-gradient-to-br from-[#7f13ec] to-[#a344ff] text-white shadow-lg shadow-[#7f13ec]/30'
                                        : 'bg-slate-100 text-slate-400 group-hover:bg-[#7f13ec]/10 group-hover:text-[#7f13ec] dark:bg-slate-800 dark:text-slate-500'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[24px]">{persona.icon}</span>
                                </div>

                                <div className="relative z-10">
                                    <div className="mb-1 flex items-center gap-2">
                                        <h4 className={`text-base    transition-colors duration-300 ${isSelected ? 'font-black text-[#7f13ec]' : 'font-bold text-slate-900 dark:text-white'
                                            }`}>{persona.title}</h4>
                                        {isSelected && <span className="material-symbols-outlined text-[16px] text-[#7f13ec]">check_circle</span>}
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed text-slate-500 line-clamp-2">{persona.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
