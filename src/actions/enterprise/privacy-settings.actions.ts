"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface PrivacySettings {
    org_id: string;
    data_retention_period: string;
    enable_gdpr_mode: boolean;
    right_to_be_forgotten_automation: boolean;
    anonymize_candidate_names: boolean;
    restrict_data_access: boolean;
    updated_at: string;
}

/**
 * Fetches the organization's privacy settings.
 */
export async function getPrivacySettingsAction() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        const { data: member } = await supabase
            .from('organization_members')
            .select('org_id')
            .eq('user_id', user.id)
            .maybeSingle();

        if (!member) return { success: false as const, error: "Organization membership not found" };

        const { data: settings, error } = await supabase
            .from('enterprise_privacy_settings')
            .select('*')
            .eq('org_id', member.org_id)
            .maybeSingle();

        if (error) throw error;

        // Default settings if none exist
        const defaultSettings: PrivacySettings = {
            org_id: member.org_id,
            data_retention_period: '6_months',
            enable_gdpr_mode: false,
            right_to_be_forgotten_automation: false,
            anonymize_candidate_names: false,
            restrict_data_access: true,
            updated_at: new Date().toISOString()
        };

        return {
            success: true as const,
            data: settings || defaultSettings
        };
    } catch (err: any) {
        return { success: false as const, error: err.message || "Failed to load privacy settings" };
    }
}

/**
 * Updates the organization's privacy settings.
 */
export async function updatePrivacySettingsAction(data: Partial<PrivacySettings>) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        const { data: member } = await supabase
            .from('organization_members')
            .select('org_id, role')
            .eq('user_id', user.id)
            .maybeSingle();

        if (!member) return { success: false as const, error: "Organization membership not found" };

        if (!['enterprise_admin', 'owner', 'admin'].includes(member.role)) {
            return { success: false as const, error: "Insufficient permissions" };
        }

        const { error } = await supabase
            .from('enterprise_privacy_settings')
            .upsert({
                org_id: member.org_id,
                ...data,
                updated_at: new Date().toISOString()
            }, { onConflict: 'org_id' });

        if (error) throw error;

        revalidatePath('/enterprise/settings/privacy');
        return { success: true as const };
    } catch (err: any) {
        return { success: false as const, error: err.message || "Failed to save privacy settings" };
    }
}
