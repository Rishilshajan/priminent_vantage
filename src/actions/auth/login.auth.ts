'use server'

import { authService } from '@/lib/auth/auth.service'
import { logServerEvent } from "@/lib/logger-server"
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
        await logServerEvent({
            level: 'ERROR',
            action: {
                code: 'AUTH_LOGIN_FAILED',
                category: 'SECURITY'
            },
            actor: { type: 'user' },
            message: error.message,
            params: { email, flow }
        })
        return { error: error.message }
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

        if (profile?.role === 'admin' || profile?.role === 'super_admin') {
            redirect('/admin/dashboard')
        }

        else if (profile?.role === 'enterprise') {
            const { data: factors, error: mfaError } = await supabase.auth.mfa.listFactors()
            if (!mfaError && factors.all && factors.all.length > 0) {
                redirect('/enterprise/mfa-verify')
            }
            redirect('/enterprise/dashboard')

        }

        else if (profile?.role === 'educator' || flow === 'educator') {
            redirect('/educators/dashboard')
        }

        else if (profile?.role === 'student') {
            redirect('/student/dashboard')
        }
    }

    redirect('/')
}
