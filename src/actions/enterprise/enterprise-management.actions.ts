"use server";

import { enterpriseManagementService } from "@/lib/enterprise/enterprise-management.service";
import { createClient } from "@/lib/supabase/server";

// Fetches aggregate stats for the admin enterprise dashboard overview
export async function getEnterpriseStats() {
    try {
        return await enterpriseManagementService.getStats();
    } catch (err: any) {
        return { success: false as const, error: err.message || "Failed to fetch statistics" };
    }
}

// Fetches key performance metrics for the enterprise dashboard filtered by time period
export async function getDashboardMetrics(period: '30d' | 'all' = 'all', month?: number, year?: number) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };
        const result = await enterpriseManagementService.getDashboardMetrics(user.id, period, month, year);
        return { success: true as const, data: result };
    } catch (err: any) {
        return { success: false as const, error: err.message || "Failed to load dashboard metrics." };
    }
}

// Fetches simulation-specific performance metrics for the current enterprise user
export async function getSimulationsMetrics() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Authentication required" };
        const result = await enterpriseManagementService.getSimulationsMetrics(user.id);
        return { data: result };
    } catch (err: any) {
        return { success: false as const, error: err.message || "Failed to load simulations metrics." };
    }
}

// Fetches the profile and organization details for the currently authenticated enterprise user
export async function getEnterpriseUser() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        return await enterpriseManagementService.getUser(user.id);
    } catch (err) {
        return null;
    }
}

// Fetches branding configuration (logo, colors, etc.) for a specific organization by ID
export async function getBrandingByOrgId(orgId: string) {
    try {
        const data = await enterpriseManagementService.getBranding(orgId);
        return { success: true as const, data };
    } catch (err: any) {
        return { success: false as const, error: err.message };
    }
}

// Fetches branding configuration for the organization of the currently authenticated user
export async function getOrganizationBranding() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        const { data: member } = await supabase.from('organization_members').select('org_id').eq('user_id', user.id).maybeSingle();
        if (!member) return null;
        const data = await enterpriseManagementService.getBranding(member.org_id);
        return { success: true as const, data };
    } catch (err: any) {
        return { success: false as const, error: err.message };
    }
}

// Updates branding fields (logo, colors, fonts) for the current enterprise user's organization
export async function updateOrganizationBranding(data: any) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };
        await enterpriseManagementService.updateBranding(user.id, data);
        return { success: true as const };
    } catch (err: any) {
        return { success: false as const, error: err.message };
    }
}

// Uploads a branding asset (logo or signature) to S3 and persists the URL on the organization record
export async function uploadOrganizationAsset(formData: FormData) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Authentication required" };

        const assetType = formData.get('assetType') as 'logo' | 'signature';
        const file = formData.get('file') as File;

        const url = await enterpriseManagementService.uploadAsset(user.id, assetType, file);
        return { data: { url } };
    } catch (err: any) {
        return { success: false as const, error: err.message || 'Upload failed' };
    }
}

// Fetches all instructors for the currently authenticated enterprise user's organization
export async function getInstructors() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };
        const result = await enterpriseManagementService.getInstructors(user.id);
        return { success: true as const, data: result };
    } catch (err: any) {
        return { success: false as const, error: err.message || "Failed to load instructors." };
    }
}

// Fetches aggregate stats specifically for the instructor management section
export async function getInstructorStats() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };
        const result = await enterpriseManagementService.getInstructorStats(user.id);
        return { success: true as const, data: result };
    } catch (err: any) {
        return { success: false as const, error: err.message || "Failed to load instructor stats." };
    }
}

/**
 * Creates and sends a secure invitation link for a new instructor or role.
 */
