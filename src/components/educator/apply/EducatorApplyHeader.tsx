"use client";

import { GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function EducatorApplyHeader() {
    return (
        <header className="pt-12 pb-8 px-4 text-center relative">

            <div className="flex flex-col items-center justify-center">
                <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <GraduationCap className="size-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-primary">Prominent Vantage</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">
                    Educator Access Application
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Complete this high-trust verification process to upgrade your account and access exclusive classroom tools.
                </p>
            </div>
        </header>
    );
}
