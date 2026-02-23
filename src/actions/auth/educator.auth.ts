'use server'

import { revalidatePath } from 'next/cache'
import { authService } from '@/lib/auth/auth.service'
import { logServerEvent } from "@/lib/logger/server"
import { getBaseUrl } from '@/lib/utils/url'


//Educator-focused signup
export async function educatorSignup(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string
    const baseUrl = await getBaseUrl()

    const fullName = `${firstName} ${lastName}`.trim()
    const { data: signupData, error } = await authService.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${baseUrl}/auth/callback?next=/educators/dashboard`,
            data: {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                role: 'student', // Educators start as students until verification
            }
        }
    })

    if (error) {
        await logServerEvent({
            level: 'ERROR',
            action: {
                code: 'EDUCATOR_SIGNUP_FAILED',
                category: 'SECURITY'
            },
            actor: {
                type: 'user',
                role: 'educator',
                name: fullName
            },
            message: `Signup failed for educator ${fullName}: ${error.message}`,
            params: { email, firstName, lastName }
        })
        return { error: error.message }
    }

    await logServerEvent({
        level: 'SUCCESS',
        action: {
            code: 'EDUCATOR_SIGNUP_SUCCESS',
            category: 'SECURITY'
        },
        actor: {
            type: 'user',
            id: signupData.user?.id,
            role: 'educator',
            name: fullName
        },
        message: `Educator ${fullName} signed up successfully (pending verification)`,
        params: { email }
    })

    revalidatePath('/', 'layout')
    return { success: true, message: "Check your email for the confirmation link." }
}
