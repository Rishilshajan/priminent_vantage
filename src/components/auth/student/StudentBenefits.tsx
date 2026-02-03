import { Check } from "lucide-react";

export function StudentBenefits() {
    return (
        <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                    3x your chances of <br />
                    <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                        landing a job
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                    Join over 2 million students bridging the gap between education and the workplace with real-world simulations.
                </p>
            </div>

            <div className="space-y-6">
                {[
                    {
                        title: "Get real-world work experience",
                        desc: "Complete tasks that replicate actual work at top companies.",
                    },
                    {
                        title: "Build skills employers are looking for",
                        desc: "Gain practical skills that you can showcase on your resume.",
                    },
                    {
                        title: "Set yourself apart from candidates",
                        desc: "Earn certificates to demonstrate your expertise and commitment.",
                    },
                ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 group">
                        <div className="mt-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1.5 rounded-full shrink-0 group-hover:scale-110 transition-transform">
                            <Check className="size-4 stroke-[3px]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-8 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-6">
                    Learn from top companies
                </p>
                <div className="flex flex-wrap gap-8 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-xl font-bold font-serif text-foreground/60">JPMorgan</span>
                    <span className="text-xl font-bold font-sans text-foreground/60 tracking-tighter">Deloitte.</span>
                    <span className="text-lg font-bold font-mono text-foreground/60 lowercase">accenture</span>
                    <span className="text-xl font-bold text-foreground/60 italic">Citi</span>
                </div>
            </div>
        </div>
    );
}
