"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface FormSectionProps {
    icon: LucideIcon;
    number: string;
    title: string;
    children: ReactNode;
}

export function FormSection({ icon: Icon, number, title, children }: FormSectionProps) {
    return (
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800 p-8 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Icon className="size-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold dark:text-white tracking-tight">
                    <span className="text-primary/50 font-mono text-lg mr-1">{number}.</span> {title}
                </h2>
            </div>
            {children}
        </section>
    );
}
