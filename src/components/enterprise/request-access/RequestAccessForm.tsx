"use client";

import { useForm } from "react-hook-form";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerificationNotice } from "./VerificationNotice";
import { CompanyDetails } from "./CompanyDetails";
import { AdminDetails } from "./AdminDetails";
import { IntendedUse } from "./IntendedUse";
import { submitEnterpriseRequest } from "@/actions/enterprise/enterprise-request.actions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function RequestAccessForm() {
    const { register, control, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const onSubmit = (data: any) => {
        setError(null);
        const formData = new FormData();

        // Append all fields to FormData
        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => formData.append(key, v));
            } else if (value !== undefined && value !== null) {
                formData.append(key, value as string);
            }
        });

        startTransition(async () => {
            const result = await submitEnterpriseRequest(null, formData);

            if (result.error) {
                setError(result.error);
                // Scroll to top to show error
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else if (result.success) {
                router.push("/enterprise/request-access/confirmation");
            }
        });
    };

    return (
        <div className="bg-card text-card-foreground rounded-xl shadow-2xl border border-border overflow-hidden">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 border-l-4 border-red-500 m-8 mb-0">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 sm:p-12 space-y-16">

                {/* Section 1 */}
                <CompanyDetails register={register} control={control} errors={errors} />

                {/* Section 2 */}
                <AdminDetails register={register} />

                {/* Section 3 */}
                <IntendedUse register={register} />

                <footer className="pt-8 border-t border-border">
                    <div className="space-y-4 mb-10">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                required
                                className="mt-1 size-5 shrink-0 rounded border-input text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-muted-foreground">
                                I have read and agree to the <a href="#" className="text-primary hover:underline font-semibold">Terms of Service</a> and <a href="#" className="text-primary hover:underline font-semibold">Privacy Policy</a> regarding enterprise data handling.
                            </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                required
                                className="mt-1 size-5 shrink-0 rounded border-input text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-muted-foreground">
                                I consent to the manual verification of my business credentials and understand that platform access is subject to approval.
                            </span>
                        </label>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-muted/50 -mx-8 -mb-12 p-8 sm:px-12">
                        <div className="text-center sm:text-left">
                            <p className="text-sm font-bold text-foreground">Ready for review?</p>
                            <p className="text-xs text-muted-foreground">Ensure all mandatory (*) fields are accurate.</p>
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full sm:w-auto px-10 py-4 h-auto text-base font-black shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    SUBMITTING...
                                    <Loader2 className="size-5 animate-spin" />
                                </>
                            ) : (
                                <>
                                    SUBMIT ACCESS REQUEST
                                    <Send className="size-5" />
                                </>
                            )}
                        </Button>
                    </div>
                </footer>
            </form>
        </div>
    );
}