export async function createInstructorInvitation(data: { email: string; firstName?: string; lastName?: string; role: 'enterprise_admin' | 'instructor' | 'reviewer' }) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        // 1. Fetch current user's organization and email
        const { data: member } = await supabase.from('organization_members').select('org_id').eq('user_id', user.id).maybeSingle();
        if (!member) return { success: false as const, error: "Cloud organization membership not found" };

        // 2. Domain Validation: Specialist email must match inviter's company domain
        const inviterEmail = user.email || "";
        const inviterDomain = inviterEmail.split('@')[1];
        const inviteeDomain = data.email.split('@')[1];

        if (!inviterDomain || !inviteeDomain || inviterDomain.toLowerCase() !== inviteeDomain.toLowerCase()) {
            const { logServerEvent } = await import('@/lib/logger/server');
            await logServerEvent({
                level: 'WARNING',
                action: { code: 'INVALID_INVITE_DOMAIN', category: 'SECURITY' },
                message: `Domain mismatch in invitation: ${data.email} by ${user.email}`,
                actor: { id: user.id, name: user.user_metadata?.full_name },
                params: { targetEmail: data.email, sourceEmail: user.email }
            });

            return {
                success: false as const,
                error: `Invalid email. Please use a company email ending in @${inviterDomain}`
            };
        }

        // 3. Fetch organization's default password
        const { data: org } = await supabase.from('organizations').select('default_password').eq('id', member.org_id).maybeSingle();
        const defaultPassword = org?.default_password || "Vantage2024!";

        // Dynamic import to avoid circular dependencies
        const { invitationService } = await import('@/lib/enterprise/invitation.service');
        const result = await invitationService.createInvitation({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            orgId: member.org_id,
            role: data.role,
            invitedBy: user.id,
            defaultPassword
        });

        if (!result.success) throw new Error(result.error);

        return {
            success: true as const,
            data: {
                ...result.data,
                defaultPassword
            }
        };
    } catch (err: any) {
        return { success: false as const, error: err.message || "Failed to create invitation." };
    }
}

/**
 * Verifies if an invitation token is valid.
 */
export async function verifyInvitationAction(token: string) {
    try {
        const { invitationService } = await import('@/lib/enterprise/invitation.service');
        return await invitationService.verifyInvitation(token);
    } catch (err: any) {
        return { success: false as const, error: err.message || "Verification failed" };
    }
}

/**
 * Accepts an invitation for a specific user.
 */
export async function acceptInvitationAction(token: string, userId: string) {
    try {
        const { invitationService } = await import('@/lib/enterprise/invitation.service');
        return await invitationService.acceptInvitation(token, userId);
    } catch (err: any) {
        return { success: false as const, error: err.message || "Acceptance failed" };
    }
}

/**
 * Deletes a specialist (either an active member or a pending invitation).
 */
export async function deleteSpecialistAction(id: string, isInvitation: boolean) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const { data: member } = await supabase.from('organization_members').select('org_id').eq('user_id', user.id).maybeSingle();
        if (!member) return { success: false, error: "Organization not found" };

        if (isInvitation) {
            const { invitationService } = await import('@/lib/enterprise/invitation.service');
            return await invitationService.deleteInvitation(id);
        } else {
            return await enterpriseManagementService.deleteInstructor(id, member.org_id);
        }
    } catch (err: any) {
        return { success: false, error: err.message || "Deletion failed" };
    }
}

/**
 * Updates an active specialist's role.
 */
export async function updateSpecialistRoleAction(userId: string, role: 'admin' | 'member' | 'reviewer' | 'instructor') {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const { data: member } = await supabase.from('organization_members').select('org_id').eq('user_id', user.id).maybeSingle();
        if (!member) return { success: false, error: "Organization not found" };

        return await enterpriseManagementService.updateInstructorRole(userId, member.org_id, role);
    } catch (err: any) {
        return { success: false, error: err.message || "Role update failed" };
    }
}

/**
 * Resends a specialist invitation.
 */
export async function resendInvitationAction(invitationId: string) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const { invitationService } = await import('@/lib/enterprise/invitation.service');
        return await invitationService.resendInvitation(invitationId);
    } catch (err: any) {
        return { success: false, error: err.message || "Resend failed" };
    }
}
