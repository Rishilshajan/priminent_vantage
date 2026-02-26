"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { mailService } from "@/lib/mail/mail.service";
import { emailTemplates } from "@/lib/mail/templates";
import { notificationService } from "@/lib/enterprise/notification.service";

/**
 * Fetches the current user's notification preferences.
 */
export async function getNotificationSettingsAction() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        const { data: settings, error } = await supabase
            .from('enterprise_notification_settings')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (error) throw error;

        // Default settings if none exist
        const defaultSettings = {
            weekly_summary: true,
            new_enrollment_alert: true,
            completion_alert: false,
            report_frequency: 'weekly',
            push_notifications_enabled: false
        };

        return {
            success: true as const,
            data: settings || defaultSettings
        };
    } catch (err: any) {
        return { success: false as const, error: err.message || "Failed to load notification settings" };
    }
}

/**
 * Updates or creates the user's notification preferences.
 */
export async function updateNotificationSettingsAction(data: {
    weekly_summary: boolean;
    new_enrollment_alert: boolean;
    completion_alert: boolean;
    report_frequency?: string;
    push_notifications_enabled?: boolean;
}) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        // Get the organization ID for the user
        const { data: member } = await supabase
            .from('organization_members')
            .select('org_id')
            .eq('user_id', user.id)
            .maybeSingle();

        if (!member) return { success: false as const, error: "Cloud organization membership not found" };

        const { error } = await supabase
            .from('enterprise_notification_settings')
            .upsert({
                user_id: user.id,
                org_id: member.org_id,
                ...data,
                updated_at: new Date().toISOString() // Explicitly update for audit trail visibility
            }, { onConflict: 'user_id' });

        if (error) throw error;

        revalidatePath('/enterprise/settings/notifications');
        return { success: true as const };
    } catch (err: any) {
        return { success: false as const, error: err.message || "Failed to save notification settings" };
    }
}

/**
 * Manually triggers an engagement report email for testing.
 */
export async function sendTestEngagementReportAction(frequency: 'daily' | 'weekly' | 'monthly') {
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

        const { data: org } = await supabase.from('organizations').select('name').eq('id', member.org_id).single();
        if (!org) throw new Error("Organization not found");

        const days = frequency === 'daily' ? 1 : frequency === 'monthly' ? 30 : 7;
        const pdfBuffer = await notificationService.generateEngagementReportPDF(member.org_id, org.name, days);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const dateRange = `${startDate.toLocaleDateString()} - ${new Date().toLocaleDateString()}`;

        const reportType = frequency.charAt(0).toUpperCase() + frequency.slice(1);
        const { subject, html } = emailTemplates.weeklySummary(org.name, dateRange);

        const { data: profile } = await supabase.from('profiles').select('email').eq('id', user.id).single();

        await mailService.sendEmail({
            to: profile?.email || user.email!,
            subject: `[TEST][${reportType}] ${subject}`,
            html,
            attachments: [
                {
                    content: pdfBuffer,
                    filename: `TEST_${reportType}_Engagement_Report_${org.name.replace(/\s+/g, '_')}.pdf`,
                    content_type: 'application/pdf'
                }
            ]
        });

        return { success: true as const };
    } catch (err: any) {
        console.error("Test report failed:", err);
        return { success: false as const, error: err.message || "Failed to send test report" };
    }
}

/**
 * Legacy test action kept for compatibility
 */
export async function sendTestWeeklySummaryAction() {
    return sendTestEngagementReportAction('weekly');
}
