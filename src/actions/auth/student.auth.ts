'use server'

import { revalidatePath } from 'next/cache'
import { authService } from '@/lib/auth/auth.service'
import { logServerEvent } from "@/lib/logger/server"
import { getBaseUrl } from '@/lib/utils/url'


//Student-focused signup
export async function studentSignup(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string
    const baseUrl = await getBaseUrl()

    const { error } = await authService.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${baseUrl}/auth/callback`,
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
                code: 'STUDENT_SIGNUP_FAILED',
                category: 'SECURITY'
            },
            actor: {
                type: 'user',
                role: 'student'
            },
            message: error.message,
            params: { email, firstName, lastName }
        })
        return { error: error.message }
    }

    await logServerEvent({
        level: 'SUCCESS',
        action: {
            code: 'STUDENT_SIGNUP_SUCCESS',
            category: 'SECURITY'
        },
        actor: {
            type: 'user',
            role: 'student'
        },
        message: 'Student signed up successfully',
        params: { email }
    })

    revalidatePath('/', 'layout')
    return { success: true, message: "Check your email for the confirmation link." }
}


//Student-focused password reset
export async function studentResetPassword(formData: FormData) {
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
                code: 'STUDENT_PASSWORD_RESET_FAILED',
                category: 'SECURITY'
            },
            actor: { type: 'user' },
            message: error.message,
            params: { email }
        })
        return { error: error.message }
    }

    await logServerEvent({
        level: 'INFO',
        action: {
            code: 'STUDENT_PASSWORD_RESET_REQUESTED',
            category: 'SECURITY'
        },
        actor: { type: 'user' },
        message: 'Student password reset requested',
        params: { email }
    })

    return { success: true }
}
