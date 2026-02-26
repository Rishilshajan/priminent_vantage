"use client"

import { cn } from "@/lib/utils"

interface HowItWorksProps {
    orgBranding?: any;
    tasks?: any[];
}

export function HowItWorks({ orgBranding, tasks }: HowItWorksProps) {
    const defaultSteps = [
        {
            title: "Learn from Experts",
            description: "Watch brief video briefings from our lead architects explaining the technical challenge and business context."
        },
        {
            title: "Submit Your Design",
            description: "Create an infrastructure diagram and technical specification based on the provided requirements."
        },
        {
            title: "Get Certified",
            description: "Review model answers, compare your work, and earn your official simulation certificate."
        }
    ];

    const steps = tasks && tasks.length > 0
        ? tasks.map(t => ({
            title: t.title,
            description: t.description
        }))
        : defaultSteps;

    return (
        <section className="py-20 lg:py-32 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3 mb-16">
                <div className="h-0.5 w-8 bg-primary rounded-full" style={orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {}} />
                <h2 className="font-display text-4xl font-black    text-slate-900 dark:text-white">What You&apos;ll Do</h2>
            </div>

            <div className="relative space-y-20">
                {/* Vertical Line */}
                <div className="absolute left-7 top-0 bottom-0 w-px bg-slate-200 dark:bg-white/10" />

                {steps.map((step, index) => (
                    <div key={index} className="relative flex gap-12 group">
                        <div
                            className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl z-10 shadow-xl shadow-primary/20 transform group-hover:scale-110 transition-transform duration-500"
                            style={orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {}}
                        >
                            {index + 1}
                        </div>
                        <div className="pt-2">
                            <h4 className="text-2xl font-black mb-4 text-slate-900 dark:text-white   ">{step.title}</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-2xl font-medium">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
