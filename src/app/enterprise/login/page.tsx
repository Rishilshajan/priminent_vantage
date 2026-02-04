"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Key, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";

export default function EnterpriseLoginPage() {
    const [accessCode, setAccessCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login delay
        setTimeout(() => {
            setIsLoading(false);
            alert("Access Code validation would happen here.");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background font-poppins">
            <AuthHeader />

            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[800px] bg-primary/5 rounded-full blur-3xl opacity-20 pointer-events-none -z-10"></div>

                <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl shadow-xl border border-border animate-fade-in-up">
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                            <Lock className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Enterprise Access
                        </h2>
                        <p className="mt-2 text-muted-foreground text-sm">
                            Enter your unique access code to sign in to your organization's dashboard.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input
                                    id="access-code"
                                    name="accessCode"
                                    type="text"
                                    required
                                    className="pl-11 h-12 text-lg bg-background border-border focus:border-primary transition-all"
                                    placeholder="Enter Access Code"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Access Dashboard"
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <Link href="/enterprise" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Enterprise Home
                        </Link>
                    </div>
                </div>
            </main>

            <AuthFooter />
        </div>
    );
}
