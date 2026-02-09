'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { authService } from '@/lib/auth/auth.service'

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
        return { error: error.message }
    }

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
        return { error: error.message }
    }

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
            redirect('/admin')
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
        return { error: error.message }
    }

    return { success: true }
}
