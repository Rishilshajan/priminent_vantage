import { BookOpen, TrendingUp, Award } from "lucide-react";

export function EducatorBenefits() {
    return (
        <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                    Empower your students with{" "}
                    <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                        real-world experience
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                    Join thousands of educators who use Prominent Vantage to bridge the gap between the classroom and the workplace. Integrate industry-backed simulations directly into your curriculum.
                </p>
            </div>

            <div className="space-y-6">
                {[
                    {
                        icon: BookOpen,
                        title: "Curriculum Integration",
                        desc: "Seamlessly add corporate simulations to your coursework to provide practical application of theory.",
                        color: "blue",
                    },
                    {
                        icon: TrendingUp,
                        title: "Track Student Progress",
                        desc: "Get detailed analytics on student completion rates, engagement, and skill development.",
                        color: "green",
                    },
                    {
                        icon: Award,
                        title: "Industry Certification",
                        desc: "Students earn recognized certificates from top global companies upon completion.",
                        color: "purple",
                    },
                ].map((item, idx) => {
                    const Icon = item.icon;
                    const colorClasses = {
                        blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                        green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
                        purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
                    };

                    return (
                        <div key={idx} className="flex items-start gap-4 group">
                            <div className={`mt-1 ${colorClasses[item.color as keyof typeof colorClasses]} p-2.5 rounded-lg shrink-0 group-hover:scale-110 transition-transform`}>
                                <Icon className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pt-8 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-6">
                    Trusted by educators from top institutions
                </p>
                <div className="flex flex-wrap gap-8 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-xl font-bold font-serif text-foreground/60">STANFORD</span>
                    <span className="text-xl font-bold font-mono text-foreground/60">MIT</span>
                    <span className="text-xl font-bold tracking-tighter text-foreground/60">HARVARD</span>
                    <span className="text-xl font-bold italic text-foreground/60">Berkeley</span>
                    <span className="text-xl font-bold tracking-widest text-foreground/60">OXFORD</span>
                </div>
            </div>
        </div>
    );
}
