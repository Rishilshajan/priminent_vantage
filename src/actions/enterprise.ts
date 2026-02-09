"use server";

import { createClient } from "@/lib/supabase/server";
import { logServerEvent } from "@/lib/logger-server";
import { z } from "zod";

// Define validation schema
const EnterpriseRequestSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    country: z.string().min(1, "Country is required"),
    website: z.string().url("Invalid website URL"),
    industry: z.string().min(1, "Industry is required"),
    companySize: z.string().min(1, "Company size is required"),
    registrationNumber: z.string().min(1, "Registration number is required"),
    hqLocation: z.string().optional(),
    hiringRegions: z.string().optional(),

    adminName: z.string().min(1, "Admin name is required"),
    adminTitle: z.string().min(1, "Job title is required"),
    adminEmail: z.string().email("Invalid email address"),
    adminPhone: z.string().optional(),
    adminLinkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),

    objectives: z.array(z.string()).optional(),
    useCase: z.string().optional(),
});

export type EnterpriseRequestState = {
    success?: boolean;
    error?: string;
    validationErrors?: Record<string, string[]>;
};

export async function submitEnterpriseRequest(prevState: any, formData: FormData) {
    const supabase = await createClient();

    // Extract data from FormData
    const rawData = {
        companyName: formData.get("companyName"),
        country: formData.get("country"),
        website: formData.get("website"),
        industry: formData.get("industry"),
        companySize: formData.get("companySize"),
        registrationNumber: formData.get("registrationNumber"),
        hqLocation: formData.get("hqLocation"),
        hiringRegions: formData.get("hiringRegions"),

        adminName: formData.get("adminName"),
        adminTitle: formData.get("adminTitle"),
        adminEmail: formData.get("adminEmail"),
        adminPhone: formData.get("adminPhone"),
        adminLinkedin: formData.get("adminLinkedin"),

        objectives: formData.getAll("objectives"),
        useCase: formData.get("useCase"),

    };

    // Validate data
    const validatedFields = EnterpriseRequestSchema.safeParse(rawData);

    if (!validatedFields.success) {
        await logServerEvent({
            level: 'WARNING',
            action: {
                code: 'ENTERPRISE_REQUEST_VALIDATION_FAILED',
                category: 'ORGANIZATION'
            },
            message: 'Validation failed for enterprise request',
            params: { errors: validatedFields.error.flatten().fieldErrors }
        });
        return {
            error: "Validation failed",
            validationErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = validatedFields.data;

    try {
        const { error } = await supabase.from("enterprise_requests").insert({
            company_name: data.companyName,
            country: data.country,
            website: data.website,
            industry: data.industry,
            company_size: data.companySize,
            registration_number: data.registrationNumber,
            hq_location: data.hqLocation,
            hiring_regions: data.hiringRegions,

            admin_name: data.adminName,
            admin_title: data.adminTitle,
            admin_email: data.adminEmail,
            admin_phone: data.adminPhone,
            admin_linkedin: data.adminLinkedin || null,

            objectives: data.objectives,
            use_case_description: data.useCase,

            status: 'pending'
        });

        if (error) {
            console.error("Supabase Error:", error);
            await logServerEvent({
                level: 'ERROR',
                action: {
                    code: 'ENTERPRISE_REQUEST_FAILED',
                    category: 'ORGANIZATION'
                },
                actor: {
                    type: 'user',
                    name: data.adminName
                },
                message: error.message,
                params: { ...data }
            });
            return { error: "Failed to submit request. Please try again." };
        }

        await logServerEvent({
            level: 'SUCCESS',
            action: {
                code: 'ENTERPRISE_REQUEST_SUBMITTED',
                category: 'ORGANIZATION'
            },
            actor: {
                type: 'user',
                name: data.adminName
            },
            organization: {
                org_name: data.companyName
            },
            message: 'Enterprise request submitted successfully',
            params: { company: data.companyName }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Server Error:", err);
        await logServerEvent({
            level: 'ERROR',
            action: {
                code: 'ENTERPRISE_REQUEST_EXCEPTION',
                category: 'ORGANIZATION'
            },
            message: err.message || 'Unknown error',
            params: { ...data }
        });
        return { error: "An unexpected error occurred." };
    }
}
