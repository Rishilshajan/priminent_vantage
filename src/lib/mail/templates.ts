/**
 * Centralized email templates for Priminent Vantage
 */
export const emailTemplates = {
    /**
     * Educator Application Status Update
     */
    educatorStatusUpdate: (fullName: string, status: string) => ({
        subject: `Update on your Educator Application: ${status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="color: #0f172a; font-size: 24px; font-weight: bold; margin: 0;">Application Update</h1>
                    <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Priminent Vantage Educator Program</p>
                </div>
                <p>Hello ${fullName},</p>
                <p>Your application status has been updated to: <strong style="color: #020617;">${status}</strong>.</p>
                ${status === 'APPROVED'
                ? '<p>Congratulations! You can now log in to your dashboard and start creating simulations.</p>'
                : '<p>If you have any questions regarding this update, please feel free to reach out to our support team.</p>'
            }
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="background-color: #020617; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Go to Dashboard</a>
                </div>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                <p style="font-size: 10px; color: #94a3b8; text-align: center;">&copy; 2026 Priminent Vantage. All rights reserved.</p>
            </div>
        `
    }),

    /**
     * Enterprise Request Access Code
     */
    enterpriseAccessCode: (adminName: string, companyName: string, accessCode: string, accessLink: string) => ({
        subject: `Action Required: Your Access Code for ${companyName}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155; line-height: 1.6;">
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
                    <p style="margin: 0; font-size: 12px; color: #92400e; line-height: 1.6;"><strong>Security Note:</strong> This is a one-time use code. You will be required to use your work email to validate this code.</p>
                </div>
                <p style="font-size: 13px;">If you encounter any issues during setup, please reply directly to this email.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                <p style="font-size: 10px; color: #94a3b8; text-align: center;">&copy; 2026 Priminent Vantage. All rights reserved.</p>
            </div>
        `
    }),

    /**
     * Enterprise Request Status Update (Reject/Clarify)
     */
    enterpriseStatusUpdate: (companyName: string, action: "reject" | "clarify", reason: string) => {
        const isReject = action === "reject";
        return {
            subject: isReject
                ? `Update regarding your Enterprise Request: ${companyName}`
                : `Information Needed: Enterprise Request for ${companyName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155; line-height: 1.6;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="color: #0f172a; font-size: 24px; font-weight: bold; margin: 0;">${isReject ? 'Request Update' : 'Information Needed'}</h1>
                        <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Enterprise Partnership Request</p>
                    </div>
                    <p>Regarding your partnership request for <strong>${companyName}</strong>:</p>
                    <div style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; margin: 24px 0;">
                        <p style="margin: 0; font-size: 14px; color: #0f172a; white-space: pre-wrap;">${reason}</p>
                    </div>
                    ${!isReject ? '<p style="font-size: 13px;">Please reply to this email with the requested information to move forward with your application.</p>' : ''}
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                    <p style="font-size: 10px; color: #94a3b8; text-align: center;">&copy; 2026 Priminent Vantage. All rights reserved.</p>
                </div>
            `
        };
    },

    /**
     * Specialist Invitation Template
     */
    specialistInvitation: (orgName: string, role: string, inviteUrl: string, defaultPassword?: string) => ({
        subject: `Invitation: Join ${orgName} on Priminent Vantage`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="color: #0d9488; font-size: 24px; font-weight: bold; margin: 0;">Specialist Invitation</h1>
                    <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Priminent Vantage Enterprise Control Plane</p>
                </div>
                <p>Hello,</p>
                <p>You have been invited to join <strong>${orgName}</strong> as a <strong>${role.replace('_', ' ')}</strong> on Priminent Vantage.</p>
                <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Your Onboarding Credentials</p>
                    <p style="margin: 0; font-size: 14px; color: #0f172a;">Password: <code style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #0d9488;">${defaultPassword || 'Provided by Administrator'}</code></p>
                </div>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${inviteUrl}" style="background-color: #0d9488; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2);">Accept Invitation & Join</a>
                </div>
                <p style="font-size: 12px; color: #64748b;">If you have any questions, please contact your organization administrator.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                <p style="font-size: 10px; color: #94a3b8; text-align: center;">&copy; 2026 Priminent Vantage. All rights reserved.</p>
            </div>
        `
    }),

    /**
     * Weekly Organization Summary
     */
    weeklySummary: (orgName: string, dateRange: string) => ({
        subject: `Weekly Performance Summary: ${orgName} (${dateRange})`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="color: #7c3aed; font-size: 24px; font-weight: bold; margin: 0;">Weekly Summary</h1>
                    <p style="color: #64748b; font-size: 14px; margin-top: 8px;">${orgName} • Performance Insights</p>
                </div>
                <p>Hello,</p>
                <p>Please find the attached weekly performance summary for <strong>${orgName}</strong>. This report contains a high-level overview of candidate progress, simulation engagement, and recruitment funnel performance for the period of <strong>${dateRange}</strong>.</p>
                <div style="background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 12px; padding: 24px; margin: 24px 0;">
                    <p style="margin: 0; font-size: 14px; color: #5b21b6; text-align: center;"><strong>Note:</strong> A detailed PDF report is attached to this email for your review.</p>
                </div>
                <p style="font-size: 12px; color: #64748b;">If you wish to change your notification preferences, please visit your organization settings.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                <p style="font-size: 10px; color: #94a3b8; text-align: center;">&copy; 2026 Priminent Vantage. All rights reserved.</p>
            </div>
        `
    }),

    /**
     * Simulation Event Alerts (Enrollment/Completion)
     */
    simulationAlert: (type: 'enrollment' | 'completion', candidateName: string, simulationName: string) => {
        const isEnrollment = type === 'enrollment';
        return {
            subject: isEnrollment
                ? `New Enrollment: ${candidateName} started ${simulationName}`
                : `Simulation Completed: ${candidateName} finished ${simulationName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155; line-height: 1.6;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #0f172a; font-size: 20px; font-weight: bold; margin: 0;">${isEnrollment ? 'New Enrollment Alert' : 'Simulation Completion Alert'}</h1>
                    </div>
                    <p>Hello,</p>
                    <p>This is an automated notification regarding a candidate activity:</p>
                    <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 8px 0;"><strong>Candidate:</strong> ${candidateName}</p>
                        <p style="margin: 0 0 8px 0;"><strong>Simulation:</strong> ${simulationName}</p>
                        <p style="margin: 0;"><strong>Event:</strong> ${isEnrollment ? 'Started engagement' : 'Successfully completed'}</p>
                    </div>
                    <div style="text-align: center; margin-top: 24px;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/enterprise/analytics" style="color: #7c3aed; font-weight: bold; text-decoration: none; font-size: 14px;">View Analytics Dashboard &rarr;</a>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                    <p style="font-size: 10px; color: #94a3b8; text-align: center;">&copy; 2026 Priminent Vantage. All rights reserved.</p>
                </div>
            `
        };
    }
};
