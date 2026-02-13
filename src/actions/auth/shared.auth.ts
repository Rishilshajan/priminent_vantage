'use server'

import { authService } from '@/lib/auth/auth.service'
import { logServerEvent } from "@/lib/logger-server"
import { getBaseUrl } from '@/lib/utils/url'
import { redirect } from 'next/navigation'


//Common sign out action
export async function signOut(redirectTo: string = '/login') {
    const { data: { user } } = await authService.getUser()

    if (user) {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()
        const { data: profile } = await supabase.from('profiles').select('first_name, last_name, role').eq('id', user.id).single()
        const actorName = profile ? `${profile.first_name} ${profile.last_name || ''}`.trim() : user.email

        await logServerEvent({
            level: 'SUCCESS',
            action: {
                code: 'AUTH_LOGOUT_SUCCESS',
                category: 'SECURITY'
            },
            actor: {
                type: 'user',
                id: user.id,
                name: actorName,
                role: profile?.role
            },
            message: `${actorName} logged out successfully`,
            params: { email: user.email }
        })
    }

    await authService.signOut()
    redirect(redirectTo)
}


//Common Google OAuth action
export async function signInWithGoogle(next?: string) {
    const baseUrl = await getBaseUrl()
    const redirectTo = next
        ? `${baseUrl}/auth/callback?next=${next}`
        : `${baseUrl}/auth/callback`

    const { data, error } = await authService.signInWithOAuth(
        'google',
        redirectTo
    )

    if (data.url) {
        redirect(data.url)
    }
}
