"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SecuritySettings {
    org_id: string;
    enforce_mfa_admins: boolean;
    enforce_mfa_all: boolean;
    min_password_length: number;
    password_expiration_days: number;
    require_special_symbols: boolean;
    require_numeric_digits: boolean;
    require_mixed_case: boolean;
    session_timeout_minutes: number;
    updated_at: string;
}

/**
 * Fetches the organization's security settings.
 */
export async function getSecuritySettingsAction() {
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
            .from('enterprise_security_settings')
            .select('*')
            .eq('org_id', member.org_id)
            .maybeSingle();

        if (error) throw error;

        // Default settings if none exist
        const defaultSettings: SecuritySettings = {
            org_id: member.org_id,
            enforce_mfa_admins: true,
            enforce_mfa_all: false,
            min_password_length: 12,
            password_expiration_days: 90,
            require_special_symbols: true,
            require_numeric_digits: true,
            require_mixed_case: false,
            session_timeout_minutes: 1440, // 24 hours
            updated_at: new Date().toISOString()
        };

        return {
            success: true as const,
            data: settings || defaultSettings
        };
    } catch (err: any) {
        return { success: false as const, error: err.message || "Failed to load security settings" };
    }
}

/**
 * Updates the organization's security settings.
 */
export async function updateSecuritySettingsAction(data: Partial<SecuritySettings>) {
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
            .from('enterprise_security_settings')
            .upsert({
                org_id: member.org_id,
                ...data,
                updated_at: new Date().toISOString()
            }, { onConflict: 'org_id' });

        if (error) throw error;

        revalidatePath('/enterprise/settings');
        return { success: true as const };
    } catch (err: any) {
        return { success: false as const, error: err.message || "Failed to save security settings" };
    }
}
