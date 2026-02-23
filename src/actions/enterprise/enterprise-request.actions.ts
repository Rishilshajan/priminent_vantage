"use server";

import { enterpriseRequestService } from "@/lib/enterprise/enterprise-request.service";
import { EnterpriseRequestSchema, EnterpriseRequestState } from "@/lib/enterprise/types";
import { logServerEvent } from "@/lib/logger/server";
import { createClient } from "@/lib/supabase/server";
import { mailService } from "@/lib/mail/mail.service";

// Validates and submits a new enterprise partnership request form, logging the event on success
export async function submitEnterpriseRequest(prevState: any, formData: FormData): Promise<EnterpriseRequestState> {
    const sanitizeUrl = (url: string | null) => {
        if (!url) return null;
        const clean = url.replace(/(https?:\/\/)+/g, "").replace(/^www\./, "").trim();
        return `https://${clean}`;
    };

    const rawData = {
        companyName: formData.get("companyName"),
        country: formData.get("country"),
        website: sanitizeUrl(formData.get("website") as string),
        industry: formData.get("industry"),
        companySize: formData.get("companySize"),
        registrationNumber: formData.get("registrationNumber"),
        hqLocation: formData.get("hqLocation"),
        hiringRegions: formData.get("hiringRegions"),
        adminName: formData.get("adminName"),
        adminTitle: formData.get("adminTitle"),
        adminEmail: formData.get("adminEmail"),
        adminPhone: formData.get("adminPhone"),
        adminLinkedin: sanitizeUrl(formData.get("adminLinkedin") as string),
        objectives: formData.getAll("objectives"),
        useCase: formData.get("useCase"),
    };

    const validatedFields = EnterpriseRequestSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            error: "Validation failed",
            validationErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await enterpriseRequestService.submitRequest(validatedFields.data);
        await logServerEvent({
            level: 'SUCCESS',
            action: { code: 'ENTERPRISE_REQUEST_SUBMITTED', category: 'ORGANIZATION' },
            actor: { type: 'user', name: validatedFields.data.adminName },
            organization: { org_name: validatedFields.data.companyName },
            message: 'Enterprise request submitted successfully'
        });
        return { success: true };
    } catch (err: any) {
        return { error: "Failed to submit request." };
    }
}

// Persists admin review progress for an enterprise request without submitting a final decision
export async function saveEnterpriseReview(requestId: string, reviewData: any) {
    try {
        await enterpriseRequestService.saveReview(requestId, reviewData);
        return { success: true };
    } catch (err: any) {
        return { error: err.message || "Failed to save review progress" };
    }
}

// Processes an admin action (reject or clarify) on an enterprise request and sends a notification email
export async function handleEnterpriseAction(
    requestId: string,
    action: "reject" | "clarify",
    reason: string,
    adminProfile: any,
    applicantData: any
) {
    const supabase = await createClient();

    try {
        const status = action === "reject" ? "rejected" : "clarification_requested";
        const historyEvent = {
            event: action === "reject" ? `Rejected by ${adminProfile.first_name}` : `Clarification Requested by ${adminProfile.first_name}`,
            date: "Just now",
            type: action === "reject" ? "success" as const : "warning" as const
        };

        const { data: currentReq } = await supabase.from("enterprise_requests").select("review_history").eq("id", requestId).single();
        const updatedHistory = [...(currentReq?.review_history || []), historyEvent];

        await supabase.from("enterprise_requests").update({ status, review_history: updatedHistory, admin_notes: reason }).eq("id", requestId);

        await mailService.sendEnterpriseStatusUpdate(
            applicantData.email,
            applicantData.companyName,
            action,
            reason
        );

        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}

// Fetches all enterprise partnership requests for the admin review queue
export async function getEnterpriseRequests() {
    try {
        const data = await enterpriseRequestService.getRequests();
        return { data };
    } catch (err: any) {
        return { error: err.message };
    }
}

// Updates specific fields on an enterprise request record (e.g. during review)
export async function updateEnterpriseRequest(requestId: string, updateData: any) {
    try {
        const data = await enterpriseRequestService.updateRequest(requestId, updateData);
        return { success: true, data };
    } catch (err: any) {
        return { error: err.message };
    }
}

// Fetches all generated access codes and their associated metadata for the admin access codes view
export async function getAccessCodesData() {
    try {
        const data = await enterpriseRequestService.getAccessCodesData();
        return { success: true, data };
    } catch (err: any) {
        return { error: "Failed to load access codes." };
    }
}
