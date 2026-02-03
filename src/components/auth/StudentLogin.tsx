"use client";

import { AuthHeader } from "./student/AuthHeader";
import { AuthFooter } from "./student/AuthFooter";
import { StudentBenefits } from "./student/StudentBenefits";
import { StudentLoginForm } from "./student/StudentLoginForm";

export function StudentLogin() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-poppins">
            <AuthHeader />

            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <StudentBenefits />
                    <StudentLoginForm />
                </div>
            </main>

            <AuthFooter />
        </div>
    );
}
