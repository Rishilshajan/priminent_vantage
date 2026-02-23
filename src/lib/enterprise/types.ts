import { z } from "zod";

export const EnterpriseRequestSchema = z.object({
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

export type EnterpriseRequestData = z.infer<typeof EnterpriseRequestSchema>;

export type EnterpriseRequestState = {
    success?: boolean;
    error?: string;
    validationErrors?: Record<string, string[]>;
};
