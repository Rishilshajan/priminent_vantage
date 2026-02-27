"use client"

import React from 'react'
import {
    Mail,
    Phone,
    MapPin,
    Globe,
    Linkedin,
    Github,
    Download,
    GraduationCap,
    Briefcase,
    Award,
    Zap,
    ExternalLink,
    ChevronRight,
    Calendar,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CandidateProfileProps {
    data: {
        profile: any
        education: any[]
        experience: any[]
        skills: any[]
        simulations: any[]
    }
}

export default function CandidateProfileView({ data }: CandidateProfileProps) {
    const { profile, education, experience, skills, simulations } = data

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
                <Link
                    href="/enterprise/candidates"
                    className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm"
                >
                    <div className="size-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:border-primary/30 transition-all">
                        <ArrowLeft className="size-4" />
                    </div>
                    Back to Candidates
                </Link>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 rounded-xl font-bold text-xs gap-2 border-slate-200 dark:border-slate-800">
                        <Mail className="size-4" /> Message
                    </Button>
                    {profile.resumeUrl && (
                        <a
                            href={profile.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button className="h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-primary/20">
                                <Download className="size-4" /> Download Resume
                            </Button>
                        </a>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Identity & Contact */}
                <div className="lg:col-span-4 space-y-8 sticky top-8">
                    {/* Identity Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-white/5 overflow-hidden shadow-sm">
                        <div className="h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative">
                            {profile.highestQualification && (
                                <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-[10px] font-black text-primary border border-primary/10 uppercase tracking-widest">
                                    {profile.highestQualification}
                                </div>
                            )}
                        </div>
                        <div className="px-8 pb-10 -mt-16 relative">
                            <div className="size-32 rounded-[2rem] bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 overflow-hidden shadow-xl mb-6 ring-4 ring-primary/5">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt={profile.name} className="size-full object-cover" />
                                ) : (
                                    <div className="size-full flex items-center justify-center text-4xl font-black text-slate-300 dark:text-slate-700">
                                        {profile.name[0]}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                                {profile.name}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-6">
                                {profile.previousRole || "Candidate"} {profile.previousIndustry ? `at ${profile.previousIndustry}` : ''}
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <div className="size-9 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5">
                                        <Mail className="size-4" />
                                    </div>
                                    <span className="text-sm font-medium truncate">{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <div className="size-9 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5">
                                        <Phone className="size-4" />
                                    </div>
                                    <span className="text-sm font-medium">{profile.phone || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <div className="size-9 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5">
                                        <MapPin className="size-4" />
                                    </div>
                                    <span className="text-sm font-medium">{profile.location}</span>
                                </div>
                            </div>

                            <div className="pt-8 flex items-center gap-4">
                                {profile.linkedinUrl && (
                                    <a href={profile.linkedinUrl} target="_blank" className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                        <Linkedin className="size-5" />
                                    </a>
                                )}
                                {profile.githubUrl && (
                                    <a href={profile.githubUrl} target="_blank" className="size-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                        <Github className="size-5" />
                                    </a>
                                )}
                                {profile.portfolioUrl && (
                                    <a href={profile.portfolioUrl} target="_blank" className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                        <Globe className="size-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <Zap className="absolute -right-4 -bottom-4 size-32 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/60 mb-6">Simulation Summary</h3>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-3xl font-black mb-1">{simulations.length}</p>
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Enrolled</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black mb-1">
                                    {Math.round(simulations.reduce((acc, s) => acc + (s.score || 0), 0) / (simulations.filter(s => s.score !== null).length || 1))}
                                </p>
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Avg Score</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Simulation History */}
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-white/5 p-8 md:p-10 shadow-sm relative border-l-4 border-l-amber-400">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <Zap className="size-6 text-amber-500" />
                                Performance History
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {simulations.length > 0 ? simulations.map((sim, i) => (
                                <div key={i} className="group p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0">
                                            {sim.bannerUrl ? <img src={sim.bannerUrl} alt="" className="size-full object-cover" /> : <div className="size-full bg-primary/10" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-primary transition-colors">{sim.title}</h4>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                                Enrolled {new Date(sim.enrolledAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="h-1.5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
                                                <div className="h-full bg-primary rounded-full" style={{ width: `${sim.progress}%` }} />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{sim.progress}% Progress</p>
                                        </div>
                                        {sim.score !== null && (
                                            <div className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl font-black text-xs shadow-sm">
                                                {sim.score}/100
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-500 font-medium text-sm italic">No simulations recorded yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Professional Experience */}
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-white/5 p-8 md:p-10 shadow-sm relative border-l-4 border-l-blue-400">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <Briefcase className="size-6 text-blue-500" />
                                Work Experience
                            </h2>
                        </div>
                        <div className="space-y-12">
                            {experience.length > 0 ? experience.map((exp, i) => (
                                <div key={i} className="relative pl-10 border-l-2 border-slate-100 dark:border-white/5 last:border-0 pb-2">
                                    <div className="absolute -left-[11px] top-0 size-5 rounded-full bg-white dark:bg-slate-900 border-4 border-blue-500 shadow-sm shadow-blue-500/20" />
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{exp.role}</h4>
                                            <p className="text-primary font-bold text-sm">{exp.company}</p>
                                        </div>
                                        <div className="px-3 py-1 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0 w-fit">
                                            {new Date(exp.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} — {exp.is_current || !exp.end_date ? 'Present' : new Date(exp.end_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        {exp.description}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-500 font-medium text-sm italic">No work experience listed.</p>
                            )}
                        </div>
                    </div>

                    {/* Academic History */}
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-white/5 p-8 md:p-10 shadow-sm relative border-l-4 border-l-emerald-400">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <GraduationCap className="size-6 text-emerald-500" />
                                Education
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {education.length > 0 ? education.map((edu, i) => (
                                <div key={i} className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:scale-[1.02] transition-transform">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10">
                                            <GraduationCap className="size-6 text-emerald-500" />
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {edu.graduation_year}
                                        </span>
                                    </div>
                                    <h4 className="font-black text-slate-900 dark:text-white text-base mb-1">{edu.degree_type}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs mb-4">{edu.institution}</p>
                                    {edu.cgpa && (
                                        <div className="pt-4 border-t border-slate-200/40 dark:border-white/5 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Merit</span>
                                            <span className="text-sm font-black text-slate-900 dark:text-white">{edu.cgpa} CGPA</span>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <p className="text-slate-500 font-medium text-sm italic col-span-2">No education recorded.</p>
                            )}
                        </div>
                    </div>

                    {/* Skill Mastery */}
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-white/5 p-8 md:p-10 shadow-sm relative border-l-4 border-l-purple-500">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <Award className="size-6 text-purple-500" />
                                Validated Skills
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {skills.length > 0 ? skills.map((skill, i) => (
                                <div key={i} className="group px-5 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center gap-3 hover:border-purple-500/30 transition-all">
                                    <span className="size-2 rounded-full bg-purple-500 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{skill.skill_name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{skill.proficiency_level}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-500 font-medium text-sm italic">No validated skills found.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
