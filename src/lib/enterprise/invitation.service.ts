import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export interface InvitationData {
    email: string;
    firstName?: string;
    lastName?: string;
    orgId: string;
    role: 'enterprise_admin' | 'instructor' | 'reviewer';
    invitedBy: string;
    defaultPassword?: string;
}

export const invitationService = {
    /**
     * Creates a secure invitation token and record for a new instructor or admin.
     */
    async createInvitation(data: InvitationData) {
        const supabase = await createClient()
        const token = randomBytes(32).toString('hex')

        const { data: invitation, error } = await supabase
            .from('instructor_invitations')
            .insert({
                email: data.email.toLowerCase(),
                first_name: data.firstName,
                last_name: data.lastName,
                token,
                org_id: data.orgId,
                role: data.role,
                invited_by: data.invitedBy,
                status: 'pending',
                // Note: We'll store the default password if provided, or handle it via org lookups
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating invitation:', error)
            return { success: false, error: error.message }
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const inviteUrl = `${baseUrl}/enterprise/invitation/accept?token=${token}`

        // 1. Fetch Organization Details for Email
        const { data: org } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', data.orgId)
            .single();

        // 2. Send Invitation Email via Resend
        try {
            const { mailService } = await import('@/lib/mail/mail.service');
            const { logServerEvent } = await import('@/lib/logger/server');

            await mailService.sendEmail({
                to: data.email,
                ... (await import('@/lib/mail/templates')).emailTemplates.specialistInvitation(
                    org?.name || 'Your Organization',
                    data.role,
                    inviteUrl,
                    data.defaultPassword
                )
            });

            // 3. Log Success
            await logServerEvent({
                level: 'SUCCESS',
                action: { code: 'SPECIALIST_INVITE_SENT', category: 'SYSTEM' },
                message: `Invitation sent to ${data.email} for role ${data.role}`,
                organization: { org_id: data.orgId, org_name: org?.name },
                params: { email: data.email, role: data.role }
            });

        } catch (emailErr) {
            console.error('Failed to send invitation email:', emailErr);
            // We still return success since the record was created, but log the failure
            const { logServerEvent } = await import('@/lib/logger/server');
            await logServerEvent({
                level: 'ERROR',
                action: { code: 'SPECIALIST_INVITE_EMAIL_FAILED', category: 'SYSTEM' },
                message: `Failed to send invitation email to ${data.email}`,
                params: { error: emailErr, email: data.email }
            });
        }

        return {
            success: true,
            data: {
                ...invitation,
                inviteUrl
            }
        }
    },

    /**
     * Verifies if an invitation token is valid and hasn't expired.
     */
    async verifyInvitation(token: string) {
        const supabase = await createClient()

        const { data: invitation, error } = await supabase
            .from('instructor_invitations')
            .select('*, organizations(name, enterprise_security_settings(*))')
            .eq('token', token)
            .eq('status', 'pending')
            .gt('expires_at', new Date().toISOString())
            .single()

        if (error || !invitation) {
            return { success: false, error: 'Invitation link is invalid or has expired' }
        }

        return { success: true, data: invitation }
    },

    /**
     * Finalizes the invitation acceptance by linking the user profile to the organization.
     */
    async acceptInvitation(token: string, userId: string) {
        const supabase = await createClient()

        // 1. Get invitation details
        const { data: invitation, error: fetchError } = await invitationService.verifyInvitation(token)
        if (fetchError || !invitation) return { success: false, error: fetchError }

        // 2. Transactional update: Link member and update invitation status
        const { error: memberError } = await supabase
            .from('organization_members')
            .upsert({
                org_id: invitation.org_id,
                user_id: userId,
                role: invitation.role === 'enterprise_admin' ? 'admin' : 'member' // Mapping to existing schema if needed, but RBAC update handles this
            }, { onConflict: 'org_id,user_id' })

        if (memberError) return { success: false, error: memberError.message }

        // 3. Update profile role to match invitation if it's currently 'learner/student'
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single()

        if (profile) {
            await supabase
                .from('profiles')
                .update({
                    role: invitation.role === 'enterprise_admin' ? 'enterprise_admin' : 'instructor',
                    logged_in: new Date().toISOString()
                })
                .eq('id', userId)
        }

        // 4. Mark invitation as accepted
        await supabase
            .from('instructor_invitations')
            .update({
                status: 'accepted',
                accepted_at: new Date().toISOString()
            })
            .eq('id', invitation.id)

        // 5. Log Success
        const { logServerEvent } = await import('@/lib/logger/server');
        await logServerEvent({
            level: 'SUCCESS',
            action: { code: 'SPECIALIST_INVITE_ACCEPTED', category: 'SYSTEM' },
            message: `Invitation accepted by ${invitation.email}`,
            params: { email: invitation.email, role: invitation.role, user_id: userId }
        });

        return { success: true }
    },

    /**
     * Resends an invitation email.
     */
    async resendInvitation(invitationId: string) {
        const supabase = await createClient();
        try {
            const { data: invitation, error: fetchError } = await supabase
                .from('instructor_invitations')
                .select('*, organizations(name, default_password)')
                .eq('id', invitationId)
                .single();

            if (fetchError || !invitation) throw new Error("Invitation not found");

            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const inviteUrl = `${baseUrl}/enterprise/invitation/accept?token=${invitation.token}`;

            const { mailService } = await import('@/lib/mail/mail.service');
            const { emailTemplates } = await import('@/lib/mail/templates');

            await mailService.sendEmail({
                to: invitation.email,
                ...emailTemplates.specialistInvitation(
                    invitation.organizations?.name || 'Your Organization',
                    invitation.role,
                    inviteUrl,
                    invitation.organizations?.default_password
                )
            });

            return { success: true };
        } catch (err) {
            console.error("Error in invitationService.resendInvitation:", err);
            return { success: false, error: (err as any).message };
        }
    },

    /**
     * Deletes a pending invitation.
     */
    async deleteInvitation(invitationId: string) {
        const supabase = await createClient();
        try {
            const { error } = await supabase
                .from('instructor_invitations')
                .delete()
                .eq('id', invitationId);

            if (error) throw error;
            return { success: true };
        } catch (err) {
            console.error("Error in invitationService.deleteInvitation:", err);
            return { success: false, error: (err as any).message };
        }
    }
}
