"use client"

import { Rocket, Eye, MessageSquare, PlayCircle, ArrowRight, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface SimulationDetailsProps {
    simulation: any;
    orgBranding?: any;
}

export function SimulationDetails({ simulation, orgBranding }: SimulationDetailsProps) {
    const brandColorText = orgBranding?.brand_color ? { color: orgBranding.brand_color } : {};

    const skills = simulation.skills?.length > 0
        ? simulation.skills.map((s: any) => s.skill_name)
        : [
            "Cloud Ecosystem",
            "Infrastructure as Code",
            "Security Best Practices",
            "High Availability Design",
            "Cost Optimization",
            "Kubernetes",
            "Serverless Architecture"
        ];

    const outcomes = simulation.learning_outcomes || [
        "Master enterprise cloud architecture patterns",
        "Implement production-grade IaC with Terraform",
        "Design for 99.99% availability and disaster recovery",
        "Optimize cloud spend for multi-million dollar budgets"
    ];

    return (
        <div className="space-y-20">
            {/* Why this Simulation */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-0.5 w-8 bg-primary rounded-full" style={orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {}} />
                    <h2 className="font-display text-3xl font-black tracking-tight text-slate-900 dark:text-white">Why this Simulation?</h2>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none mb-10">
                    <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                        {simulation.description || simulation.short_description || `Experience the day-to-day challenges of a professional in this field. This simulation isn't just about watching videos; it's about solving real-world infrastructure problems that affect millions of users. You'll work through actual project briefs used by our engineering teams.`}
                    </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                        <Rocket className="size-8 text-primary mb-4" style={brandColorText} />
                        <p className="font-black text-slate-900 dark:text-white mb-1">Real-world Tasks</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Based on internal projects</p>
                    </div>
                    <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                        <Eye className="size-8 text-primary mb-4" style={brandColorText} />
                        <p className="font-black text-slate-900 dark:text-white mb-1">CV Visibility</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Directly seen by recruiters</p>
                    </div>
                    <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                        <MessageSquare className="size-8 text-primary mb-4" style={brandColorText} />
                        <p className="font-black text-slate-900 dark:text-white mb-1">Expert Feedback</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Model answers provided</p>
                    </div>
                </div>
            </section>

            {/* Learning Outcomes */}
            <section>
                <div className="flex items-center gap-3 mb-10">
                    <div className="h-0.5 w-8 bg-primary rounded-full" style={orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {}} />
                    <h2 className="font-display text-3xl font-black tracking-tight text-slate-900 dark:text-white">What You Will Learn</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                    {outcomes.map((outcome: string, idx: number) => (
                        <div key={idx} className="flex gap-4 group">
                            <div className="mt-1 size-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                {outcome}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills You Will Master */}
            <section>
                <div className="flex items-center gap-3 mb-10">
                    <div className="h-0.5 w-8 bg-primary rounded-full" style={orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {}} />
                    <h2 className="font-display text-3xl font-black tracking-tight text-slate-900 dark:text-white">Skills You Will Master</h2>
                </div>

                <div className="flex flex-wrap gap-4">
                    {skills.map((skill: string) => (
                        <span
                            key={skill}
                            className="px-6 py-3 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-2xl text-sm font-black uppercase tracking-widest border border-slate-100 dark:border-white/5"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </section>

            {/* Welcome Video Section */}
            {simulation.intro_video_url && (
                <section className="bg-slate-900 dark:bg-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                    <div className="grid md:grid-cols-2">
                        <div className="p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-6 text-white/60">
                                <PlayCircle className="size-5" />
                                <span className="text-[10px] uppercase tracking-widest font-black">Introduction</span>
                            </div>
                            <h3 className="text-3xl font-display font-black text-white mb-6 leading-tight">
                                Meet the Engineering Team
                            </h3>
                            <p className="text-slate-400 mb-10 leading-relaxed font-medium">
                                Our lead architects explain why we created this simulation and what technical talents they're looking for when hiring.
                            </p>
                            <button className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-sm hover:text-primary transition-colors group">
                                Explore Career Opportunities
                                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                        <div className="relative aspect-video md:aspect-auto min-h-[300px] bg-black">
                            <video
                                controls
                                className="absolute inset-0 w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                                poster={simulation.banner_url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"}
                            >
                                <source src={simulation.intro_video_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}
