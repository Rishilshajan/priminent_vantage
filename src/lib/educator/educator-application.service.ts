import { createClient } from "@/lib/supabase/server";
import { mailService } from "@/lib/mail/mail.service";

export const educatorApplicationService = {
    /**
     * Educator Application Submission
     */
    async submitApplication(userId: string, data: any, file: File | null) {
        const supabase = await createClient();

        try {
            let verificationDocumentUrl = null;
            if (file && file.size > 0) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${userId}-${Math.random()}.${fileExt}`;
                const filePath = `verification-docs/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('educator-verification')
                    .upload(filePath, file);

                if (!uploadError) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('educator-verification')
                        .getPublicUrl(filePath);
                    verificationDocumentUrl = publicUrl;
                }
            }

            const { error: insertError } = await supabase
                .from('educator_applications')
                .insert({
                    user_id: userId,
                    ...data,
                    verification_document_url: verificationDocumentUrl,
                    status: 'PENDING_VERIFICATION'
                });

            if (insertError) throw insertError;

            return true;
        } catch (error) {
            console.error("Error in educatorApplicationService.submitApplication:", error);
            throw error;
        }
    },

    /**
     * Save Review Progress
     */
    async saveReview(applicationId: string, reviewData: any) {
        const supabase = await createClient();

        try {
            const updateData: any = {};
            if (reviewData.status !== undefined) updateData.status = reviewData.status;

            const { data: current } = await supabase
                .from("educator_applications")
                .select("admin_notes, verification_checklist")
                .eq("id", applicationId)
                .single();

            if (reviewData.notes !== undefined) {
                updateData.admin_notes = JSON.stringify(reviewData.notes);
            }

            if (reviewData.checklist !== undefined) {
                const { error: checklistError } = await supabase
                    .from("educator_applications")
                    .update({ verification_checklist: reviewData.checklist })
                    .eq("id", applicationId);

                if (checklistError && checklistError.code === 'PGRST204') {
                    // Fallback to admin_notes
                    let existingNotes = [];
                    try {
                        existingNotes = current?.admin_notes ? JSON.parse(current.admin_notes) : [];
                    } catch {
                        if (current?.admin_notes) existingNotes = [{ author: 'System', content: current.admin_notes, date: new Date().toLocaleString() }];
                    }

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

            return true;
        } catch (error) {
            console.error("Error in educatorApplicationService.saveReview:", error);
            throw error;
        }
    },

    /**
     * Update Application
     */
    async updateApplication(applicationId: string, updates: any) {
        const supabase = await createClient();
        try {
            const { error } = await supabase
                .from("educator_applications")
                .update(updates)
                .eq("id", applicationId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error in educatorApplicationService.updateApplication:", error);
            throw error;
        }
    },

    /**
     * Handle Action (Approve/Reject/Clarify)
     */
    async handleAction(applicationId: string, action: string, reason: string, adminProfile: any, applicantData: any) {
        const supabase = await createClient();

        try {
            const { data: currentApp } = await supabase
                .from("educator_applications")
                .select("admin_notes, status, user_id")
                .eq("id", applicationId)
                .single();

            if (currentApp?.status === 'APPROVED' || currentApp?.status === 'REJECTED') {
                throw new Error(`Application is already ${currentApp.status}`);
            }

            let status: string = '';
            let milestoneContent: string = '';
            let emailSubject: string = '';
            let emailHtml: string = '';

            const now = new Date().toLocaleString();
            const adminName = `${adminProfile.first_name || 'Admin'} ${adminProfile.last_name || ''}`.trim();

            if (action === "approve") {
                status = 'APPROVED';
                milestoneContent = `APPROVED: Access granted.`;
                emailSubject = `Welcome to Vantage for Educators: ${applicantData.institution}`;
                emailHtml = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
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
                </div>`;
            } else if (action === "reject") {
                status = 'REJECTED';
                milestoneContent = `REJECTED: ${reason}`;
                emailSubject = `Update regarding your Educator Application: ${applicantData.institution}`;
                emailHtml = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
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
                </div>`;
            } else {
                status = 'CLARIFICATION_REQUESTED';
                milestoneContent = `CLARIFICATION REQUESTED: ${reason}`;
                emailSubject = `Information Needed: Educator Application for ${applicantData.institution}`;
                emailHtml = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
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
                </div>`;
            }

            let updatedNotes = [];
            try {
                updatedNotes = currentApp?.admin_notes ? JSON.parse(currentApp.admin_notes) : [];
                if (!Array.isArray(updatedNotes)) updatedNotes = [];
            } catch (e) {
                updatedNotes = [];
            }
            updatedNotes.push({ author: adminName, date: now, content: milestoneContent });

            const { error: updateError } = await supabase
                .from("educator_applications")
                .update({
                    status: status,
                    admin_notes: JSON.stringify(updatedNotes),
                    reviewed_at: status === 'APPROVED' ? new Date().toISOString() : null,
                    reviewed_by: adminProfile.id
                })
                .eq("id", applicationId);

            if (updateError) throw updateError;

            if (action === "approve" && currentApp?.user_id) {
                await supabase
                    .from("profiles")
                    .update({ role: 'educator' })
                    .eq("id", currentApp.user_id);
            }

            await mailService.sendEducatorUpdate(
                applicantData.email,
                applicantData.full_name,
                status.toUpperCase()
            );

            return true;
        } catch (error) {
            console.error("Error in educatorApplicationService.handleAction:", error);
            throw error;
        }
    }
};
