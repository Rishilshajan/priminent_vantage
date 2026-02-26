import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export interface InvitationData {
    email: string;
    orgId: string;
    role: 'enterprise_admin' | 'instructor' | 'reviewer';
    invitedBy: string;
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
                token,
                org_id: data.orgId,
                role: data.role,
                invited_by: data.invitedBy,
                status: 'pending'
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating invitation:', error)
            return { success: false, error: error.message }
        }

        // TODO: Integrate with real email service (e.g. Resend) to send the invite link
        // For now, we return the token/url for testing
        const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/enterprise/invitation/accept?token=${token}`

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
            .select('*, organizations(name)')
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

        if (profile && (profile.role === 'student' || profile.role === 'learner')) {
            await supabase
                .from('profiles')
                .update({ role: invitation.role === 'enterprise_admin' ? 'enterprise_admin' : 'instructor' })
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

        return { success: true }
    }
}
