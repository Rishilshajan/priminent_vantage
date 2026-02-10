"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { createClient } from "@/lib/supabase/client";

export default function MFAVerifyPage() {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [factorId, setFactorId] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function checkFactors() {
            const { data, error } = await supabase.auth.mfa.listFactors();
            if (error || !data.all || data.all.length === 0) {
                router.push("/enterprise/signin");
                return;
            }
            // For now, take the first active factor
            setFactorId(data.all[0].id);
        }
        checkFactors();
    }, [router, supabase.auth.mfa]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!factorId) return;

        setError(null);
        setIsLoading(true);

        try {
            const challenge = await supabase.auth.mfa.challenge({ factorId });
            if (challenge.error) {
                setError(challenge.error.message);
                setIsLoading(false);
                return;
            }

            const verify = await supabase.auth.mfa.verify({
                factorId,
                challengeId: challenge.data.id,
                code: code,
            });

            if (verify.error) {
                setError(verify.error.message);
            } else {
                // Success! Redirect to dashboard
                router.push("/enterprise/dashboard");
            }
        } catch (err) {
            setError("Verification failed. Please try again.");
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
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Two-Step Verification
                        </h2>
                        <p className="mt-2 text-muted-foreground text-sm">
                            Enter the 6-digit code from your authenticator app to continue.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                        <div className="space-y-4">
                            <Input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                pattern="\d{6}"
                                maxLength={6}
                                required
                                className="h-14 text-center text-2xl font-bold tracking-[0.5em] bg-background border-border focus:border-primary transition-all"
                                placeholder="000000"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                disabled={isLoading}
                                autoFocus
                            />
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
                            disabled={isLoading || code.length !== 6}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Code"
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <button
                            onClick={() => router.push("/enterprise/signin")}
                            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Sign In
                        </button>
                    </div>
                </div>
            </main>

            <AuthFooter />
        </div>
    );
}
