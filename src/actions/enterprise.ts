"use server";

import { Resend } from 'resend';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logServerEvent } from "@/lib/logger-server";
import { z } from "zod";
import { createHash, randomBytes } from "node:crypto";

/**
 * Generates a random 9-character alphanumeric access code (Format: XXX-XXX-XXX)
 */
function generateAccessCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 9; i++) {
        if (i > 0 && i % 3 === 0) code += '-';
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Securely hashes an access code for storage
 */
function hashAccessCode(code: string) {
    return createHash('sha256').update(code).digest('hex');
}

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

    // Helper to sanitize URLs
    const sanitizeUrl = (url: string | null) => {
        if (!url) return null;
        // Strip duplicate protocols and redundant www
        const clean = url.replace(/(https?:\/\/)+/g, "").replace(/^www\./, "").trim();
        return `https://${clean}`;
    };

    // Extract data from FormData
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
    domainVerified?: boolean; // New prop to check verification status
}) {
    const supabase = await createClient();

    try {
        // Validation: Block approval if domain is not verified
        if (reviewData.status === 'approved') {
            if (!reviewData.domainVerified) {
                return { error: "Cannot approve request: Organization domain must be verified first." };
            }

            // Verify checklist is complete
            // We expect the client to send the latest checklist state
            const currentChecklist = reviewData.checklist || (
                (await supabase.from("enterprise_requests").select("checklist_state").eq("id", requestId).single()).data?.checklist_state
            );

            const isChecklistComplete = currentChecklist && Array.isArray(currentChecklist) && currentChecklist.every((item: any) => item.checked);

            if (!isChecklistComplete) {
                return { error: "Cannot approve request: All security checklist items must be completed." };
            }
        }

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

        // Logic for Access Code Generation on Approval
        if (reviewData.status === 'approved') {
            // 1. Check for ANY existing code for this request (Active, Used, Expired, Revoked)
            const { data: existingCodes } = await supabase
                .from('enterprise_access_codes')
                .select('id, code, status')
                .eq('request_id', requestId);

            if (existingCodes && existingCodes.length > 0) {
                console.log(`Access code already exists for request ${requestId}. Status: ${existingCodes[0].status}. Skipping generation.`);

                // If there's an ACTIVE code, resend it. Otherwise, do nothing (Admin must manually regenerate if needed).
                const activeCode = existingCodes.find(c => c.status === 'active');

                if (activeCode) {
                    await logServerEvent({
                        level: 'INFO',
                        action: { code: 'ACCESS_CODE_RESENT', category: 'SYSTEM' },
                        message: `Resending existing active access code for request ${requestId}`,
                        params: { requestId }
                    });

                    // Fetch recipient details to re-send
                    const { data: request } = await supabase
                        .from('enterprise_requests')
                        .select('admin_email, admin_name, company_name')
                        .eq('id', requestId)
                        .single();

                    if (request) {
                        await sendAccessCodeEmail(
                            request.admin_email,
                            request.admin_name,
                            request.company_name,
                            activeCode.code
                        );
                    }
                }
            } else {
                // 2. Check for ANY ACTIVE code for this Company (Global Check) to prevent multi-request abuse
                // We check by Company Name or Website to catch duplicates
                const { data: requestData } = await supabase
                    .from('enterprise_requests')
                    .select('company_name, website')
                    .eq('id', requestId)
                    .single();

                if (requestData) {
                    const { data: duplicateCompanyCodes } = await supabase
                        .from('enterprise_access_codes')
                        .select('id, request_id')
                        .eq('status', 'active')
                        .neq('request_id', requestId) // Exclude current request (though we already checked that above)
                        .in('request_id', (
                            // Subquery to find request IDs matching company details
                            // Note: Supabase JS doesn't support complex joins in `in` directly easily withoutrpc, 
                            // so we'll do a two-step check or rely on application logic.
                            // For simplicity and performance, we'll fetch potentially conflicting requests first.
                            []
                        ));

                    // Alternative: Fetch other requests with same company/website
                    const { data: similarRequests } = await supabase
                        .from('enterprise_requests')
                        .select('id')
                        .or(`company_name.eq."${requestData.company_name}",website.eq."${requestData.website}"`)
                        .neq('id', requestId);

                    if (similarRequests && similarRequests.length > 0) {
                        const similarRequestIds = similarRequests.map(r => r.id);
                        const { data: activeGlobalCodes } = await supabase
                            .from('enterprise_access_codes')
                            .select('id')
                            .eq('status', 'active')
                            .in('request_id', similarRequestIds);

                        if (activeGlobalCodes && activeGlobalCodes.length > 0) {
                            // Block Generation
                            await logServerEvent({
                                level: 'WARNING',
                                action: { code: 'ACCESS_CODE_DUPLICATE_BLOCKED', category: 'SECURITY' },
                                message: `Blocked access code generation: Active code already exists for company ${requestData.company_name}`,
                                params: { requestId, similarRequestIds }
                            });
                            return { success: true }; // Return success to allow the status update to persist, but suppress code gen
                        }
                    }
                }

                // 3. Generate New Code
                const accessCode = generateAccessCode();
                const codeHash = hashAccessCode(accessCode);

                const { error: codeError } = await supabase
                    .from('enterprise_access_codes')
                    .insert({
                        request_id: requestId,
                        code: accessCode, // Store plaintext for testing/ MVP
                        code_hash: codeHash,
                        status: 'active'
                    });

                if (codeError) {
                    console.error("Error generating access code:", codeError);
                    await logServerEvent({
                        level: 'ERROR',
                        action: { code: 'ACCESS_CODE_GEN_FAILED', category: 'SYSTEM' },
                        message: `Failed to generate access code for approved request ${requestId}`,
                        params: { requestId, error: codeError }
                    });
                } else {
                    await logServerEvent({
                        level: 'SUCCESS',
                        action: {
                            code: 'ACCESS_CODE_GENERATED',
                            category: 'ORGANIZATION'
                        },
                        message: `Access code generated for organization (Internal)`,
                        params: { requestId, code: accessCode }
                    });

                    // Fetch recipient details
                    const { data: request } = await supabase
                        .from('enterprise_requests')
                        .select('admin_email, admin_name, company_name')
                        .eq('id', requestId)
                        .single();

                    if (request) {
                        await sendAccessCodeEmail(
                            request.admin_email,
                            request.admin_name,
                            request.company_name,
                            accessCode
                        );
                    }
                }
            }
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
            params: { requestId, status: reviewData.status, emailSent: reviewData.status === 'approved' }
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

/**
 * Fetches all enterprise requests from Supabase.
 */
export async function getEnterpriseRequests() {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('enterprise_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data };
    } catch (err: any) {
        console.error("Error fetching enterprise requests:", err);
        return { error: err.message || "Failed to fetch requests" };
    }
}

/**
 * Calculates metrics for the enterprise dashboard.
 */
/**
 * Validates an enterprise access code and optional work email.
 */
export async function validateAccessCode(code: string, email?: string) {
    const supabase = createAdminClient();
    const cleanCode = code.trim().toUpperCase();
    const hashedCode = hashAccessCode(cleanCode);

    try {
        // 1. Fetch the code record
        const { data: codeRecord, error: fetchError } = await supabase
            .from('enterprise_access_codes')
            .select('*, enterprise_requests(admin_email, admin_name, company_name, website, industry, company_size, status)')
            .eq('code_hash', hashedCode)
            .eq('status', 'active')
            .maybeSingle();

        if (fetchError || !codeRecord) {
            await logServerEvent({
                level: 'WARNING',
                action: { code: 'ACCESS_CODE_INVALID', category: 'SECURITY' },
                message: `Invalid access code attempt${email ? ` for email ${email}` : ''}`,
                params: { email, code }
            });
            return { error: "Invalid access code. Please check your email for the correct code." };
        }

        const request = codeRecord.enterprise_requests;

        // 2. Check status and expiry
        const now = new Date();
        const expiresAt = new Date(codeRecord.expires_at);

        if (codeRecord.status !== 'active') {
            return { error: `This access code is ${codeRecord.status}.` };
        }

        if (now > expiresAt) {
            return { error: "This access code has expired (7-day limit)." };
        }

        // 3. Domain validation (Security feature) - Only if email is provided
        if (email) {
            const getDomain = (e: string) => e.split('@')[1]?.toLowerCase();
            if (getDomain(email) !== getDomain(request.admin_email)) {
                await logServerEvent({
                    level: 'WARNING',
                    action: { code: 'ACCESS_CODE_DOMAIN_MISMATCH', category: 'SECURITY' },
                    message: `Domain mismatch for code validation: ${email} attempted to use code for ${request.admin_email}`,
                    params: { email, target: request.admin_email }
                });
                return { error: "Permission Denied: This code is locked to organization-specific work emails." };
            }
        }

        // 4. Check onboarding status
        const { data: org } = await supabase
            .from('organizations')
            .select('id')
            .eq('request_id', codeRecord.request_id)
            .maybeSingle();

        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email || request.admin_email)
            .maybeSingle();

        // 5. Success
        await logServerEvent({
            level: 'SUCCESS',
            action: { code: 'ACCESS_CODE_VALIDATED', category: 'SECURITY' },
            message: `Access code validated for ${email || 'Anonymous'}`,
            params: { requestId: codeRecord.request_id, isOnboarded: !!org, isUserExists: !!profile }
        });

        return {
            success: true,
            requestId: codeRecord.request_id,
            companyName: request.company_name,
            adminEmail: email || request.admin_email,
            adminName: request.admin_name,
            website: request.website,
            industry: request.industry,
            companySize: request.company_size,
            isOrgExists: !!org,
            isUserExists: !!profile
        };
    } catch (err: any) {
        console.error("Validation error:", err);
        return { error: "An unexpected error occurred during validation." };
    }
}

/**
 * Finalizes the enterprise onboarding by creating the account and organization.
 */
export async function completeEnterpriseSetup(setupData: {
    requestId: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    industry?: string;
    companySize?: string;
    website?: string;
}) {
    const supabase = await createClient();
    const supabaseAdmin = createAdminClient();

    try {
        // 1. Verify access code still valid for this request
        const { data: codeRecord, error: codeError } = await supabaseAdmin
            .from('enterprise_access_codes')
            .select('id, status, request_id')
            .eq('request_id', setupData.requestId)
            .eq('status', 'active')
            .single();

        if (codeError || !codeRecord) {
            return { error: "Access session expired or invalid. Please re-validate your code." };
        }

        // 2. Create/Get the Organization
        const { data: requestData } = await supabaseAdmin
            .from('enterprise_requests')
            .select('company_name, admin_email')
            .eq('id', setupData.requestId)
            .single();

        if (!requestData) {
            return { error: "Original request not found." };
        }

        const domain = setupData.email.split('@')[1].toLowerCase();
        const finalOrgName = setupData.companyName || requestData.company_name;

        // Check if organization already exists for this request
        const { data: existingOrg } = await supabaseAdmin
            .from('organizations')
            .select('id')
            .eq('request_id', setupData.requestId)
            .maybeSingle();

        let org;
        if (existingOrg) {
            org = existingOrg;
            // Update existing organization details
            await supabaseAdmin.from('organizations').update({
                name: finalOrgName,
                industry: setupData.industry,
                size: setupData.companySize,
                website: setupData.website
            }).eq('id', org.id);
        } else {
            const { data: newOrg, error: orgError } = await supabaseAdmin
                .from('organizations')
                .insert({
                    request_id: setupData.requestId,
                    name: finalOrgName,
                    domain: domain,
                    industry: setupData.industry,
                    size: setupData.companySize,
                    website: setupData.website,
                    status: 'active'
                })
                .select()
                .single();

            if (orgError) {
                console.error("Org Creation Error:", orgError);
                if (orgError.code === '23505') return { error: "An organization with this domain already exists." };
                return { error: "Failed to create organization record." };
            }
            org = newOrg;
        }

        // 3. Create or Update Admin Account
        let userId: string | undefined;

        // Search for existing user in Auth system directly (Source of Truth)
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        const existingAuthUser = users.find(u => u.email?.toLowerCase() === setupData.email.toLowerCase());

        if (existingAuthUser) {
            userId = existingAuthUser.id;
            // Update existing user password and metadata
            const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
                password: setupData.password,
                email_confirm: true,
                user_metadata: {
                    first_name: setupData.firstName,
                    last_name: setupData.lastName,
                    role: 'enterprise'
                }
            });

            if (updateAuthError) {
                return { error: `Failed to update existing account: ${updateAuthError.message}` };
            }

            // Ensure profile exists (in case trigger failed previously)
            await supabaseAdmin.from('profiles').upsert({
                id: userId,
                email: setupData.email,
                first_name: setupData.firstName,
                last_name: setupData.lastName,
                role: 'enterprise'
            });
        } else {
            // Create Admin Account in Auth
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: setupData.email,
                password: setupData.password,
                email_confirm: true,
                user_metadata: {
                    first_name: setupData.firstName,
                    last_name: setupData.lastName,
                    role: 'enterprise'
                }
            });

            if (authError) {
                return { error: `Account creation failed: ${authError.message}` };
            }
            userId = authData.user?.id;
        }

        if (!userId) return { error: "Failed to establish user context." };

        // 4. Link Admin to Organization (using upsert to be safe)
        await supabaseAdmin.from('organization_members').upsert({
            org_id: org.id,
            user_id: userId,
            role: 'admin'
        }, { onConflict: 'org_id,user_id' });

        // 5. Update Entry status in request and access code
        await supabaseAdmin.from('enterprise_access_codes').update({
            status: 'used',
            used_count: 1
        }).eq('id', codeRecord.id);

        await supabaseAdmin.from('enterprise_requests').update({
            status: 'completed'
        }).eq('id', setupData.requestId);

        await logServerEvent({
            level: 'SUCCESS',
            action: { code: 'ENTERPRISE_SETUP_COMPLETE', category: 'ORGANIZATION' },
            message: `Onboarding completed for ${requestData.company_name} (Idempotent)`,
            params: { orgId: org.id, adminId: userId }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Setup Completion error:", err);
        return { error: "An unexpected error occurred during final setup." };
    }
}

