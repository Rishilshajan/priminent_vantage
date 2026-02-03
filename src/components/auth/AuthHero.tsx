import { Check } from "lucide-react";

interface AuthHeroProps {
    title: React.ReactNode;
    subtitle: string;
    features: {
        title: string;
        desc: string;
    }[];
}

export function AuthHero({ title, subtitle, features }: AuthHeroProps) {
    return (
        <div className="space-y-10 order-2 lg:order-1 hidden lg:block relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl opacity-60"></div>

            <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                    {title}
                </h1>
                <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                    {subtitle}
                </p>
            </div>

            <div className="space-y-6">
                {features.map((item, idx) => (
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
                    Trusted by top companies
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
