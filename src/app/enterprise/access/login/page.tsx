"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Key, Lock, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { validateAccessCode } from "@/actions/enterprise";

export default function EnterpriseLoginPage() {
    const [accessCode, setAccessCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await validateAccessCode(accessCode);
            if (result.success) {
                // Save metadata for the flow
                sessionStorage.setItem("enterprise_setup_requestId", result.requestId!);
                sessionStorage.setItem("enterprise_setup_companyName", result.companyName!);
                sessionStorage.setItem("enterprise_setup_adminEmail", result.adminEmail!);
                sessionStorage.setItem("enterprise_setup_adminName", result.adminName || "");
                sessionStorage.setItem("enterprise_setup_industry", result.industry || "");
                sessionStorage.setItem("enterprise_setup_companySize", result.companySize || "");
                sessionStorage.setItem("enterprise_setup_website", result.website || "");

                if (result.isOnboarded) {
                    // Already have an account, go to dashboard
                    router.push("/dashboard");
                } else {
                    // First time, go to setup
                    router.push("/enterprise/setup");
                }
            } else {
                setError(result.error || "Validation failed");
            }
        } catch (err) {
            setError("Attempt failed. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
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

                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-xs font-bold animate-shake">
                                <AlertCircle className="size-4 shrink-0" />
                                {error}
                            </div>
                        )}

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
