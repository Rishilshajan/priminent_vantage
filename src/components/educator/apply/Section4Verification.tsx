"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ShieldCheck, CloudUpload, Linkedin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormSection } from "./FormSection";

interface Section4Props {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
}

export function Section4Verification({ register, errors }: Section4Props) {
    return (
        <FormSection icon={ShieldCheck} number="4" title="Professional Verification">
            <div className="space-y-8">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        LinkedIn Profile
                        <span className="text-[11px] font-normal text-slate-400">(Public profile URL)</span>
                    </Label>
                    <div className="relative group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                            <Linkedin className="size-5" />
                        </div>
                        <Input
                            className={cn("h-11 pl-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary/20 transition-all",
                                errors.linkedinProfile && "border-destructive focus:ring-destructive/20")}
                            placeholder="https://linkedin.com/in/yourprofile"
                            {...register("linkedinProfile")}
                        />
                    </div>
                    {errors.linkedinProfile && (
                        <p className="text-xs text-destructive font-bold">{errors.linkedinProfile.message as string}</p>
                    )}
                </div>

                <div className="space-y-4">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload Verification Document</Label>
                    <div className="relative group">
                        <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center bg-slate-50/50 dark:bg-slate-900/50 hover:border-primary/50 hover:bg-primary/[0.02] transition-all cursor-pointer flex flex-col items-center">
                            <div className="size-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <CloudUpload className="size-7 text-slate-400 group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                <span className="font-bold text-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium italic">
                                Faculty ID, Employment letter, etc. (PDF, JPG, PNG - Max. 5MB)
                            </p>
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                {...register("verificationDocument")}
                            />
                        </label>
                    </div>
                </div>
            </div>
        </FormSection>
    );
}
