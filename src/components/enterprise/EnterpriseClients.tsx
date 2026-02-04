"use client";

import { Diamond, Zap, Landmark } from "lucide-react";

export function EnterpriseClients() {
    return (
        <div className="pt-8 border-t border-border mt-8">
            <p className="text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-wide">
                Trusted by industry leaders
            </p>
            <div className="flex flex-wrap gap-8 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-bold text-foreground text-xl">
                    <Diamond className="size-6" /> GlobalCorp
                </div>
                <div className="flex items-center gap-2 font-bold text-foreground text-xl">
                    <Zap className="size-6" /> TechGiant
                </div>
                <div className="flex items-center gap-2 font-bold text-foreground text-xl">
                    <Landmark className="size-6" /> BankOne
                </div>
            </div>
        </div>
    );
}
