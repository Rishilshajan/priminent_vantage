'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getBaseUrl } from '@/lib/utils/url'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string

    const { error } = await supabase.auth.signUp({
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
        return { error: error.message }
    }

    revalidatePath('/', 'layout')

    return { success: true, message: "Check your email for the confirmation link." }
}


export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}


export async function signInWithGoogle() {
    const supabase = await createClient()
    const baseUrl = await getBaseUrl()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${baseUrl}/auth/callback`,
        },
    })

    if (data.url) {
        redirect(data.url)
    }
}


export async function resetPasswordForEmail(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const baseUrl = await getBaseUrl()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/auth/callback?next=/update-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
