"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { resetPasswordForEmail } from "@/app/auth/actions";

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
    const router = useRouter();
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
        const formData = new FormData();
        formData.append("email", data.email);

        const result = await resetPasswordForEmail(formData);

        if (result?.error) {
            alert(result.error);
        } else {
            router.push(`/forgot-password/confirmation?email=${encodeURIComponent(data.email)}`);
        }
    };

    return (
        <div className="order-1 lg:order-2">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-border max-w-md mx-auto w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary mb-5">
                        <span className="material-symbols-outlined text-3xl">lock_reset</span>

                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">Forgot password?</h2>
                    <p className="text-muted-foreground text-sm">
                        Enter the email address associated with your account and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Label htmlFor="email" className="mb-1 block">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@school.edu"
                            className={cn("w-full py-2.5 h-11", errors.email && "border-destructive focus-visible:ring-destructive")}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive font-medium mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 h-12"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </Button>

                    <div className="text-center">
                        <Link href="/login" className="inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            Back to Login Page
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
