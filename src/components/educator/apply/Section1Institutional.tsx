"use client";

import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { BadgeCheck, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FormSection } from "./FormSection";

interface Section1Props {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    setValue: UseFormSetValue<any>;
    watch: (name: string) => any;
    profile: any;
}

export function Section1Institutional({ register, errors, setValue, watch, profile }: Section1Props) {
    const designation = watch("designation");

    return (
        <FormSection icon={BadgeCheck} number="1" title="Personal & Institutional Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
                    <Input
                        className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-500 cursor-not-allowed font-medium"
                        readOnly
                        value={`${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "Dr. Alexander Sterling"}
                    />
                    <p className="text-[11px] text-slate-400 font-medium">Read-only, auto-filled from account settings.</p>
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Institutional Email Address
                        <Info className="size-3.5 text-slate-400 cursor-help" />
                    </Label>
                    <Input
                        className={cn("h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary/20 transition-all",
                            errors.institutionalEmail && "border-destructive focus:ring-destructive/20")}
                        placeholder="name@university.edu"
                        {...register("institutionalEmail")}
                    />
                    {errors.institutionalEmail && (
                        <p className="text-xs text-destructive font-bold">{errors.institutionalEmail.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Institution Name</Label>
                    <Input
                        className={cn("h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary/20 transition-all",
                            errors.institutionName && "border-destructive focus:ring-destructive/20")}
                        placeholder="e.g., Stanford University"
                        {...register("institutionName")}
                    />
                    {errors.institutionName && (
                        <p className="text-xs text-destructive font-bold">{errors.institutionName.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Institution Website</Label>
                    <Input
                        className={cn("h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary/20 transition-all",
                            errors.institutionWebsite && "border-destructive focus:ring-destructive/20")}
                        placeholder="https://www.university.edu"
                        {...register("institutionWebsite")}
                    />
                    {errors.institutionWebsite && (
                        <p className="text-xs text-destructive font-bold">{errors.institutionWebsite.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Department / Faculty</Label>
                    <Input
                        className={cn("h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary/20 transition-all",
                            errors.department && "border-destructive focus:ring-destructive/20")}
                        placeholder="e.g., Computer Science"
                        {...register("department")}
                    />
                    {errors.department && (
                        <p className="text-xs text-destructive font-bold">{errors.department.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Designation / Role</Label>
                    <Select onValueChange={(v: string) => setValue("designation", v, { shouldValidate: true })}>
                        <SelectTrigger className={cn("h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary/20 transition-all",
                            errors.designation && "border-destructive focus:ring-destructive/20")}>
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                            <SelectItem value="professor">Professor</SelectItem>
                            <SelectItem value="assistant-professor">Assistant Professor</SelectItem>
                            <SelectItem value="lecturer">Lecturer</SelectItem>
                            <SelectItem value="career-advisor">Career Advisor</SelectItem>
                            <SelectItem value="placement-officer">Placement Officer</SelectItem>
                            <SelectItem value="trainer">Trainer</SelectItem>
                            <SelectItem value="other">Other (specify)</SelectItem>
                        </SelectContent>
                    </Select>
                    {designation === "other" && (
                        <Input
                            className="mt-3 h-11 rounded-xl border-slate-200 dark:border-slate-800"
                            placeholder="Please specify your role"
                            {...register("designationOther")}
                        />
                    )}
                    {errors.designation && (
                        <p className="text-xs text-destructive font-bold mt-1">{errors.designation.message as string}</p>
                    )}
                </div>
            </div>
        </FormSection>
    );
}
