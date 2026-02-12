"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { login } from "@/actions/auth/login.auth";
import { signInWithGoogle } from "@/actions/auth/shared.auth";
import { PasswordInput } from "@/components/ui/password-input";

const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function EducatorLoginForm() {
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
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("flow", "educator");

        const result = await login(formData);

        if (result?.error) {
            alert(result.error);
        }
    };

    return (
        <div className="order-1 lg:order-2">
            <div className="bg-card p-8 md:p-10 rounded-3xl shadow-2xl border border-border/50 max-w-md mx-auto w-full relative">
                {/* Decorative top gradient */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-primary to-purple-500 rounded-t-3xl"></div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Welcome Back, Educator
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Log in to continue empowering your students
                    </p>
                </div>

                <Button
                    variant="outline"
                    type="button"
                    onClick={() => signInWithGoogle('/educators/dashboard')}
                    className="w-full h-12 flex items-center justify-center gap-3 font-medium text-foreground bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 mb-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    Continue with Google
                </Button>

                <div className="relative flex py-2 items-center mb-6">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink-0 mx-4 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                        Or log in with email
                    </span>
                    <div className="flex-grow border-t border-border"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@university.edu"
                            className={cn("h-11", errors.email && "border-destructive focus-visible:ring-destructive")}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                                Forgot password?
                            </Link>
                        </div>
                        <PasswordInput
                            id="password"
                            placeholder="Enter your password"
                            className={cn("h-11", errors.password && "border-destructive focus-visible:ring-destructive")}
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging in..." : "Log In"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account? <Link href="/educators/signup" className="text-primary font-bold hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
