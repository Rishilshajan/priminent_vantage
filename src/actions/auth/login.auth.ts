'use server'

import { authService } from '@/lib/auth/auth.service'
import { logServerEvent } from "@/lib/logger/server"
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

//Centralized login action that handles all roles
export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const flow = formData.get('flow') as string

    const { error } = await authService.signInWithPassword({
        email,
        password,
    })

    if (error) {
        // Sanitize error message to prevent framework noise or HTML from leaking to UI
        let cleanError = error.message;
        if (cleanError.includes('<!DOCTYPE') || cleanError.includes('Unexpected token')) {
            cleanError = "A network error occurred while connecting to the authentication service. Please check your internet or try again later.";
        }

        // Truncate extremely long errors
        if (cleanError.length > 200) {
            cleanError = cleanError.substring(0, 197) + "...";
        }

        await logServerEvent({
            level: 'ERROR',
            action: {
                code: 'AUTH_LOGIN_FAILED',
                category: 'SECURITY'
            },
            actor: { type: 'user' },
            message: cleanError,
            params: { email, flow, rawError: error.message.substring(0, 500) }
        })
        return { error: cleanError }
    }

    //Success Logging
    const { data: { user } } = await authService.getUser()
    let actorName = email
    let orgName = undefined

    if (user) {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()
        const { data: profile } = await supabase.from('profiles').select('first_name, last_name, role').eq('id', user.id).single()

        if (profile) {
            actorName = `${profile.first_name} ${profile.last_name || ''}`.trim()

            // Update logged_in timestamp
            await supabase
                .from('profiles')
                .update({ logged_in: new Date().toISOString() })
                .eq('id', user.id)

            if (profile.role === 'enterprise') {
                const { data: orgMember } = await supabase
                    .from('organization_members')
                    .select('org_id, organizations(name)')
                    .eq('user_id', user.id)
                    .single()

                if (orgMember?.organizations) {
                    orgName = (orgMember.organizations as any).name
                }
            }
        }
    }

    await logServerEvent({
        level: 'SUCCESS',
        action: {
            code: 'AUTH_LOGIN_SUCCESS',
            category: 'SECURITY'
        },
        actor: {
            type: 'user',
            id: user?.id,
            name: actorName
        },
        organization: orgName ? { org_name: orgName } : undefined,
        message: orgName ? `${orgName} logged in successfully` : `${actorName} logged in successfully`,
        params: { email, flow }
    })

    revalidatePath('/', 'layout')

    //Handle Role-Based Redirection
    if (user) {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

        console.log(`[AUTH] Processing login for ${email} (${profile?.role})`);

        if (profile?.role === 'admin' || profile?.role === 'super_admin') {
            redirect('/admin/dashboard')
        }

        else if (profile?.role === 'enterprise') {
            const { data: membership } = await supabase
                .from('organization_members')
                .select('org_id, role')
                .eq('user_id', user.id)
                .maybeSingle()

            console.log(`[AUTH] Enterprise membership:`, membership);

            if (membership) {
                const { data: settings } = await supabase
                    .from('enterprise_security_settings')
                    .select('enforce_mfa_admins, enforce_mfa_all')
                    .eq('org_id', membership.org_id)
                    .maybeSingle()

                const { data: factors, error: mfaError } = await supabase.auth.mfa.listFactors()
                const hasFactors = !mfaError && factors.all && factors.all.length > 0

                console.log(`[AUTH] MFA Settings:`, settings);
                console.log(`[AUTH] MFA Factors found:`, hasFactors, factors?.all?.length);

                if (hasFactors) {
                    const isAdmin = ['admin', 'enterprise_admin', 'owner'].includes(membership.role)
                    const isMfaEnforced = settings?.enforce_mfa_all || (settings?.enforce_mfa_admins && isAdmin)

                    console.log(`[AUTH] MFA Enforced decision:`, isMfaEnforced, `(All: ${settings?.enforce_mfa_all}, Admin: ${settings?.enforce_mfa_admins}, IsAdmin: ${isAdmin})`);

                    if (isMfaEnforced) {
                        redirect('/enterprise/mfa-verify')
                    }
                } else {
                    // Mandatory setup for users who haven't enrolled yet
                    const isAdmin = ['admin', 'enterprise_admin', 'owner'].includes(membership.role)
                    const isMfaEnforced = settings?.enforce_mfa_all || (settings?.enforce_mfa_admins && isAdmin)

                    if (isMfaEnforced) {
                        console.log(`[AUTH] Redirecting to MFA Setup as enrollment is mandatory`);
                        redirect('/enterprise/mfa-setup')
                    }
                }
            }
            redirect('/enterprise/dashboard')
        }

        else if (profile?.role === 'educator' || flow === 'educator') {
            redirect('/educators/dashboard')
        }

        else if (profile?.role === 'student') {
            // Check if student has completed basic structural profiling.
            // Using user_type as a baseline.
            const { data: studentProfile } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('id', user.id)
                .single()

            if (!studentProfile || !studentProfile.user_type) {
                redirect('/student/onboarding')
            } else {
                redirect('/student/dashboard')
            }
        }
    }

    redirect('/')
}