export async function getEnterpriseStats() {
    const supabase = await createClient();

    try {
        // Fetch all needed stats in parallel or sequentially
        const { count: totalRequests } = await supabase
            .from('enterprise_requests')
            .select('*', { count: 'exact', head: true });

        const { count: pendingRequests } = await supabase
            .from('enterprise_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        const { count: approvedOrgs } = await supabase
            .from('enterprise_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'approved');

        // Requests this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { count: requestsThisWeek } = await supabase
            .from('enterprise_requests')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', oneWeekAgo.toISOString());

        // Monthly Onboardings (Only APPROVED status this month)
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const { count: monthlyOnboardings } = await supabase
            .from('enterprise_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'approved')
            .gte('created_at', firstDayOfMonth.toISOString());

        return {
            totalRequests: totalRequests || 0,
            pendingRequests: pendingRequests || 0,
            approvedOrgs: approvedOrgs || 0,
            requestsThisWeek: requestsThisWeek || 0,
            monthlyOnboardings: monthlyOnboardings || 0,
            // Placeholder for average response time and conversion rate until we have historical data
            avgResponseTime: "4.2h",
            conversionRate: "68.4%"
        };
    } catch (err: any) {
        console.error("Error fetching enterprise stats:", err);
        return { error: err.message || "Failed to fetch statistics" };
    }
}

/**
 * Updates specific fields of an enterprise request.
 */
export async function updateEnterpriseRequest(requestId: string, updateData: any) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('enterprise_requests')
            .update(updateData)
            .eq('id', requestId)
            .select();

        if (error) throw error;

        await logServerEvent({
            level: 'SUCCESS',
            action: {
                code: 'ENTERPRISE_REQUEST_UPDATED',
                category: 'ORGANIZATION'
            },
            message: `Enterprise request ${requestId} updated directly by admin`,
            params: { requestId, fieldsUpdated: Object.keys(updateData) }
        });

        return { success: true, data };
    } catch (err: any) {
        console.error("Error updating enterprise request:", err);
        return { error: err.message || "Failed to update request" };
    }
}

/**
 * Sends the access code email to the approved organization's primary admin.
 */
async function sendAccessCodeEmail(email: string, adminName: string, companyName: string, accessCode: string) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const accessLink = `${process.env.NEXT_PUBLIC_APP_URL}/enterprise/login?code=${accessCode}&email=${encodeURIComponent(email)}`;

    try {
        const { error } = await resend.emails.send({
            from: 'Priminent Vantage <onboarding@resend.dev>',
            to: email,
            subject: `Action Required: Your Access Code for ${companyName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="color: #0f172a; font-size: 24px; font-weight: bold; margin: 0;">Organization Approved</h1>
                        <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Welcome to Priminent Vantage Enterprise</p>
                    </div>
                    
                    <p>Dear ${adminName},</p>
                    <p>We are pleased to inform you that your enterprise request for <strong>${companyName}</strong> has been approved. You can now proceed with setting up your organization dashboard.</p>
                    
                    <div style="background-color: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0;">
                        <p style="text-transform: uppercase; font-size: 11px; font-weight: bold; color: #64748b; letter-spacing: 0.1em; margin-bottom: 12px;">Your Unique Access Code</p>
                        <div style="font-family: monospace; font-size: 32px; font-weight: bold; color: #020617; letter-spacing: 0.2em;">${accessCode}</div>
                        <p style="font-size: 12px; color: #ef4444; font-weight: bold; margin-top: 16px;">Expires in 7 days</p>
                    </div>

                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${accessLink}" style="background-color: #020617; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Complete Setup Now</a>
                    </div>

                    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin-bottom: 32px;">
                        <p style="margin: 0; font-size: 12px; color: #92400e; line-height: 1.6;">
                            <strong>Security Note:</strong> This is a one-time use code. You will be required to use your work email (${email}) to validate this code.
                        </p>
                    </div>

                    <p style="font-size: 13px; line-height: 1.5;">If you encounter any issues during setup, please reply directly to this email.</p>
                    
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                    <p style="font-size: 10px; color: #94a3b8; text-align: center;">&copy; 2026 Priminent Vantage. All rights reserved.</p>
                </div>
            `
        });

        if (error) {
            console.error("Resend Access Code Email Error:", error);
            await logServerEvent({
                level: 'ERROR',
                action: { code: 'ACCESS_CODE_EMAIL_FAILED', category: 'SYSTEM' },
                message: `Failed to send access code email to ${email}`,
                params: { email, error }
            });
        } else {
            await logServerEvent({
                level: 'SUCCESS',
                action: { code: 'ACCESS_CODE_SENT', category: 'SYSTEM' },
                message: `Access code email successfully sent to ${email}`,
                params: { email }
            });
        }
    } catch (err: any) {
        console.error("Email delivery exception:", err);
    }
}
/**
 * Fetches all access codes and associated metrics for the admin dashboard.
 */
