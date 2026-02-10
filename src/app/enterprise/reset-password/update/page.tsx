"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { useState } from "react";

const updatePasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export default function EnterpriseUpdatePasswordPage() {
    const router = useRouter();
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePasswordValues>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: UpdatePasswordValues) => {
        setUpdateError(null);
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
            password: data.password
        });

        if (error) {
            setUpdateError(error.message);
        } else {
            setIsSuccess(true);
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
                            Set New Password
                        </h2>
                        <p className="mt-2 text-muted-foreground text-sm">
                            Create a strong, unique password for your enterprise account.
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="text-center space-y-6 animate-in zoom-in duration-300">
                            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
                                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                                <h3 className="text-lg font-bold text-green-700 dark:text-green-400">Password Updated!</h3>
                                <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                                    Your password has been successfully reset.
                                </p>
                            </div>
                            <Button
                                onClick={() => router.push("/enterprise/signin")}
                                className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25"
                            >
                                Sign In Now
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <PasswordInput
                                        id="password"
                                        placeholder="••••••••"
                                        className={cn("h-11", errors.password && "border-destructive focus-visible:ring-destructive")}
                                        {...register("password")}
                                    />
                                    {errors.password && (
                                        <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <PasswordInput
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        className={cn("h-11", errors.confirmPassword && "border-destructive focus-visible:ring-destructive")}
                                        {...register("confirmPassword")}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>

                            {updateError && (
                                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-xs font-bold animate-shake">
                                    <AlertCircle className="size-4 shrink-0" />
                                    {updateError}
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
                                        Updating...
                                    </>
                                ) : (
                                    "Update Password"
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
