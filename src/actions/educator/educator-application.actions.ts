"use server";

import { educatorApplicationService } from "@/lib/educator/educator-application.service";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Submits a new educator application with personal, institutional, and verification document data
export async function submitEducatorApplication(formData: FormData) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "You must be logged in to apply." };
        }

        const data = {
            full_name: formData.get("fullName"),
            institutional_email: formData.get("institutionalEmail"),
            institution_name: formData.get("institutionName"),
            institution_website: formData.get("institutionWebsite"),
            department: formData.get("department"),
            designation: formData.get("designation") === "Other" ? formData.get("designationOther") : formData.get("designation"),
            courses_teaching: formData.get("coursesTeaching"),
            academic_level: formData.get("academicLevel") === "Other" ? formData.get("academicLevelOther") : formData.get("academicLevel"),
            estimated_students: formData.get("estimatedStudents"),
            intended_usage: formData.get("intendedUsage"),
            implementation_types: formData.getAll("implementationTypes"),
            linkedin_profile: formData.get("linkedinProfile"),
        };

        const file = formData.get("verificationDocument") as File | null;

        await educatorApplicationService.submitApplication(user.id, data, file);

        revalidatePath('/educators/dashboard');
        revalidatePath('/educators/apply');

        return { success: true };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

// Persists admin review notes and scores for a specific educator application without finalizing the decision
export async function saveEducatorReview(applicationId: string, reviewData: any) {
    try {
        await educatorApplicationService.saveReview(applicationId, reviewData);
        revalidatePath(`/admin/educators/applications/${applicationId}`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to save review progress" };
    }
}

// Updates one or more fields on an existing educator application record
export async function updateEducatorApplication(applicationId: string, updates: any) {
    try {
        await educatorApplicationService.updateApplication(applicationId, updates);
        revalidatePath(`/admin/educators/applications/${applicationId}`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to update application" };
    }
}

// Processes a final admin decision (approve, reject, or clarify) on an educator application and sends notification email
export async function handleEducatorAction(
    applicationId: string,
    action: "approve" | "reject" | "clarify",
    reason: string = "",
    adminProfile: any,
    applicantData: any
) {
    try {
        await educatorApplicationService.handleAction(applicationId, action, reason, adminProfile, applicantData);
        revalidatePath(`/admin/educators/applications/${applicationId}`);
        revalidatePath('/admin/educators');
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to process educator action" };
    }
}