export async function getAccessCodesData() {
    const supabase = await createClient();

    try {
        // 1. Fetch access codes with organization/request info
        const { data: codes, error: fetchError } = await supabase
            .from('enterprise_access_codes')
            .select('*, enterprise_requests(company_name, industry, company_size, admin_email)')
            .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // 2. Fetch recent activity (logs related to Access Codes)
        const { data: activityLogs } = await supabase
            .from('system_logs')
            .select('*')
            .filter('action_code', 'in', '("ACCESS_CODE_GENERATED", "ACCESS_CODE_SENT", "ENTERPRISE_SETUP_COMPLETED")')
            .order('created_at', { ascending: false })
            .limit(10);

        // 3. Calculate Stats
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const activeCodes = codes?.filter(c => c.status === 'active') || [];
        const expiringSoon = activeCodes.filter(c => {
            const expiry = new Date(c.expires_at);
            return expiry <= sevenDaysFromNow && expiry > now;
        });

        const totalEnrollments = codes?.reduce((sum, c) => sum + (c.used_count || 0), 0) || 0;

        return {
            success: true,
            data: {
                codes: codes || [],
                stats: {
                    activeCount: activeCodes.length,
                    expiringSoonCount: expiringSoon.length,
                    totalEnrollments,
                    totalCodes: codes?.length || 0
                },
                activity: activityLogs || []
            }
        };
    } catch (err: any) {
        console.error("Error fetching access codes data:", err);
        return { error: "Failed to load access code repository." };
    }
}

