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
