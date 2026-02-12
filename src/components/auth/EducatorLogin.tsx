"use client";

import { AuthHeader } from "./AuthHeader";
import { AuthFooter } from "./AuthFooter";
import { EducatorBenefits } from "./educator/EducatorBenefits";
import { EducatorLoginForm } from "./educator/EducatorLoginForm";

export function EducatorLogin() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-poppins">
            <AuthHeader />

            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

                {/* Background Decoration */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-primary/5 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <EducatorBenefits />
                    <EducatorLoginForm />
                </div>
            </main>

            <AuthFooter />
        </div>
    );
}
