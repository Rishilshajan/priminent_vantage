"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from 'resend';
import { logServerEvent } from "@/lib/logger-server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitEducatorApplication(formData: FormData) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return { success: false, error: "You must be logged in to apply." };
        }

        // Extract form data
        const fullName = formData.get("fullName") as string;
        const institutionalEmail = formData.get("institutionalEmail") as string;
        const institutionName = formData.get("institutionName") as string;
        const institutionWebsite = formData.get("institutionWebsite") as string;
        const department = formData.get("department") as string;
        const designation = formData.get("designation") as string;
        const designationOther = formData.get("designationOther") as string;
        const coursesTeaching = formData.get("coursesTeaching") as string;
        const academicLevel = formData.get("academicLevel") as string;
        const academicLevelOther = formData.get("academicLevelOther") as string;
        const estimatedStudents = formData.get("estimatedStudents") as string;
        const intendedUsage = formData.get("intendedUsage") as string;
        const implementationTypes = formData.getAll("implementationTypes") as string[];
        const linkedinProfile = formData.get("linkedinProfile") as string;
        const verificationDocument = formData.get("verificationDocument") as File | null;

        // Handle verification document upload
        let verificationDocumentUrl = null;
        if (verificationDocument && verificationDocument.size > 0) {
            const fileExt = verificationDocument.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `verification-docs/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('educator-verification')
                .upload(filePath, verificationDocument);

            if (uploadError) {
                console.error("Upload error:", uploadError);
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('educator-verification')
                    .getPublicUrl(filePath);
                verificationDocumentUrl = publicUrl;
            }
        }

        // Insert into database
        const { error: insertError } = await supabase
            .from('educator_applications')
            .insert({
                user_id: user.id,
                full_name: fullName,
                institutional_email: institutionalEmail,
                institution_name: institutionName,
                institution_website: institutionWebsite,
                department: department,
                designation: designation === "Other" ? designationOther : designation,
                courses_teaching: coursesTeaching,
                academic_level: academicLevel === "Other" ? academicLevelOther : academicLevel,
                estimated_students: estimatedStudents,
                intended_usage: intendedUsage,
                implementation_types: implementationTypes,
                linkedin_profile: linkedinProfile,
                verification_document_url: verificationDocumentUrl,
                status: 'PENDING_VERIFICATION'
            });

        if (insertError) {
            console.error("Insert error:", insertError);
            return { success: false, error: "Failed to submit application. Please try again." };
        }

        revalidatePath('/educators/dashboard');
        revalidatePath('/educators/apply');

        return { success: true };

    } catch (error) {
        console.error("Error submitting application:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}

/**
 * Saves review progress (notes, checklist, status) for an educator application.
 * Note: If 'verification_checklist' column is missing, it falls back to storing 
 * checklist data within a '__metadata' block in admin_notes.
 */
export async function saveEducatorReview(applicationId: string, reviewData: {
    notes?: any[];
    checklist?: any[];
    status?: string;
}) {
    const supabase = await createClient();

    try {
        const updateData: any = {};
        if (reviewData.status !== undefined) updateData.status = reviewData.status;

        // Fetch current to handle merging if we need to use the fallback
        const { data: current } = await supabase
            .from("educator_applications")
            .select("admin_notes, verification_checklist")
            .eq("id", applicationId)
            .single();

        // 1. Handle Notes
        if (reviewData.notes !== undefined) {
            updateData.admin_notes = JSON.stringify(reviewData.notes);
        }

        // 2. Handle Checklist (with fallback logic for missing column)
        if (reviewData.checklist !== undefined) {
            // Try updating the dedicated column first
            const { error: checklistError } = await supabase
                .from("educator_applications")
                .update({ verification_checklist: reviewData.checklist })
                .eq("id", applicationId);

            if (checklistError && checklistError.code === 'PGRST204') {
                // FALLBACK: Store in admin_notes if column doesn't exist
                console.log("Column 'verification_checklist' missing, using fallback in admin_notes");
                let existingNotes = [];
                try {
                    existingNotes = current?.admin_notes ? JSON.parse(current.admin_notes) : [];
                } catch {
                    // If it was raw text, we keep it as a note
                    if (current?.admin_notes) existingNotes = [{ author: 'System', content: current.admin_notes, date: new Date().toLocaleString() }];
                }

                // Check if we already have metadata
                const metadataNoteIndex = existingNotes.findIndex((n: any) => n.__metadata === true);
                const metadata = {
                    __metadata: true,
                    verification_checklist: reviewData.checklist,
                    last_updated: new Date().toISOString()
                };

                if (metadataNoteIndex > -1) {
                    existingNotes[metadataNoteIndex] = metadata;
                } else {
                    existingNotes.push(metadata);
                }
                updateData.admin_notes = JSON.stringify(existingNotes);
            } else if (checklistError) {
                throw checklistError;
            }
        }

        const { error } = await supabase
            .from("educator_applications")
            .update(updateData)
            .eq("id", applicationId);

        if (error) throw error;

        revalidatePath(`/admin/educators/applications/${applicationId}`);
        return { success: true };
    } catch (err: any) {
        console.error("Error saving educator review:", err);
        return { error: err.message || "Failed to save review progress" };
    }
}

/**
 * Updates core educator application fields.
 */
export async function updateEducatorApplication(applicationId: string, updates: any) {
    const supabase = await createClient();
    try {
        const { error } = await supabase
            .from("educator_applications")
            .update(updates)
            .eq("id", applicationId);

        if (error) throw error;

        revalidatePath(`/admin/educators/applications/${applicationId}`);
        return { success: true };
    } catch (err: any) {
        console.error("Error updating application:", err);
        return { error: err.message || "Failed to update application" };
    }
}

/**
 * Handles complex educator actions like rejection or clarification.
 */
export async function handleEducatorAction(
    applicationId: string,
    action: "approve" | "reject" | "clarify",
    reason: string = "",
    adminProfile: any,
    applicantData: { email: string; name: string; institution: string }
) {
    const supabase = await createClient();

    try {
        // 0. Guard: Prevent double processing of finalized applications
        const { data: currentApp } = await supabase
            .from("educator_applications")
            .select("admin_notes, status, user_id")
            .eq("id", applicationId)
            .single();

        if (currentApp?.status === 'APPROVED' || currentApp?.status === 'REJECTED') {
            return { error: `Application is already ${currentApp.status}. No further actions can be taken.` };
        }

        let status: string;
        let milestoneContent: string;
        let emailSubject: string;
        let emailHtml: string;

        const now = new Date().toLocaleString();
        const adminName = `${adminProfile.first_name || 'Admin'} ${adminProfile.last_name || ''}`.trim();

        // 1. Determine Action Specifics
        if (action === "approve") {
            status = 'APPROVED';
            milestoneContent = `APPROVED: Access granted.`;
            emailSubject = `Welcome to Vantage for Educators: ${applicantData.institution}`;
            emailHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
                    <h2 style="color: #0f172a; font-size: 18px; font-weight: bold; margin-bottom: 16px;">Application Approved!</h2>
                    <p>Dear ${applicantData.name},</p>
                    <p>We are excited to inform you that your educator application for <strong>${applicantData.institution}</strong> has been approved.</p>
                    <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #22c55e; margin: 20px 0;">
                        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #166534;">You now have full access to the Vantage Educator Dashboard, where you can manage simulations, track student progress, and access exclusive curriculum resources.</p>
                    </div>
                    <p>To get started, simply log in to your account. Your dashboard has been upgraded with your new educator privileges.</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/educators/dashboard" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 10px;">Go to Dashboard</a>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="font-size: 10px; color: #94a3b8; text-align: center;">&copy; 2026 Priminent Vantage. All rights reserved.</p>
                </div>
            `;

            // Core Logic: Update User Role to 'educator'
            if (currentApp?.user_id) {
                const { error: roleError } = await supabase
                    .from("profiles")
                    .update({ role: 'educator' })
                    .eq("id", currentApp.user_id);

                if (roleError) console.error("Failed to update user role:", roleError);
            }

        } else if (action === "reject") {
            status = 'REJECTED';
            milestoneContent = `REJECTED: ${reason}`;
            emailSubject = `Update regarding your Educator Application: ${applicantData.institution}`;
            emailHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
                    <h2 style="color: #0f172a; font-size: 18px; font-weight: bold; margin-bottom: 16px;">Application Status Update</h2>
                    <p>Dear ${applicantData.name},</p>
                    <p>Thank you for your interest in Vantage for Educators. After careful review of your application for <strong>${applicantData.institution}</strong>, we are unable to approve your access at this time.</p>
                    <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
                        <h4 style="margin: 0 0 8px 0; color: #ef4444; font-size: 13px; font-weight: bold;">Reason for rejection:</h4>
                        <p style="margin: 0; font-size: 12px; line-height: 1.5;">${reason}</p>
                    </div>
                    <p>Common reasons for rejection include unverifiable institutional affiliation or mismatch between curriculum and platform capabilities. You may re-apply if your details change.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="font-size: 10px; color: #94a3b8; text-align: center;">&copy; 2026 Priminent Vantage. All rights reserved.</p>
                </div>
            `;
        } else {
            status = 'CLARIFICATION_REQUESTED';
            milestoneContent = `CLARIFICATION REQUESTED: ${reason}`;
            emailSubject = `Information Needed: Educator Application for ${applicantData.institution}`;
            emailHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
                    <h2 style="color: #0f172a; font-size: 18px; font-weight: bold; margin-bottom: 16px;">Clarification Needed</h2>
                    <p>Dear ${applicantData.name},</p>
                    <p>We've started reviewing your Educator Application for <strong>${applicantData.institution}</strong>, but we need a bit more information to complete your verification.</p>
                    <div style="background-color: #f0fdfa; padding: 16px; border-radius: 8px; border-left: 4px solid #0d9488; margin: 20px 0;">
                        <h4 style="margin: 0 0 8px 0; color: #0d9488; font-size: 13px; font-weight: bold;">What we need:</h4>
                        <p style="margin: 0; font-size: 12px; line-height: 1.5;">${reason}</p>
                    </div>
                    <p>Please reply to this email thread with the requested information.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="font-size: 10px; color: #94a3b8; text-align: center;">&copy; 2026 Priminent Vantage. All rights reserved.</p>
                </div>
            `;
        }

        const newNote = {
            author: adminName,
            date: now,
            content: milestoneContent
        };

        // 2. Update Application (Status & Notes)
        const updatedNotes = [...(currentApp?.admin_notes || []), newNote];

        const { error: updateError } = await supabase
            .from("educator_applications")
            .update({
                status: status,
                admin_notes: updatedNotes
            })
            .eq("id", applicationId);

        if (updateError) throw updateError;

        // 3. Send Email
        const { error: emailError } = await resend.emails.send({
            from: 'Priminent Vantage <onboarding@resend.dev>',
            to: applicantData.email,
            subject: emailSubject,
            html: emailHtml,
        });

        if (emailError) {
            console.error("Resend Error:", emailError);
        }

        revalidatePath(`/admin/educators/applications/${applicationId}`);
        revalidatePath('/admin/educators');
        return { success: true };
    } catch (err: any) {
        console.error("Error in educator action handler:", err);
        return { error: err.message || "Failed to process educator action" };
    }
}
