"use client";

import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerificationNotice } from "./VerificationNotice";
import { CompanyDetails } from "./CompanyDetails";
import { AdminDetails } from "./AdminDetails";
import { IntendedUse } from "./IntendedUse";

export function RequestAccessForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data: any) => {
        console.log("Form Submitted:", data);
        // Here you would typically send the data to your API
        alert("Request submitted for review!");
    };

    return (
        <div className="bg-card text-card-foreground rounded-xl shadow-2xl border border-border overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 sm:p-12 space-y-16">

                {/* Section 1 */}
                <CompanyDetails register={register} />

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
                            className="w-full sm:w-auto px-10 py-4 h-auto text-base font-black shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            SUBMIT ACCESS REQUEST
                            <Send className="size-5" />
                        </Button>
                    </div>
                </footer>
            </form>
        </div>
    );
}
