"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { login } from "@/actions/auth/login.auth";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function EnterpriseSignInPage() {
    const router = useRouter();
    const [loginError, setLoginError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setLoginError(null);
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);

        const result = await login(formData);

        if (result?.error) {
            setLoginError(result.error);
        }
        // If success, redirect happens in server action
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
                        <h2 className="text-2xl font-bold    text-foreground">
                            Enterprise Login
                        </h2>
                        <p className="mt-2 text-muted-foreground text-sm">
                            Sign in to manage your organization's dashboard.
                        </p>
                    </div>

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

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="/enterprise/forgot-password" className="text-sm font-medium text-primary hover:text-primary-dark hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <PasswordInput
                                    id="password"
                                    placeholder="Enter your password"
                                    className={cn("w-full py-2.5 h-11", errors.password && "border-destructive focus-visible:ring-destructive")}
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-xs text-destructive font-medium mt-1">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        {loginError && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-xs font-bold animate-shake">
                                <AlertCircle className="size-4 shrink-0" />
                                {loginError}
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
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="text-center space-y-4">
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-border"></div>
                            <span className="flex-shrink-0 mx-4 text-xs font-bold text-muted-foreground uppercase">New to Vantage?</span>
                            <div className="flex-grow border-t border-border"></div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Link href="/enterprise/login" className="text-sm font-medium text-primary hover:text-primary-dark hover:underline">
                                Enter Access Code
                            </Link>
                        </div>

                        <Link href="/enterprise" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors pt-4">
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
