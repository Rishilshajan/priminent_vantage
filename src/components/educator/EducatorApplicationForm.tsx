"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, BadgeCheck } from "lucide-react";
import { submitEducatorApplication } from "../../actions/educator-application.actions";
import { Section1Institutional } from "./apply/Section1Institutional";
import { Section2Academic } from "./apply/Section2Academic";
import { Section3Usage } from "./apply/Section3Usage";
import { Section4Verification } from "./apply/Section4Verification";
import { Section5Agreements } from "./apply/Section5Agreements";

const BLOCKED_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "aol.com"];

const educatorApplicationSchema = z.object({
    fullName: z.string().min(2),
    institutionalEmail: z.string()
        .email("Invalid email format")
        .refine((email) => {
            const domain = email.split("@")[1];
            return !BLOCKED_DOMAINS.includes(domain?.toLowerCase());
        }, "Please use your official institutional email address (e.g., @university.edu)"),
    institutionName: z.string().min(2, "Institution name is required"),
    institutionWebsite: z.string().url("Invalid URL").or(z.literal("")),
    department: z.string().min(2, "Department is required"),
    designation: z.string().min(1, "Please select your designation"),
    designationOther: z.string().optional(),

    coursesTeaching: z.string().min(5, "Please list at least one course"),
    academicLevel: z.string().min(1, "Please select an academic level"),
    academicLevelOther: z.string().optional(),
    estimatedStudents: z.string().min(1, "Please provide an estimate"),

    intendedUsage: z.string().min(20, "Please provide more detail about your intended usage"),
    implementationTypes: z.array(z.string()).min(1, "Select at least one implementation type"),

    linkedinProfile: z.string().url("Invalid LinkedIn URL").or(z.literal("")),
    verificationDocument: z.any().optional(),

    confirmAccuracy: z.boolean().refine(v => v === true, "Accuracy confirmation is required"),
    agreeTerms: z.boolean().refine(v => v === true, "Terms agreement is required"),
    understandVerification: z.boolean().refine(v => v === true, "Verification acknowledgment is required"),
});

type EducatorApplicationValues = z.infer<typeof educatorApplicationSchema>;

interface EducatorApplicationFormProps {
    profile: any;
}

export function EducatorApplicationForm({ profile }: EducatorApplicationFormProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<EducatorApplicationValues>({
        resolver: zodResolver(educatorApplicationSchema),
        defaultValues: {
            fullName: `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim(),
            institutionalEmail: "",
            institutionName: "",
            institutionWebsite: "",
            department: "",
            designation: "",
            coursesTeaching: "",
            academicLevel: "",
            estimatedStudents: "",
            intendedUsage: "",
            implementationTypes: [],
            linkedinProfile: "",
            confirmAccuracy: false,
            agreeTerms: false,
            understandVerification: false,
        },
    });

    const onSubmit = async (data: EducatorApplicationValues) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === "implementationTypes") {
                value.forEach((v: string) => formData.append("implementationTypes", v));
            } else if (key === "verificationDocument" && value?.[0]) {
                formData.append("verificationDocument", value[0]);
            } else {
                formData.append(key, value as string);
            }
        });

        const result = await submitEducatorApplication(formData);
        if (result.success) {
            setIsSubmitted(true);
        } else {
            alert(result.error || "Something went wrong. Please try again.");
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl mx-auto my-12 animate-in fade-in zoom-in duration-500">
                <div className="size-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-8 shadow-inner shadow-green-500/10">
                    <CheckCircle2 className="size-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-4xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight italic">
                    Application Received!
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-md leading-relaxed">
                    Thank you for applying. Our academic partnerships team will review your credentials manually. This process typically takes <span className="text-primary font-bold">24-48 hours</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Button asChild className="h-14 px-10 font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
                        <a href="/educators/dashboard">View Dashboard</a>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Section1Institutional register={register} errors={errors} setValue={setValue} watch={watch} profile={profile} />
            <Section2Academic register={register} errors={errors} setValue={setValue} watch={watch} />
            <Section3Usage register={register} errors={errors} setValue={setValue} watch={watch} />
            <Section4Verification register={register} errors={errors} />
            <Section5Agreements setValue={setValue} errors={errors} />

            <div className="pt-10 flex flex-col items-center gap-6">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto h-16 md:px-16 text-xl font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                            Processing Application...
                        </>
                    ) : (
                        <>
                            <BadgeCheck className="mr-3 h-6 w-6" />
                            Submit for Verification
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
