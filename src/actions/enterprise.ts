"use server";

import { Resend } from 'resend';
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

export async function saveEnterpriseReview(requestId: string, reviewData: {
    notes?: string;
    checklist?: any;
    history?: any;
    status?: string;
}) {
    const supabase = await createClient();

    try {
        const updateData: any = {};
        if (reviewData.notes !== undefined) updateData.admin_notes = reviewData.notes;
        if (reviewData.checklist !== undefined) updateData.checklist_state = reviewData.checklist;
        if (reviewData.history !== undefined) updateData.review_history = reviewData.history;
        if (reviewData.status !== undefined) updateData.status = reviewData.status;

        const { data, error } = await supabase
            .from("enterprise_requests")
            .update(updateData)
            .eq("id", requestId)
            .select();

        if (error) {
            console.error("Supabase Update Error:", error);
            await logServerEvent({
                level: 'ERROR',
                action: {
                    code: 'ENTERPRISE_REVIEW_SAVE_FAILED',
                    category: 'ORGANIZATION'
                },
                message: `Failed to save review progress for request ${requestId}: ${error.message}`,
                params: { requestId, error }
            });
            return { error: `Database error: ${error.message}` };
        }

        if (!data || data.length === 0) {
            return { error: "No records were updated. You might lack permissions or the request ID is invalid." };
        }

        // Log specific status changes or general progress
        await logServerEvent({
            level: 'SUCCESS',
            action: {
                code: reviewData.status === 'approved' ? 'ENTERPRISE_REQUEST_APPROVED' :
                    reviewData.status === 'rejected' ? 'ENTERPRISE_REQUEST_REJECTED' :
                        'ENTERPRISE_REVIEW_PROGRESS_SAVED',
                category: 'ORGANIZATION'
            },
            message: reviewData.status ? `Enterprise request status updated to ${reviewData.status} (Internal)` : 'Enterprise review progress saved (Internal)',
            params: { requestId, status: reviewData.status, emailSent: false }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Server Action Error:", err);
        await logServerEvent({
            level: 'ERROR',
            action: {
                code: 'ENTERPRISE_REVIEW_EXCEPTION',
                category: 'ORGANIZATION'
            },
            message: `Exception in saveEnterpriseReview: ${err.message}`,
            params: { requestId, error: err.message }
        });
        return { error: "An unexpected server error occurred." };
    }
}

export async function handleEnterpriseAction(
    requestId: string,
    action: "reject" | "clarify",
    reason: string,
    adminProfile: any,
    applicantData: { email: string; companyName: string; adminName: string }
) {
    const { adminName, companyName, email } = applicantData;
    const supabase = await createClient();
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const status = action === "reject" ? "rejected" : "clarification_requested";
        const historyEvent = {
            event: action === "reject"
                ? `Rejected by ${adminProfile.first_name || 'Admin'}`
                : `Clarification Requested by ${adminProfile.first_name || 'Admin'}`,
            date: "Just now",
            type: action === "reject" ? "success" as const : "warning" as const
        };

        // 1. Fetch current history to append
        const { data: currentReq } = await supabase
            .from("enterprise_requests")
            .select("review_history")
            .eq("id", requestId)
            .single();

        const updatedHistory = [...(currentReq?.review_history || []), historyEvent];

        // 2. Update Supabase
        const { error: updateError } = await supabase
            .from("enterprise_requests")
            .update({
                status: status,
                review_history: updatedHistory,
                admin_notes: reason
            })
            .eq("id", requestId);

        if (updateError) throw updateError;

        // 3. Send Email via Resend
        const emailSubject = action === "reject"
            ? `Update regarding your Enterprise Request: ${applicantData.companyName}`
            : `Information Needed: Enterprise Request for ${applicantData.companyName}`;

        const emailHtml = action === "reject"
            ? `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
                    <h2 style="color: #0f172a; font-size: 18px; font-weight: bold; margin-bottom: 16px;">Application Status Update</h2>
                    <p>Dear ${adminName},</p>
                    <p>Thank you for your interest in Vantage Enterprise. After careful review of your application for <strong>${companyName}</strong>, we are unable to approve your request at this time.</p>
                    <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
                        <h4 style="margin: 0 0 8px 0; color: #ef4444; font-size: 13px; font-weight: bold;">Reason for rejection:</h4>
                        <p style="margin: 0; font-size: 12px; line-height: 1.5;">${reason}</p>
                    </div>
                    <p>Possible reasons for data-driven rejections often include domain verification issues or incomplete professional profiles. If you believe this is an error, please feel free to reach out to our support team.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="font-size: 10px; color: #94a3b8; text-align: center;">&copy; 2026 Priminent Vantage. All rights reserved.</p>
                </div>
            `
            : `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
                    <h2 style="color: #0f172a; font-size: 18px; font-weight: bold; margin-bottom: 16px;">Clarification Needed</h2>
                    <p>Dear ${adminName},</p>
                    <p>We've started reviewing your Enterprise Request for <strong>${companyName}</strong>, but we need a bit more information to proceed with your verification.</p>
                    <div style="background-color: #f0fdfa; padding: 16px; border-radius: 8px; border-left: 4px solid #0d9488; margin: 20px 0;">
                        <h4 style="margin: 0 0 8px 0; color: #0d9488; font-size: 13px; font-weight: bold;">What we need:</h4>
                        <p style="margin: 0; font-size: 12px; line-height: 1.5;">${reason}</p>
                    </div>
                    <p>Please reply to this email or provide the requested details to help us complete your request.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="font-size: 10px; color: #94a3b8; text-align: center;">&copy; 2026 Priminent Vantage. All rights reserved.</p>
                </div>
            `;

        const { error: emailError } = await resend.emails.send({
            // Note: Replace with verifications@priminent.com once domain is verified in Resend
            from: 'Priminent Vantage <onboarding@resend.dev>',
            to: applicantData.email,
            subject: emailSubject,
            html: emailHtml,
        });

        if (emailError) {
            console.warn("Resend Email Error:", emailError);
            await logServerEvent({
                level: 'WARNING',
                action: { code: 'ENTERPRISE_EMAIL_FAILED', category: 'SYSTEM' },
                message: `Failed to send ${action} email to ${applicantData.email}`,
                params: { requestId, emailError }
            });
        } else {
            await logServerEvent({
                level: 'SUCCESS',
                action: { code: 'ENTERPRISE_EMAIL_SENT', category: 'SYSTEM' },
                message: `Successfully sent ${action} email to ${applicantData.email}`,
                params: { requestId, action }
            });
        }

        // 4. Log System Event
        await logServerEvent({
            level: 'SUCCESS',
            action: {
                code: action === "reject" ? 'ENTERPRISE_REQUEST_REJECTED' : 'ENTERPRISE_CLARIFICATION_REQUESTED',
                category: 'ORGANIZATION'
            },
            message: `Enterprise action ${action} completed for ${applicantData.companyName}`,
            params: { requestId, reason }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Action handler error:", err);
        return { error: err.message || "An unexpected error occurred during the action." };
    }
}
