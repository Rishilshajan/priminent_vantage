"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PasswordResetConfirmation() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "name@school.edu";

    return (
        <div className="order-1 lg:order-2">
            <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-2xl shadow-xl border border-border max-w-md mx-auto w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-6">
                        <span className="material-symbols-outlined text-4xl">mark_email_read</span>

                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Check your email</h2>
                    <div className="space-y-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            We&apos;ve sent a password reset link to<br />
                            <span className="font-bold text-foreground text-base">{email}</span>
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                            <p className="text-xs text-muted-foreground">
                                Did not receive the email? Check your spam filter, or try another email address.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Link href="/login" className="block w-full">
                        <Button className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                            Back to Login
                        </Button>
                    </Link>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Still don't see the email? <br className="sm:hidden" />
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="text-primary hover:text-primary-dark font-bold hover:underline transition-colors mt-1 sm:mt-0 ml-1"
                            >
                                Click to resend
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
