import { createClient } from "@/lib/supabase/server";
import { mailService } from "@/lib/mail/mail.service";
import { emailTemplates } from "@/lib/mail/templates";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Service for handling enterprise notifications, engagement reports, and automated alerts.
 */
export const notificationService = {
    /**
     * Generates an engagement report PDF for an organization over a specified number of days.
     */
    async generateEngagementReportPDF(orgId: string, orgName: string, days: number = 7) {
        const supabase = await createClient();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data: enrollments } = await supabase
            .from('simulation_enrollments')
            .select(`
                id, status, enrolled_at, completed_at,
                simulations!inner(id, title, org_id)
            `)
            .eq('simulations.org_id', orgId)
            .gte('enrolled_at', startDate.toISOString());

        const totalNewEnrollments = enrollments?.length || 0;
        const completions = enrollments?.filter(e => e.status === 'completed').length || 0;

        const doc = new jsPDF() as any;
        const dateRange = `${startDate.toLocaleDateString()} - ${new Date().toLocaleDateString()}`;
        const reportType = days === 1 ? 'Daily' : days === 30 ? 'Monthly' : 'Weekly';

        doc.setFontSize(22);
        doc.setTextColor(124, 58, 237);
        doc.text(`${reportType} Engagement Report`, 20, 25);

        doc.setFontSize(14);
        doc.setTextColor(100, 116, 139);
        doc.text(orgName, 20, 35);
        doc.text(`Period: ${dateRange}`, 20, 42);

        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.text("Key Metrics", 20, 60);

        autoTable(doc, {
            startY: 65,
            head: [['Metric', 'Value']],
            body: [
                ['New Enrollments', totalNewEnrollments.toString()],
                ['Simulations Completed', completions.toString()],
                ['Active Engagement Rate', totalNewEnrollments > 0 ? `${Math.round((completions / totalNewEnrollments) * 100)}%` : '0%'],
            ],
            theme: 'striped',
            headStyles: { fillColor: [124, 58, 237] }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 15;
        doc.text("Simulation Activity", 20, finalY);

        const simSummary: Record<string, { title: string, enrollments: number }> = {};
        enrollments?.forEach((e: any) => {
            const sim = e.simulations;
            if (!simSummary[sim.id]) {
                simSummary[sim.id] = { title: sim.title, enrollments: 0 };
            }
            simSummary[sim.id].enrollments++;
        });

        const simTableBody = Object.values(simSummary).map(s => [s.title, s.enrollments.toString()]);

        autoTable(doc, {
            startY: finalY + 5,
            head: [['Simulation Title', 'New Enrollments']],
            body: simTableBody.length > 0 ? simTableBody : [['No activity recorded', '0']],
            theme: 'grid',
            headStyles: { fillColor: [100, 116, 139] }
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text("© 2026 Priminent Vantage. Generated automatically.", 20, doc.internal.pageSize.height - 10);
        }

        return Buffer.from(doc.output('arraybuffer'));
    },

    /**
     * Sends the weekly summary email to admins who have it enabled.
     * Legacy method for backward compatibility if needed, now wraps the more flexible report.
     */
    async sendWeeklySummaryEmail(orgId: string) {
        return this.sendEngagementReportEmail(orgId, 'weekly');
    },

    /**
     * Sends a specific engagement report email based on frequency.
     */
    async sendEngagementReportEmail(orgId: string, frequency: 'daily' | 'weekly' | 'monthly') {
        const supabase = await createClient();
        const days = frequency === 'daily' ? 1 : frequency === 'monthly' ? 30 : 7;

        const { data: org } = await supabase.from('organizations').select('name').eq('id', orgId).single();
        if (!org) throw new Error("Organization not found");

        const { data: admins } = await supabase
            .from('organization_members')
            .select(`
                user_id,
                profiles!inner(email, id)
            `)
            .eq('org_id', orgId)
            .in('role', ['enterprise_admin', 'owner', 'admin']);

        if (!admins || admins.length === 0) return { success: false, error: "No admin recipients found" };

        const adminIds = (admins as any[]).map(a => a.profiles.id);

        // Find admins who have ANY automated reporting enabled.
        // For now, we use the weekly_summary flag as a general 'Automated Reports' toggle
        const { data: preferences } = await supabase
            .from('enterprise_notification_settings')
            .select('user_id')
            .in('user_id', adminIds)
            .eq('weekly_summary', true);

        const enabledRecipientEmails = (admins as any[])
            .filter(a => preferences?.some(p => p.user_id === a.profiles.id))
            .map(a => a.profiles.email);

        if (enabledRecipientEmails.length === 0) return { success: true, message: "No admins have automated reporting enabled" };

        const pdfBuffer = await this.generateEngagementReportPDF(orgId, org.name, days);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const dateRange = `${startDate.toLocaleDateString()} - ${new Date().toLocaleDateString()}`;

        const reportType = frequency.charAt(0).toUpperCase() + frequency.slice(1);
        const { subject, html } = emailTemplates.weeklySummary(org.name, dateRange); // We can reuse the template

        await mailService.sendEmail({
            to: enabledRecipientEmails,
            subject: `[${reportType}] ${subject}`,
            html,
            attachments: [
                {
                    content: pdfBuffer,
                    filename: `${reportType}_Engagement_Report_${org.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
                    content_type: 'application/pdf'
                }
            ]
        });

        return { success: true };
    },

    /**
     * Triggers event-driven notifications (enrollment, completion) based on user preferences.
     */
    async triggerEventNotification(type: 'enrollment' | 'completion', orgId: string, candidateName: string, simulationName: string) {
        const supabase = await createClient();
        const preferenceField = type === 'enrollment' ? 'new_enrollment_alert' : 'completion_alert';

        const { data: admins } = await supabase
            .from('organization_members')
            .select(`
                user_id,
                profiles!inner(email, id)
            `)
            .eq('org_id', orgId)
            .in('role', ['enterprise_admin', 'owner', 'admin']);

        if (!admins || admins.length === 0) return;

        const adminIds = (admins as any[]).map(a => a.profiles.id);
        const { data: prefs } = await supabase
            .from('enterprise_notification_settings')
            .select('user_id')
            .in('user_id', adminIds)
            .eq(preferenceField, true);

        const targetEmails = (admins as any[])
            .filter(a => prefs?.some(p => p.user_id === a.profiles.id))
            .map(a => a.profiles.email);

        if (targetEmails.length === 0) return;

        const { subject, html } = emailTemplates.simulationAlert(type, candidateName, simulationName);

        await mailService.sendEmail({
            to: targetEmails,
            subject,
            html
        });
    }
};
