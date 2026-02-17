"use client";

import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { ClipboardList } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { FormSection } from "./FormSection";

interface Section3Props {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    setValue: UseFormSetValue<any>;
    watch: (name: string) => any;
}

export function Section3Usage({ register, errors, setValue, watch }: Section3Props) {
    const implementationTypes = watch("implementationTypes") || [];

    const handleToggle = (type: string) => {
        const current = [...implementationTypes];
        const index = current.indexOf(type);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(type);
        }
        setValue("implementationTypes", current, { shouldValidate: true });
    };

    const options = [
        { id: "in-class", label: "In-class assignment" },
        { id: "optional", label: "Optional career preparation" },
        { id: "placement", label: "Placement preparation" },
        { id: "graded", label: "Graded coursework" },
        { id: "workshop", label: "Skill enhancement workshop", fullWidth: true },
    ];

    return (
        <FormSection icon={ClipboardList} number="3" title="Intended Usage">
            <div className="space-y-8">
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">How do you plan to use Priminent Vantage?</Label>
                    <p className="text-xs text-slate-400 mb-2">Describe your educational goals and how our platform fits your curriculum.</p>
                    <Textarea
                        className={cn("min-h-[140px] rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary/20 transition-all resize-none p-4",
                            errors.intendedUsage && "border-destructive focus:ring-destructive/20")}
                        placeholder="e.g., I plan to integrate job simulations into my curriculum..."
                        {...register("intendedUsage")}
                    />
                    {errors.intendedUsage && (
                        <p className="text-xs text-destructive font-bold">{errors.intendedUsage.message as string}</p>
                    )}
                </div>

                <div className="space-y-4">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Implementation Type</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {options.map((opt) => (
                            <label
                                key={opt.id}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group",
                                    implementationTypes.includes(opt.id)
                                        ? "bg-primary/5 border-primary shadow-sm"
                                        : "bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 hover:border-primary/30",
                                    opt.fullWidth && "md:col-span-2"
                                )}
                            >
                                <Checkbox
                                    className="rounded border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    checked={implementationTypes.includes(opt.id)}
                                    onCheckedChange={() => handleToggle(opt.id)}
                                />
                                <span className={cn(
                                    "text-sm font-medium transition-colors",
                                    implementationTypes.includes(opt.id) ? "text-primary font-bold" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                                )}>
                                    {opt.label}
                                </span>
                            </label>
                        ))}
                    </div>
                    {errors.implementationTypes && (
                        <p className="text-xs text-destructive font-bold">{errors.implementationTypes.message as string}</p>
                    )}
                </div>
            </div>
        </FormSection>
    );
}
