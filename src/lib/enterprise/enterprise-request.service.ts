import { createClient } from "@/lib/supabase/server";
import { logServerEvent } from "@/lib/logger/server";
import { createHash } from "node:crypto";
import { mailService } from "@/lib/mail/mail.service";

// Generates a formatted 9-character alphanumeric access code (e.g. ABC-123-XYZ)
function generateAccessCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 9; i++) {
        if (i > 0 && i % 3 === 0) code += '-';
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Hashes an access code with SHA-256 for secure DB storage
function hashAccessCode(code: string) {
    return createHash('sha256').update(code).digest('hex');
}

// Sends the enterprise access code email to the admin using the centralized mail service
async function sendAccessCodeEmail(email: string, adminName: string, companyName: string, accessCode: string) {
    const accessLink = `${process.env.NEXT_PUBLIC_APP_URL}/enterprise/login?code=${accessCode}&email=${encodeURIComponent(email)}`;

    try {
        await mailService.sendEnterpriseAccessCode(
            adminName,
            companyName,
            email,
            accessCode
        );
    } catch (err) {
        console.error("Email delivery exception:", err);
    }
}

export const enterpriseRequestService = {
    // Inserts a new enterprise partnership request into the DB with a pending status
    async submitRequest(data: any) {
        const supabase = await createClient();
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

            if (error) throw error;
            return true;
        } catch (err) {
            console.error("Error in enterpriseRequestService.submitRequest:", err);
            throw err;
        }
    },

    // Persists admin review data (notes, checklist, history, status) and generates/sends access code on approval
    async saveReview(requestId: string, reviewData: any) {
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

            if (error) throw error;
            if (!data || data.length === 0) throw new Error("No records updated");

            // Handle Access Code on Approval
            if (reviewData.status === 'approved') {
                const { data: existingCodes } = await supabase
                    .from('enterprise_access_codes')
                    .select('id, code, status')
                    .eq('request_id', requestId);

                if (existingCodes && existingCodes.length > 0) {
                    const activeCode = existingCodes.find(c => c.status === 'active');
                    if (activeCode) {
                        const { data: request } = await supabase
                            .from('enterprise_requests')
                            .select('admin_email, admin_name, company_name')
                            .eq('id', requestId)
                            .single();
                        if (request) {
                            await sendAccessCodeEmail(request.admin_email, request.admin_name, request.company_name, activeCode.code);
                        }
                    }
                } else {
                    const accessCode = generateAccessCode();
                    const codeHash = hashAccessCode(accessCode);
                    const { error: codeError } = await supabase
                        .from('enterprise_access_codes')
                        .insert({
                            request_id: requestId,
                            code: accessCode,
                            code_hash: codeHash,
                            status: 'active'
                        });

                    if (!codeError) {
                        const { data: request } = await supabase
                            .from('enterprise_requests')
                            .select('admin_email, admin_name, company_name')
                            .eq('id', requestId)
                            .single();
                        if (request) {
                            await sendAccessCodeEmail(request.admin_email, request.admin_name, request.company_name, accessCode);
                        }
                    }
                }
            }
            return true;
        } catch (err) {
            console.error("Error in enterpriseRequestService.saveReview:", err);
            throw err;
        }
    },

    // Updates arbitrary fields on an enterprise request record (used for bulk updates and corrections)
    async updateRequest(requestId: string, updateData: any) {
        const supabase = await createClient();
        try {
            const { error } = await supabase
                .from('enterprise_requests')
                .update(updateData)
                .eq('id', requestId);
            if (error) throw error;
            return true;
        } catch (err) {
            console.error("Error in enterpriseRequestService.updateRequest:", err);
            throw err;
        }
    },

    // Fetches all enterprise requests ordered by creation date for the admin review queue
    async getRequests() {
        const supabase = await createClient();
        try {
            const { data, error } = await supabase
                .from('enterprise_requests')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        } catch (err) {
            console.error("Error in enterpriseRequestService.getRequests:", err);
            throw err;
        }
    },

    // Fetches access codes with joined company details plus recent activity logs for the codes admin view
    async getAccessCodesData() {
        const supabase = await createClient();
        try {
            const { data: codes, error: fetchError } = await supabase
                .from('enterprise_access_codes')
                .select('*, enterprise_requests(company_name, industry, company_size, admin_email)')
                .order('created_at', { ascending: false });
            if (fetchError) throw fetchError;

            const { data: activityLogs } = await supabase
                .from('system_logs')
                .select('*')
                .filter('action_code', 'in', '("ACCESS_CODE_GENERATED", "ACCESS_CODE_SENT", "ENTERPRISE_SETUP_COMPLETED")')
                .order('created_at', { ascending: false })
                .limit(10);

            const now = new Date();
            const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            const activeCodes = codes?.filter(c => c.status === 'active') || [];
            const expiringSoon = activeCodes.filter(c => {
                const expiry = new Date(c.expires_at);
                return expiry <= sevenDaysFromNow && expiry > now;
            });
            const totalEnrollments = codes?.reduce((sum, c) => sum + (c.used_count || 0), 0) || 0;

            return {
                codes: codes || [],
                stats: {
                    activeCount: activeCodes.length,
                    expiringSoonCount: expiringSoon.length,
                    totalEnrollments,
                    totalCodes: codes?.length || 0
                },
                activity: activityLogs || []
            };
        } catch (err) {
            console.error("Error in enterpriseRequestService.getAccessCodesData:", err);
            throw err;
        }
    }
};
