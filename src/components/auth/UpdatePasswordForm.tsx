"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const updatePasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export function UpdatePasswordForm() {
    const router = useRouter();
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
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
            password: data.password
        });

        if (error) {
            alert(error.message); // Ideally replace with toast
        } else {
            router.push("/reset-password/update/success");
        }
    };

    return (
        <div className="order-1 lg:order-2">
            <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-2xl shadow-xl border border-border max-w-md mx-auto w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-6">
                        <span className="material-symbols-outlined text-4xl">lock_reset</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Set new password</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Please choose a strong password. It must be different from previously used passwords.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 h-12"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Setting Password..." : "Set New Password"}
                    </Button>

                    <div className="text-center mt-6">
                        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
                            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
