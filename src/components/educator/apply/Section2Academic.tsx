"use client";

import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { GraduationCap } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FormSection } from "./FormSection";

interface Section2Props {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    setValue: UseFormSetValue<any>;
    watch: (name: string) => any;
}

export function Section2Academic({ register, errors, setValue, watch }: Section2Props) {
    const academicLevel = watch("academicLevel");

    return (
        <FormSection icon={GraduationCap} number="2" title="Academic Context">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Courses Teaching</Label>
                    <Input
                        className={cn("h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary/20",
                            errors.coursesTeaching && "border-destructive focus:ring-destructive/20")}
                        placeholder="e.g., Advanced Machine Learning, Intro to Algorithms"
                        {...register("coursesTeaching")}
                    />
                    {errors.coursesTeaching && (
                        <p className="text-xs text-destructive font-bold">{errors.coursesTeaching.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Academic Level</Label>
                    <Select onValueChange={(v: string) => setValue("academicLevel", v, { shouldValidate: true })}>
                        <SelectTrigger className={cn("h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary/20",
                            errors.academicLevel && "border-destructive focus:ring-destructive/20")}>
                            <SelectValue placeholder="Select Academic Level" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                            <SelectItem value="undergraduate">Undergraduate</SelectItem>
                            <SelectItem value="postgraduate">Postgraduate</SelectItem>
                            <SelectItem value="diploma">Diploma</SelectItem>
                            <SelectItem value="bootcamp">Bootcamp</SelectItem>
                            <SelectItem value="career-development">Career Development</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    {academicLevel === "other" && (
                        <Input
                            className="mt-3 h-11 rounded-xl border-slate-200 dark:border-slate-800"
                            placeholder="Please specify academic level"
                            {...register("academicLevelOther")}
                        />
                    )}
                    {errors.academicLevel && (
                        <p className="text-xs text-destructive font-bold mt-1">{errors.academicLevel.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Estimated Number of Students</Label>
                    <Input
                        className={cn("h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary/20",
                            errors.estimatedStudents && "border-destructive focus:ring-destructive/20")}
                        placeholder="e.g., 60-120"
                        {...register("estimatedStudents")}
                    />
                    {errors.estimatedStudents && (
                        <p className="text-xs text-destructive font-bold">{errors.estimatedStudents.message as string}</p>
                    )}
                </div>
            </div>
        </FormSection>
    );
}
