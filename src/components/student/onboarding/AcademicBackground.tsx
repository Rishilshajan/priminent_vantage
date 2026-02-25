'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Award, GraduationCap, Briefcase, RefreshCw, Undo2 } from 'lucide-react';

interface Certification {
    name: string;
    issuing_body?: string;
    year?: number;
}

interface AcademicBackgroundProps {
    persona: string;
    initialData?: any;
    onBack: () => void;
    onNext: (data: any) => void;
    onChange?: (data: any) => void;
}

export default function AcademicBackground({ persona, initialData, onBack, onNext, onChange }: AcademicBackgroundProps) {
    const [formData, setFormData] = useState<any>({
        // Core fields (Everyone)
        highestEducationLevel: initialData?.highestEducationLevel || '',
        fieldOfStudy: initialData?.fieldOfStudy || '',
        graduationYear: initialData?.graduationYear || '',
        certifications: initialData?.certifications || [],

        // Student Specific
        institution: initialData?.institution || '',
        degreeType: initialData?.degreeType || '',
        cgpa: initialData?.cgpa || { value: '', scale: 4 },
        academicStatus: initialData?.academicStatus || '',
        relevantCoursework: initialData?.relevantCoursework || [],

        // Switcher Specific
        previousIndustry: initialData?.previousIndustry || '',
        previousRole: initialData?.previousRole || '',
        previousExperienceYears: initialData?.previousExperienceYears || '',
        targetIndustry: initialData?.targetIndustry || '',
        switchReason: initialData?.switchReason || '',

        // Returning Professional Specific
        careerGapYears: initialData?.careerGapYears || '',
        lastRole: initialData?.lastRole || '',
    });

    const handleChange = (field: string, value: any) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        if (onChange) onChange(newData);
    };

    const handleAddCertification = () => {
        const newCerts = [...formData.certifications, { name: '', issuing_body: '', year: '' }];
        handleChange('certifications', newCerts);
    };

    const handleUpdateCertification = (index: number, field: string, value: any) => {
        const newCerts = [...formData.certifications];
        newCerts[index] = { ...newCerts[index], [field]: value };
        handleChange('certifications', newCerts);
    };

    const handleRemoveCertification = (index: number) => {
        const newCerts = formData.certifications.filter((_: any, i: number) => i !== index);
        handleChange('certifications', newCerts);
    };

    const renderCoreFields = () => (
        <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-200/60 pb-4 dark:border-slate-800/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7f13ec]/10 text-[#7f13ec]">
                    <GraduationCap size={20} />
                </div>
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Core Education</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Highest Education Level</label>
                    <select
                        className="w-full appearance-none rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        value={formData.highestEducationLevel}
                        onChange={(e) => handleChange('highestEducationLevel', e.target.value)}
                    >
                        <option value="">Select Level</option>
                        {["High School", "Diploma", "Bachelor's", "Master's", "MBA", "PhD", "Other"].map(lvl => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Field of Study</label>
                    <input
                        type="text"
                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="e.g. Computer Science"
                        value={formData.fieldOfStudy}
                        onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Graduation Year</label>
                    <input
                        type="number"
                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="2024"
                        value={formData.graduationYear}
                        onChange={(e) => handleChange('graduationYear', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );

    const renderCertifications = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a344ff]/10 text-[#a344ff]">
                        <Award size={20} />
                    </div>
                    <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Certifications</h3>
                </div>
                <button
                    onClick={handleAddCertification}
                    className="flex items-center gap-2 rounded-xl bg-[#7f13ec] px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#7f13ec]/20 transition-all hover:scale-[1.02] hover:bg-[#8e29f3] active:scale-95"
                >
                    <Plus size={16} /> Add New
                </button>
            </div>

            <div className="space-y-6">
                {formData.certifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200/60 p-12 text-center dark:border-slate-800/60">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/50">
                            <Award className="text-slate-300 dark:text-slate-600" size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-400">No certifications added yet. Click 'Add New' to showcase your achievements.</p>
                    </div>
                ) : (
                    formData.certifications.map((cert: Certification, index: number) => (
                        <div key={index} className="group relative rounded-[32px] border border-slate-200/60 bg-white p-8 shadow-sm transition-all hover:border-[#7f13ec]/20 hover:shadow-xl hover:shadow-[#7f13ec]/5 dark:border-slate-800/60 dark:bg-[#1e1429]">
                            <div className="mb-6 flex items-center justify-between">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-black text-slate-500 dark:bg-slate-800">0{index + 1}</span>
                                <button
                                    onClick={() => handleRemoveCertification(index)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-400 transition-all hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Certification Name</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                        placeholder="e.g. AWS Certified Solutions Architect"
                                        value={cert.name}
                                        onChange={(e) => handleUpdateCertification(index, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Issuing Body</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                        placeholder="e.g. Amazon Web Services"
                                        value={cert.issuing_body}
                                        onChange={(e) => handleUpdateCertification(index, 'issuing_body', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Year</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1a1325] dark:text-white"
                                        placeholder="2023"
                                        value={cert.year}
                                        onChange={(e) => handleUpdateCertification(index, 'year', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderStudentExtension = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 border-b border-slate-200/60 pb-4 dark:border-slate-800/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 uppercase font-black text-[10px]">
                    ST
                </div>
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Student Details</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Institution</label>
                    <input
                        type="text"
                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="University Name"
                        value={formData.institution}
                        onChange={(e) => handleChange('institution', e.target.value)}
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Degree Type</label>
                    <input
                        type="text"
                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="e.g. BS in AI"
                        value={formData.degreeType}
                        onChange={(e) => handleChange('degreeType', e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">CGPA</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                            placeholder="3.8"
                            value={formData.cgpa.value}
                            onChange={(e) => handleChange('cgpa', { ...formData.cgpa, value: e.target.value })}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Scale</label>
                        <select
                            className="w-full appearance-none rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                            value={formData.cgpa.scale}
                            onChange={(e) => handleChange('cgpa', { ...formData.cgpa, scale: e.target.value })}
                        >
                            <option value="4">/ 4</option>
                            <option value="5">/ 5</option>
                            <option value="10">/ 10</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Academic Status</label>
                    <select
                        className="w-full appearance-none rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        value={formData.academicStatus}
                        onChange={(e) => handleChange('academicStatus', e.target.value)}
                    >
                        <option value="">Select Status</option>
                        {["Currently Studying", "Graduated", "On Break"].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );

    const renderSwitcherExtension = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 border-b border-slate-200/60 pb-4 dark:border-slate-800/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                    <RefreshCw size={20} />
                </div>
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Career Transition</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Previous Industry</label>
                    <input
                        type="text"
                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="e.g. Finance"
                        value={formData.previousIndustry}
                        onChange={(e) => handleChange('previousIndustry', e.target.value)}
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Previous Role</label>
                    <input
                        type="text"
                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="e.g. Account Manager"
                        value={formData.previousRole}
                        onChange={(e) => handleChange('previousRole', e.target.value)}
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Years of Experience</label>
                    <input
                        type="number"
                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="5"
                        value={formData.previousExperienceYears}
                        onChange={(e) => handleChange('previousExperienceYears', e.target.value)}
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Target Industry</label>
                    <input
                        type="text"
                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="e.g. Cybersecurity"
                        value={formData.targetIndustry}
                        onChange={(e) => handleChange('targetIndustry', e.target.value)}
                    />
                </div>
                <div className="md:col-span-2 space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Reason for Switch</label>
                    <textarea
                        className="w-full min-h-[120px] rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="Briefly explain why you are pivoting your career..."
                        value={formData.switchReason}
                        onChange={(e) => handleChange('switchReason', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );

    const renderReturningExtension = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 border-b border-slate-200/60 pb-4 dark:border-slate-800/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                    <Undo2 size={20} />
                </div>
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Returning Professional</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Career Gap Years</label>
                    <input
                        type="number"
                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="2"
                        value={formData.careerGapYears}
                        onChange={(e) => handleChange('careerGapYears', e.target.value)}
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a344ff]">Last Professional Role</label>
                    <input
                        type="text"
                        className="w-full rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white"
                        placeholder="e.g. Senior Analyst"
                        value={formData.lastRole}
                        onChange={(e) => handleChange('lastRole', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );

    if (process.env.NODE_ENV === 'development') {
        console.log('AcademicBackground Persona:', persona);
    }

    return (
        <section className="space-y-16">
            <div className="space-y-3">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">Background & Education</h1>
                <p className="text-base font-medium text-slate-500">Build your academic foundation and provide transition context.</p>
            </div>

            {renderCoreFields()}

            {renderCertifications()}

            {persona === 'University Student' && renderStudentExtension()}
            {persona === 'Career Switcher' && renderSwitcherExtension()}
            {persona === 'Returning Professional' && renderReturningExtension()}

            {(persona === 'Working Professional' || persona === 'Freelancer') && (
                <div className="rounded-3xl border border-[#7f13ec]/20 bg-[#7f13ec]/5 p-8 text-center">
                    <Briefcase className="mx-auto mb-4 text-[#7f13ec]/40" size={32} />
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                        As a <span className="text-[#7f13ec]">{persona}</span>, your primary professional details will be collected in the next step.
                    </p>
                </div>
            )}
        </section>
    );
}
