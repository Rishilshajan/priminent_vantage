'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { authService } from '@/lib/auth/auth.service'
import { logServerEvent } from "@/lib/logger-server"
import { getBaseUrl } from '@/lib/utils/url'

export async function signup(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string

    const { error } = await authService.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                role: 'student',
            }
        }
    })

    if (error) {
        await logServerEvent({
            level: 'ERROR',
            action: {
                code: 'AUTH_SIGNUP_FAILED',
                category: 'SECURITY'
            },
            actor: {
                type: 'user',
                role: 'student',
                user_agent: 'System'
            },
            message: error.message,
            params: { email, firstName, lastName, phone }
        })
        return { error: error.message }
    }

    await logServerEvent({
        level: 'SUCCESS',
        action: {
            code: 'AUTH_SIGNUP_SUCCESS',
            category: 'SECURITY'
        },
        actor: {
            type: 'user',
            role: 'student'
        },
        message: 'User signed up successfully',
        params: { email, role: 'student' }
    })

    revalidatePath('/', 'layout')
    return { success: true, message: "Check your email for the confirmation link." }
}

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

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
            actor: {
                type: 'user'
            },
            message: error.message,
            params: { email }
        })
        return { error: error.message }
    }

    await logServerEvent({
        level: 'SUCCESS',
        action: {
            code: 'AUTH_LOGIN_SUCCESS',
            category: 'SECURITY'
        },
        actor: {
            type: 'user'
        },
        message: 'User logged in successfully',
        params: { email }
    })

    revalidatePath('/', 'layout')

    // Fetch profile to determine redirect
    const { data: { user } } = await authService.getUser()
    if (user) {
        // Better to just fetch profile directly or use a shared service method
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

        if (profile?.role === 'admin' || profile?.role === 'super_admin') {
            redirect('/admin/dashboard')
        } else if (profile?.role === 'enterprise') {
            // Check if MFA is required for enterprise role
            const { data: factors, error: mfaError } = await supabase.auth.mfa.listFactors()
            if (!mfaError && factors.all && factors.all.length > 0) {
                redirect('/enterprise/mfa-verify')
            }
            redirect('/enterprise/dashboard')
        }
    }

    redirect('/')
}

export async function signInWithGoogle() {
    const baseUrl = await getBaseUrl()
    const { data, error } = await authService.signInWithOAuth(
        'google',
        `${baseUrl}/auth/callback`
    )

    if (data.url) {
        redirect(data.url)
    }
}

export async function resetPasswordForEmail(formData: FormData) {
    const email = formData.get('email') as string
    const baseUrl = await getBaseUrl()

    const { error } = await authService.resetPasswordForEmail(
        email,
        `${baseUrl}/auth/callback?next=/reset-password/update`
    )

    if (error) {
        await logServerEvent({
            level: 'ERROR',
            action: {
                code: 'AUTH_PASSWORD_RESET_REQUEST_FAILED',
                category: 'SECURITY'
            },
            actor: {
                type: 'user'
            },
            message: error.message,
            params: { email }
        })
        return { error: error.message }
    }

    await logServerEvent({
        level: 'INFO',
        action: {
            code: 'AUTH_PASSWORD_RESET_REQUEST',
            category: 'SECURITY'
        },
        actor: {
            type: 'user'
        },
        message: 'Password reset requested',
        params: { email }
    })

    return { success: true }
}

export async function resetEnterprisePassword(formData: FormData) {
    const email = formData.get('email') as string
    const baseUrl = await getBaseUrl()

    const { error } = await authService.resetPasswordForEmail(
        email,
        `${baseUrl}/auth/callback?next=/enterprise/reset-password/update`
    )

    if (error) {
        await logServerEvent({
            level: 'ERROR',
            action: {
                code: 'ENTERPRISE_PASSWORD_RESET_REQUEST_FAILED',
                category: 'SECURITY'
            },
            actor: {
                type: 'user'
            },
            message: error.message,
            params: { email }
        })
        return { error: error.message }
    }

    await logServerEvent({
        level: 'INFO',
        action: {
            code: 'ENTERPRISE_PASSWORD_RESET_REQUEST',
            category: 'SECURITY'
        },
        actor: {
            type: 'user'
        },
        message: 'Enterprise password reset requested',
        params: { email }
    })

    return { success: true }
}

export async function signOut() {
    const { data: { user } } = await authService.getUser()

    if (user) {
        await logServerEvent({
            level: 'SUCCESS',
            action: {
                code: 'AUTH_LOGOUT_SUCCESS',
                category: 'SECURITY'
            },
            actor: {
                type: 'user',
                id: user.id,
                role: 'student' // We can infer or fetch role if needed, but for logout current user is enough context usually
            },
            message: 'User logged out successfully',
            params: { email: user.email }
        })
    }

    await authService.signOut()
    redirect('/login')
}

export async function enrollMFA() {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // 1. Check for existing factors
    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors()

    if (!listError && factors?.all && factors.all.length > 0) {
        // If there are existing factors, we'll unenroll them to allow a fresh setup
        // This is safe because we are in the Onboarding/Setup phase
        for (const factor of factors.all) {
            await supabase.auth.mfa.unenroll({ factorId: factor.id })
        }
    }

    // 2. Start new enrollment
    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
    })

    if (error) {
        console.error("MFA Enrollment Error:", error.message)
        return { error: error.message }
    }

    return {
        success: true,
        id: data.id,
        totp: data.totp
    }
}

export async function verifyMFA(factorId: string, code: string) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // 1. Create a challenge
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId
    })

    if (challengeError) {
        return { error: challengeError.message }
    }

    // 2. Verify the code against the challenge
    const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code
    })

    if (verifyError) {
        return { error: verifyError.message }
    }

    return { success: true }
}
