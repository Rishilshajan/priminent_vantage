"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PasswordUpdateSuccess() {
    return (
        <div className="order-1 lg:order-2">
            <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-2xl shadow-xl border border-border max-w-md mx-auto w-full text-center">
                <div className="inline-flex items-center justify-center size-20 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-8 animate-pulse">
                    <span className="material-symbols-outlined text-5xl">check_circle</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Password changed!</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                    Your password has been successfully updated. You can now log in to your account with your new credentials.
                </p>

                <div className="space-y-4">
                    <Link href="/login" className="block w-full">
                        <Button className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                            Back to Login
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
