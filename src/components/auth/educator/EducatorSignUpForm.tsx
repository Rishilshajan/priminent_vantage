"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { signup, signInWithGoogle } from "@/actions/auth.actions";
import { PasswordInput } from "@/components/ui/password-input";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const signUpSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    phone: z.string().regex(phoneRegex, { message: "Invalid phone number" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function EducatorSignUpForm() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: undefined,
        },
    });

    const onSubmit = async (data: SignUpFormValues) => {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("phone", data.phone);
        formData.append("flow", "educator");

        const result = await signup(formData);

        if (result?.error) {
            alert(result.error);
        } else {
            alert("Account created! Check your email for the confirmation link.");
        }
    };

    return (
        <div className="order-1 lg:order-2">
            <div className="bg-card p-8 md:p-10 rounded-3xl shadow-2xl border border-border/50 max-w-md mx-auto w-full relative">
                {/* Decorative top gradient */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-primary to-purple-500 rounded-t-3xl"></div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Create Educator Account
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Start your free account today. No credit card required.
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
                        Or sign up with email
                    </span>
                    <div className="flex-grow border-t border-border"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                placeholder="Jane"
                                className={cn("h-11", errors.firstName && "border-destructive focus-visible:ring-destructive")}
                                {...register("firstName")}
                            />
                            {errors.firstName && (
                                <p className="text-xs text-destructive font-medium">{errors.firstName.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="Doe"
                                className={cn("h-11", errors.lastName && "border-destructive focus-visible:ring-destructive")}
                                {...register("lastName")}
                            />
                            {errors.lastName && (
                                <p className="text-xs text-destructive font-medium">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className={cn("h-11", errors.phone && "border-destructive focus-visible:ring-destructive")}
                            {...register("phone")}
                        />
                        {errors.phone && (
                            <p className="text-xs text-destructive font-medium">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@school.edu"
                            className={cn("h-11", errors.email && "border-destructive focus-visible:ring-destructive")}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <PasswordInput
                            id="password"
                            placeholder="Create a strong password"
                            className={cn("h-11", errors.password && "border-destructive focus-visible:ring-destructive")}
                            {...register("password")}
                        />
                        {errors.password ? (
                            <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                        ) : (
                            <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <PasswordInput
                            id="confirmPassword"
                            placeholder="Retype your password"
                            className={cn("h-11", errors.confirmPassword && "border-destructive focus-visible:ring-destructive")}
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                        <Checkbox
                            id="terms"
                            className="mt-1"
                            onCheckedChange={(checked: boolean | "indeterminate") => {
                                setValue('terms', checked === true, { shouldValidate: true });
                            }}
                            {...register("terms")}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms"
                                className="text-xs text-muted-foreground cursor-pointer"
                            >
                                I agree to the <Link href="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>. I consent to receive updates from Prominent Vantage.
                            </label>
                            {errors.terms && (
                                <p className="text-xs text-destructive font-medium">{errors.terms.message}</p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/educators/login" className="text-primary font-bold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
