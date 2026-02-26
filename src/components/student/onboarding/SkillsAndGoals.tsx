'use client';

import React, { useState } from 'react';
import { X, Plus, Target, Heart, Navigation, DollarSign, Clock, Zap, Lightbulb } from 'lucide-react';

interface SkillsAndGoalsProps {
    initialData?: {
        skills: string[];
        softSkills: string[];
        targetRoles: string[];
        preferredIndustries: string[];
        workTypes: string[];
        workEnvironments: string[];
        preferredLocations: string[];
        salaryExpectation?: string;
        availability: string;
        shortTermGoals?: string;
        longTermGoals?: string;
    };
    onBack: () => void;
    onNext: (data: any) => void;
    onChange?: (data: any) => void;
}

export default function SkillsAndGoals({ initialData, onBack, onNext, onChange }: SkillsAndGoalsProps) {
    const [formData, setFormData] = useState({
        skills: initialData?.skills || [],
        softSkills: initialData?.softSkills || [],
        targetRoles: initialData?.targetRoles || [],
        preferredIndustries: initialData?.preferredIndustries || [],
        workTypes: initialData?.workTypes || [],
        workEnvironments: initialData?.workEnvironments || [],
        preferredLocations: initialData?.preferredLocations || [],
        salaryExpectation: initialData?.salaryExpectation || '',
        availability: initialData?.availability || 'Immediate',
        shortTermGoals: initialData?.shortTermGoals || '',
        longTermGoals: initialData?.longTermGoals || ''
    });

    const [skillInput, setSkillInput] = useState('');
    const [softSkillInput, setSoftSkillInput] = useState('');
    const [roleInput, setRoleInput] = useState('');
    const [industryInput, setIndustryInput] = useState('');
    const [locationInput, setLocationInput] = useState('');

    const handleChange = (field: string, value: any) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        if (onChange) onChange(newData);
    };

    const handleAddTag = (field: 'skills' | 'softSkills' | 'targetRoles' | 'preferredIndustries' | 'preferredLocations' | 'workTypes' | 'workEnvironments', value: string, inputSetter?: (v: string) => void) => {
        if (!value.trim()) return;
        if (!formData[field].includes(value.trim())) {
            handleChange(field, [...formData[field], value.trim()]);
        }
        if (inputSetter) inputSetter('');
    };

    const handleRemoveTag = (field: 'skills' | 'softSkills' | 'targetRoles' | 'preferredIndustries' | 'preferredLocations' | 'workTypes' | 'workEnvironments', tag: string) => {
        handleChange(field, formData[field].filter(t => t !== tag));
    };

    const TagCloud = ({ field, tags }: { field: 'skills' | 'softSkills' | 'targetRoles' | 'preferredIndustries' | 'preferredLocations' | 'workTypes' | 'workEnvironments', tags: string[] }) => (
        <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-2 rounded-full bg-[#7f13ec]/10 px-4 py-2 text-[13px] font-bold text-[#7f13ec] transition-all hover:bg-[#7f13ec]/20">
                    {tag}
                    <button onClick={() => handleRemoveTag(field, tag)} className="hover:text-red-500 transition-colors">
                        <X size={14} />
                    </button>
                </span>
            ))}
        </div>
    );

    return (
        <section className="space-y-16">
            <div className="space-y-3">
                <h1 className="text-3xl font-black    text-slate-900 dark:text-white md:text-4xl">Skills & Career Goals</h1>
                <p className="text-base font-medium text-slate-500">Define your unique strengths and where you want your career to go next.</p>
            </div>

            {/* Skills Section */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Technical Skills */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7f13ec]/10 text-[#7f13ec]">
                            <Zap size={20} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Technical Skills</h3>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold outline-none ring-[#7f13ec]/10 transition-all focus:border-[#7f13ec] focus:ring-4 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                            placeholder="Add a skill (e.g. React, Python)"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag('skills', skillInput, setSkillInput)}
                        />
                        <button
                            onClick={() => handleAddTag('skills', skillInput, setSkillInput)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-[#7f13ec] hover:text-white dark:bg-slate-800"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <TagCloud field="skills" tags={formData.skills} />
                </div>

                {/* Soft Skills */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7f13ec]/10 text-[#7f13ec]">
                            <Heart size={20} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Soft Skills</h3>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold outline-none ring-[#7f13ec]/10 transition-all focus:border-[#7f13ec] focus:ring-4 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                            placeholder="e.g. Leadership, Communication"
                            value={softSkillInput}
                            onChange={(e) => setSoftSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag('softSkills', softSkillInput, setSoftSkillInput)}
                        />
                        <button
                            onClick={() => handleAddTag('softSkills', softSkillInput, setSoftSkillInput)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-[#7f13ec] hover:text-white dark:bg-slate-800"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <TagCloud field="softSkills" tags={formData.softSkills} />
                </div>
            </div>

            {/* Career Interests & Preferences */}
            <div className="rounded-[40px] border border-slate-200/60 bg-white p-6 sm:p-10 dark:border-slate-800/60 dark:bg-[#1e1429]">
                <div className="mb-10 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7f13ec]/10 text-[#7f13ec]">
                        <Target size={24} />
                    </div>
                    <h3 className="text-2xl font-black    text-slate-900 dark:text-white">Career Aspirations</h3>
                </div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {/* Target Roles */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Target Roles</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold outline-none ring-[#7f13ec]/10 transition-all focus:border-[#7f13ec] focus:ring-4 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                placeholder="e.g. Frontend Developer"
                                value={roleInput}
                                onChange={(e) => setRoleInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag('targetRoles', roleInput, setRoleInput)}
                            />
                        </div>
                        <TagCloud field="targetRoles" tags={formData.targetRoles} />
                    </div>

                    {/* Preferred Industries */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Preferred Industries</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold outline-none ring-[#7f13ec]/10 transition-all focus:border-[#7f13ec] focus:ring-4 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                placeholder="e.g. Fintech, AI"
                                value={industryInput}
                                onChange={(e) => setIndustryInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag('preferredIndustries', industryInput, setIndustryInput)}
                            />
                        </div>
                        <TagCloud field="preferredIndustries" tags={formData.preferredIndustries} />
                    </div>

                    {/* Work Type */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Work Type</label>
                        <div className="flex flex-wrap gap-2">
                            {['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        if (formData.workTypes.includes(type)) {
                                            handleRemoveTag('workTypes', type);
                                        } else {
                                            handleAddTag('workTypes', type);
                                        }
                                    }}
                                    className={`rounded-xl px-4 py-2 text-[12px] font-bold transition-all ${formData.workTypes.includes(type)
                                        ? 'bg-[#7f13ec] text-white shadow-lg shadow-[#7f13ec]/20'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Work Environment */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Work Environment</label>
                        <div className="flex flex-wrap gap-2">
                            {['On-site', 'Remote', 'Hybrid'].map(env => (
                                <button
                                    key={env}
                                    onClick={() => {
                                        if (formData.workEnvironments.includes(env)) {
                                            handleRemoveTag('workEnvironments', env);
                                        } else {
                                            handleAddTag('workEnvironments', env);
                                        }
                                    }}
                                    className={`rounded-xl px-4 py-2 text-[12px] font-bold transition-all ${formData.workEnvironments.includes(env)
                                        ? 'bg-[#a344ff] text-white shadow-lg shadow-[#a344ff]/20'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800'
                                        }`}
                                >
                                    {env}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preferred Locations */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Preferred Locations</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold outline-none ring-[#7f13ec]/10 transition-all focus:border-[#7f13ec] focus:ring-4 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                placeholder="e.g. Remote, New York"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag('preferredLocations', locationInput, setLocationInput)}
                            />
                        </div>
                        <TagCloud field="preferredLocations" tags={formData.preferredLocations} />
                    </div>

                    {/* Availability */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Availability</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold outline-none ring-[#7f13ec]/10 transition-all focus:border-[#7f13ec] focus:ring-4 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                value={formData.availability}
                                onChange={(e) => handleChange('availability', e.target.value)}
                            >
                                <option>Immediate</option>
                                <option>Within 2 weeks</option>
                                <option>1 month notice</option>
                                <option>2 months notice</option>
                                <option>Specific Date</option>
                            </select>
                            <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                                <Clock size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Salary Expectation */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Salary Expectation (Annually)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                className="w-full rounded-2xl border border-slate-200/60 bg-white py-4 pl-14 pr-5 text-[15px] font-bold text-slate-900 outline-none ring-[#7f13ec]/10 transition-all focus:border-[#7f13ec] focus:ring-4 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                placeholder="e.g. $80k - $100k"
                                value={formData.salaryExpectation}
                                onChange={(e) => handleChange('salaryExpectation', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="text-[#a344ff]" size={16} />
                            <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Short-term Career Goals</label>
                        </div>
                        <textarea
                            className="w-full min-h-[120px] rounded-3xl border border-slate-200/60 bg-white p-5 sm:p-6 text-[15px] font-bold text-slate-900 outline-none ring-[#7f13ec]/10 transition-all focus:border-[#7f13ec] focus:ring-4 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                            placeholder="What do you want to achieve in the next 1-2 years?"
                            value={formData.shortTermGoals}
                            onChange={(e) => handleChange('shortTermGoals', e.target.value)}
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Target className="text-[#a344ff]" size={16} />
                            <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Long-term Career Goals</label>
                        </div>
                        <textarea
                            className="w-full min-h-[120px] rounded-3xl border border-slate-200/60 bg-white p-5 sm:p-6 text-[15px] font-bold text-slate-900 outline-none ring-[#7f13ec]/10 transition-all focus:border-[#7f13ec] focus:ring-4 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                            placeholder="Where do you see yourself in 5+ years?"
                            value={formData.longTermGoals}
                            onChange={(e) => handleChange('longTermGoals', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
