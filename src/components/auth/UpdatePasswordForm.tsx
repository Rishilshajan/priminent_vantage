"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
            alert(error.message);
        } else {
            alert("Password updated successfully!");
            router.push("/dashboard");
        }
    };

    return (
        <div className="order-1 lg:order-2">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-border max-w-md mx-auto w-full">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-3">Update Password</h2>
                    <p className="text-muted-foreground text-sm">
                        Enter your new password below.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <PasswordInput
                            id="password"
                            placeholder="Enter new password"
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
                            placeholder="Confirm new password"
                            className={cn("h-11", errors.confirmPassword && "border-destructive focus-visible:ring-destructive")}
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 h-12"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
