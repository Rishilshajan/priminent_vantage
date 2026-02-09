'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { authService } from '@/lib/auth/auth.service'
import { logServerEvent } from "@/lib/logger-server"

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
        const { getAdminProfile } = await import('@/actions/admin.actions') // circular dependency risk?
        // Better to just fetch profile directly or use a shared service method
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

        if (profile?.role === 'admin' || profile?.role === 'super_admin') {
            redirect('/admin/dashboard')
        }
    }

    redirect('/employee')
}

export async function signInWithGoogle() {
    const { data, error } = await authService.signInWithOAuth(
        'google',
        `http://localhost:3000/auth/callback`
    )

    if (data.url) {
        redirect(data.url)
    }
}

export async function resetPasswordForEmail(formData: FormData) {
    const email = formData.get('email') as string

    const { error } = await authService.resetPasswordForEmail(
        email,
        'http://localhost:3000/auth/callback?next=/reset-password/update'
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