/**
 * Fetches metrics for the Enterprise Dashboard
 */
export async function getDashboardMetrics(period: string = 'all') {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "Unauthorized" };

        // 1. Fetch Organization Context
        let { data: member } = await supabase
            .from('organization_members')
            .select('org_id, organizations(*)')
            .eq('user_id', user.id)
            .maybeSingle();

        // If not a direct member, check if the user is an admin/super_admin
        if (!member) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role === 'admin' || profile?.role === 'super_admin') {
                // For admins, show the most recently created active organization as a preview
                const { data: recentOrg } = await supabase
                    .from('organizations')
                    .select('*')
                    .eq('status', 'active')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (recentOrg) {
                    member = { org_id: recentOrg.id, organizations: recentOrg } as any;
                }
            }
        }

        if (!member) return { error: "Organization not found" };

        const orgId = member.org_id;

        // 2. Fetch Real Metrics

        // Date Filtering Logic
        let dateFilter = null;
        if (period === '30d') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            dateFilter = thirtyDaysAgo.toISOString();
        }

        // Fetch Simulations (for Active Programs)
        const { data: simulations } = await supabase
            .from('simulations')
            .select('id, title, industry, status, duration, created_at, simulation_enrollments(count)')
            .eq('org_id', orgId)
            .eq('status', 'published')
            .order('updated_at', { ascending: false });

        // Fetch Enrollments (for Total Counts & Completion Rate)
        // Better approach: Get all simulation IDs for this org first.
        const { data: orgSims } = await supabase.from('simulations').select('id, industry').eq('org_id', orgId);
        const simIds = orgSims?.map(s => s.id) || [];

        let enrollmentsData: any[] = [];
        if (simIds.length > 0) {
            let query = supabase
                .from('simulation_enrollments')
                .select('id, status, enrolled_at, completed_at, simulation_id')
                .in('simulation_id', simIds);

            if (dateFilter) {
                query = query.gte('enrolled_at', dateFilter);
            }

            const { data } = await query;
            enrollmentsData = data || [];
        }

        const totalEnrollmentsCount = enrollmentsData.length;
        const completedCount = enrollmentsData.filter(e => e.status === 'completed').length;

        const completionRateValue = totalEnrollmentsCount > 0
            ? ((completedCount / totalEnrollmentsCount) * 100).toFixed(1)
            : "0.0";

        // Calculated Stats
        const stats = {
            totalEnrollments: { value: totalEnrollmentsCount.toLocaleString(), change: period === '30d' ? "Last 30 Days" : "All Time", trend: "neutral" },
            completionRate: { value: `${completionRateValue}%`, change: "Avg.", trend: "neutral" },
            avgTimeToComplete: { value: "4.2 Days", change: "Avg.", trend: "neutral" }, // Placeholder until we calculate time diff
            skillScore: { value: "4.8/5.0", change: "+0.8", trend: "up" } // Placeholder
        };

        // Chart Data (Mocking distribution for now as it requires complex grouping)
        const chartData = [
            { month: "Jan", enrollments: Math.floor(totalEnrollmentsCount * 0.1), completions: Math.floor(completedCount * 0.1) },
            { month: "Feb", enrollments: Math.floor(totalEnrollmentsCount * 0.15), completions: Math.floor(completedCount * 0.15) },
            { month: "Mar", enrollments: Math.floor(totalEnrollmentsCount * 0.12), completions: Math.floor(completedCount * 0.12) },
            { month: "Apr", enrollments: Math.floor(totalEnrollmentsCount * 0.2), completions: Math.floor(completedCount * 0.2) },
            { month: "May", enrollments: Math.floor(totalEnrollmentsCount * 0.18), completions: Math.floor(completedCount * 0.18) },
            { month: "Jun", enrollments: Math.floor(totalEnrollmentsCount * 0.25), completions: Math.floor(completedCount * 0.25) },
        ];

        // Active Programs Formatting
        const activePrograms = simulations?.slice(0, 5).map(sim => {
            const enrolledCount = sim.simulation_enrollments?.[0]?.count || 0;
            // Mocking 'rate' and 'status' visual indicators for now
            return {
                id: sim.id,
                name: sim.title,
                department: sim.industry || "General",
                status: "STABLE",
                duration: sim.duration || "N/A",
                enrolled: enrolledCount.toLocaleString(),
                rate: Math.floor(Math.random() * 30) + 70, // Mock rate 70-100%
                color: "primary"
            };
        }) || [];

        // Top Departments Logic
        const departmentStats = new Map<string, { count: number, totalScore: number }>();
        const simIndustryMap = new Map(orgSims?.map(s => [s.id, s.industry || 'General']));

        enrollmentsData.forEach(enrollment => {
            const industry = simIndustryMap.get(enrollment.simulation_id) || 'General';
            const current = departmentStats.get(industry) || { count: 0, totalScore: 0 };

            departmentStats.set(industry, {
                count: current.count + 1,
                totalScore: current.totalScore + (enrollment.status === 'completed' ? 100 : 50) // Mock score based on completion
            });
        });

        const topDepartments = Array.from(departmentStats.entries())
            .map(([name, stats]) => ({
                name,
                code: name.substring(0, 2).toUpperCase(),
                score: Math.min(100, Math.round(stats.totalScore / stats.count)), // Average score
                color: "primary" as const
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        // Fallback if no data
        if (topDepartments.length === 0) {
            topDepartments.push(
                { name: "No Data", code: "NA", score: 0, color: "primary" }
            );
        }

        return {
            success: true,
            data: {
                organization: member.organizations,
                stats,
                chartData,
                activePrograms,
                topDepartments
            }
        };
    } catch (err: any) {
        console.error("Dashboard metrics error:", err);
        return { error: "Failed to load dashboard metrics." };
    }
}

/**
 * Fetches simulation metrics for the enterprise simulations page
 */
export async function getSimulationsMetrics() {
    const supabase = await createClient();

    try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required" };
        }

        // Get user's organization
        const { data: membership, error: membershipError } = await supabase
            .from('organization_members')
            .select('org_id, organizations(id, name)')
            .eq('user_id', user.id)
            .single();

        if (membershipError || !membership) {
            return { error: "No organization found for this user" };
        }

        const organization = membership.organizations;
        const orgId = membership.org_id;

        // Fetch simulations for this organization
        const { data: simulations, error: simulationsError } = await supabase
            .from('simulations')
            .select(`
                *,
                simulation_tasks(id),
                simulation_skills(id)
            `)
            .eq('org_id', orgId)
            .order('updated_at', { ascending: false });

        if (simulationsError) {
            console.error("Error fetching simulations:", simulationsError);
        }

        // Calculate stats
        const totalEnrollments = 0; // TODO: Count from simulation_enrollments
        const activeSimulations = simulations?.filter(s => s.status === 'published').length || 0;
        const completionRate = 0; // TODO: Calculate from enrollments
        const skillsAssessed = simulations?.reduce((acc, s) => {
            const skillCount = Array.isArray(s.simulation_skills) ? s.simulation_skills.length : 0;
            return acc + skillCount;
        }, 0) || 0;

        const stats = {
            totalEnrollments,
            activeSimulations,
            completionRate,
            skillsAssessed
        };

        await logServerEvent({
            level: 'INFO',
            action: {
                code: 'SIMULATIONS_METRICS_FETCHED',
                category: 'ORGANIZATION'
            },
            actor: {
                type: 'user',
                id: user.id
            },
            organization: {
                org_id: membership.org_id,
                org_name: (Array.isArray(organization) ? organization[0]?.name : (organization as any)?.name) || 'Unknown'
            },
            message: 'Simulations metrics fetched successfully'
        });

        return {
            data: {
                organization,
                stats,
                simulations: simulations || []
            }
        };
    } catch (err: any) {
        console.error("Simulations metrics error:", err);
        return { error: "Failed to load simulations metrics." };
    }
}

