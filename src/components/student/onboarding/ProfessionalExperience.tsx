'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Briefcase, Calendar, Building2, Layers, AlignLeft, CheckCircle2 } from 'lucide-react';
import type { Experience } from '@/lib/student/onboarding.service';

interface ProfessionalExperienceProps {
    initialData?: {
        totalYearsExperience?: number;
        experiences: Experience[];
    };
    onBack: () => void;
    onNext: (data: any) => void;
    onChange?: (data: any) => void;
}

export default function ProfessionalExperience({ initialData, onBack, onNext, onChange }: ProfessionalExperienceProps) {
    const [formData, setFormData] = useState({
        totalYearsExperience: initialData?.totalYearsExperience || '',
        experiences: initialData?.experiences || []
    });

    const handleChange = (field: string, value: any) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        if (onChange) onChange(newData);
    };

    const handleAddExperience = () => {
        const newExps = [
            ...formData.experiences,
            {
                company: '',
                role: '',
                industry: '',
                startDate: '',
                endDate: '',
                currentlyWorking: false,
                description: ''
            }
        ];
        handleChange('experiences', newExps);
    };

    const handleUpdateExperience = (index: number, field: string, value: any) => {
        const newExps = [...formData.experiences];
        newExps[index] = { ...newExps[index], [field]: value };
        handleChange('experiences', newExps);
    };

    const handleRemoveExperience = (index: number) => {
        const newExps = formData.experiences.filter((_, i) => i !== index);
        handleChange('experiences', newExps);
    };

    return (
        <section className="space-y-16">
            <div className="space-y-3">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">Professional Experience</h1>
                <p className="text-base font-medium text-slate-500">Highlight your career journey and key professional milestones.</p>
            </div>

            {/* Total Years of Experience */}
            <div className="max-w-xs space-y-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Total Years of Experience</label>
                <div className="relative">
                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="number"
                        step="0.5"
                        className="w-full rounded-2xl border border-slate-200/60 bg-white py-4 pl-14 pr-5 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="e.g. 5"
                        value={formData.totalYearsExperience}
                        onChange={(e) => handleChange('totalYearsExperience', e.target.value)}
                    />
                </div>
            </div>

            {/* Experiences List */}
            <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 dark:border-slate-800/60">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7f13ec]/10 text-[#7f13ec]">
                            <Briefcase size={20} />
                        </div>
                        <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Work History</h3>
                    </div>
                    <button
                        onClick={handleAddExperience}
                        className="flex items-center gap-2 rounded-xl bg-[#7f13ec] px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#7f13ec]/20 transition-all hover:scale-[1.02] hover:bg-[#8e29f3] active:scale-95"
                    >
                        <Plus size={16} /> Add Experience
                    </button>
                </div>

                <div className="space-y-8">
                    {formData.experiences.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-slate-200/60 p-16 text-center dark:border-slate-800/60">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/50">
                                <Briefcase className="text-slate-300 dark:text-slate-600" size={40} />
                            </div>
                            <h4 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">No work history added</h4>
                            <p className="max-w-xs text-sm font-medium text-slate-400">Add your previous or current roles to help employers understand your journey.</p>
                        </div>
                    ) : (
                        formData.experiences.map((exp, index) => (
                            <div key={index} className="group relative animate-in fade-in slide-in-from-top-4 duration-500 rounded-[32px] border border-slate-200/60 bg-white p-8 shadow-sm transition-all hover:border-[#7f13ec]/20 hover:shadow-2xl hover:shadow-[#7f13ec]/5 dark:border-slate-800/60 dark:bg-[#1e1429]">
                                <div className="mb-8 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7f13ec]/10 text-[11px] font-black text-[#7f13ec]">0{index + 1}</span>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white">Role Detailed</h4>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveExperience(index)}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-400 transition-all hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Company Name</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                className="w-full rounded-2xl border border-slate-200/60 bg-white py-4 pl-14 pr-5 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                                placeholder="e.g. Google"
                                                value={exp.company}
                                                onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Job Role</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                className="w-full rounded-2xl border border-slate-200/60 bg-white py-4 pl-14 pr-5 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                                placeholder="e.g. Frontend Developer"
                                                value={exp.role}
                                                onChange={(e) => handleUpdateExperience(index, 'role', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Industry</label>
                                        <div className="relative">
                                            <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                className="w-full rounded-2xl border border-slate-200/60 bg-white py-4 pl-14 pr-5 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                                placeholder="e.g. Technology"
                                                value={exp.industry}
                                                onChange={(e) => handleUpdateExperience(index, 'industry', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Start Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="date"
                                                className="w-full rounded-2xl border border-slate-200/60 bg-white py-4 pl-14 pr-5 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                                value={exp.startDate}
                                                onChange={(e) => handleUpdateExperience(index, 'startDate', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">End Date</label>
                                            <label className="flex cursor-pointer items-center gap-3 group/toggle">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        className="peer sr-only"
                                                        checked={exp.currentlyWorking}
                                                        onChange={(e) => handleUpdateExperience(index, 'currentlyWorking', e.target.checked)}
                                                    />
                                                    <div className="h-6 w-11 rounded-full border border-slate-200 bg-slate-100 transition-all peer-checked:border-[#7f13ec] peer-checked:bg-[#7f13ec] dark:border-slate-700 dark:bg-[#1a1325]"></div>
                                                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all peer-checked:left-6"></div>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors group-hover/toggle:text-[#7f13ec] peer-checked:text-[#7f13ec]">Currently Working</span>
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="date"
                                                disabled={exp.currentlyWorking}
                                                className="w-full rounded-2xl border border-slate-200/60 bg-white py-4 pl-14 pr-5 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 disabled:opacity-50 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                                value={exp.endDate}
                                                onChange={(e) => handleUpdateExperience(index, 'endDate', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 lg:col-span-3 space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Key Responsibilities & Description</label>
                                        <div className="relative">
                                            <AlignLeft className="absolute left-5 top-6 text-slate-400" size={18} />
                                            <textarea
                                                className="w-full min-h-[140px] rounded-3xl border border-slate-200/60 bg-white py-5 pl-14 pr-6 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                                placeholder="Briefly describe your role, key achievements, and responsibilities..."
                                                value={exp.description}
                                                onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
