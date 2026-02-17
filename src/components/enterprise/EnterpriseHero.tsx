"use client";

import { cn } from "@/lib/utils";

export function EnterpriseHero() {
    return (
        <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                For Enterprise
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Transform your <span className="text-primary">early talent</span> recruiting strategy
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
                Join top companies using Priminent Vantage to showcase their employer brand, upskill candidates, and hire the best diverse talent at scale through virtual job simulations.
            </p>
        </div>
    );
}
