"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { resetEnterprisePassword } from "@/actions/auth/enterprise.auth";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function EnterpriseForgotPasswordPage() {
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordValues) => {
        setStatus("idle");
        setErrorMessage(null);

        const formData = new FormData();
        formData.append("email", data.email);

        const result = await resetEnterprisePassword(formData);

        if (result?.error) {
            setStatus("error");
            setErrorMessage(result.error);
        } else {
            setStatus("success");
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
                        <h2 className="text-2xl font-bold text-foreground">
                            Reset Password
                        </h2>
                        <p className="mt-2 text-muted-foreground text-sm">
                            Enter your work email and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {status === "success" ? (
                        <div className="text-center space-y-6 animate-in zoom-in duration-300">
                            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
                                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                                <h3 className="text-lg font-bold text-green-700 dark:text-green-400">Check your email</h3>
                                <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                                    We&apos;ve sent a password reset link to your email address.
                                </p>
                            </div>
                            <Link href="/enterprise/signin" className="inline-flex items-center text-sm font-bold text-primary hover:underline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email" className="mb-1 block">Work Email</Label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            className={cn("pl-10 h-11", errors.email && "border-destructive focus-visible:ring-destructive")}
                                            {...register("email")}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-destructive font-medium mt-1">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>

                            {status === "error" && errorMessage && (
                                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-xs font-bold animate-shake">
                                    <AlertCircle className="size-4 shrink-0" />
                                    {errorMessage}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>

                            <div className="text-center mt-4">
                                <Link href="/enterprise/signin" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Sign In
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </main>

            <AuthFooter />
        </div>
    );
}
