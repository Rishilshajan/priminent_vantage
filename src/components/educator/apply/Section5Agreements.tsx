"use client";

import { UseFormSetValue, FieldErrors } from "react-hook-form";
import { Scale } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { FormSection } from "./FormSection";

interface Section5Props {
    setValue: UseFormSetValue<any>;
    errors: FieldErrors<any>;
}

export function Section5Agreements({ setValue, errors }: Section5Props) {
    const agreements = [
        {
            id: "confirmAccuracy",
            label: "I confirm that all information provided is accurate and that I am currently employed by the stated educational institution."
        },
        {
            id: "agreeTerms",
            label: (
                <>
                    I agree to the <a href="#" className="text-primary hover:underline font-bold">Educator Terms of Service</a> and understand my responsibilities regarding student data privacy.
                </>
            )
        },
        {
            id: "understandVerification",
            label: "I acknowledge that my application will undergo manual verification which may take up to 48 hours to complete."
        }
    ];

    return (
        <FormSection icon={Scale} number="5" title="Agreement & Consent">
            <div className="space-y-4">
                {agreements.map((item) => (
                    <div key={item.id} className="space-y-1">
                        <label
                            htmlFor={item.id}
                            className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-primary/30 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer group"
                        >
                            <Checkbox
                                id={item.id}
                                className="mt-1 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                onCheckedChange={(v) => setValue(item.id, v === true, { shouldValidate: true })}
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                {item.label}
                            </span>
                        </label>
                        {errors[item.id] && (
                            <p className="text-[11px] text-destructive font-bold pl-12">{(errors[item.id]?.message as string)}</p>
                        )}
                    </div>
                ))}
            </div>
        </FormSection>
    );
}
