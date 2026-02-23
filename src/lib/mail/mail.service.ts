import { Resend } from 'resend';
import { logServerEvent } from "@/lib/logger/server";
import { emailTemplates } from "./templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
    replyTo?: string;
}

export const mailService = {
    // Sends a transactional email via Resend and logs success/failure to the system log
    async sendEmail(options: EmailOptions) {
        const {
            to,
            subject,
            html,
            from = 'Priminent Vantage <onboarding@resend.dev>',
            replyTo
        } = options;

        try {
            const { data, error } = await resend.emails.send({
                from,
                to,
                subject,
                html,
                replyTo,
            });

            if (error) {
                console.error("Resend Email Error:", error);
                await logServerEvent({
                    level: 'ERROR',
                    action: {
                        code: 'EMAIL_SEND_FAILED',
                        category: 'SYSTEM'
                    },
                    message: `Failed to send email to ${Array.isArray(to) ? to.join(', ') : to}`,
                    params: { error, subject }
                });
                throw error;
            }

            await logServerEvent({
                level: 'SUCCESS',
                action: {
                    code: 'EMAIL_SEND_SUCCESS',
                    category: 'SYSTEM'
                },
                message: `Email sent to ${Array.isArray(to) ? to.join(', ') : to}`,
                params: { subject, resendId: data?.id }
            });

            return data;
        } catch (err) {
            console.error("Mail Service Exception:", err);
            throw err;
        }
    },

    // Sends an educator application status update email (approved/rejected/clarify) using the centralized template
    async sendEducatorUpdate(email: string, fullName: string, status: string) {
        const { subject, html } = emailTemplates.educatorStatusUpdate(fullName, status);
        return this.sendEmail({
            to: email,
            subject,
            html,
        });
    },

    // Sends an enterprise onboarding access code email with login link using the centralized template
    async sendEnterpriseAccessCode(adminName: string, companyName: string, email: string, accessCode: string) {
        const accessLink = `${process.env.NEXT_PUBLIC_APP_URL}/enterprise/login?code=${accessCode}&email=${encodeURIComponent(email)}`;
        const { subject, html } = emailTemplates.enterpriseAccessCode(adminName, companyName, accessCode, accessLink);
        return this.sendEmail({
            to: email,
            subject,
            html,
        });
    },

    // Sends enterprise request status notification (reject or clarify) with reason using the centralized template
    async sendEnterpriseStatusUpdate(email: string, companyName: string, action: "reject" | "clarify", reason: string) {
        const { subject, html } = emailTemplates.enterpriseStatusUpdate(companyName, action, reason);
        return this.sendEmail({
            to: email,
            subject,
            html,
        });
    }
};
