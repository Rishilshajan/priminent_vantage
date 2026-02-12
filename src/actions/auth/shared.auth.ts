'use server'

import { authService } from '@/lib/auth/auth.service'
import { logServerEvent } from "@/lib/logger-server"
import { getBaseUrl } from '@/lib/utils/url'
import { redirect } from 'next/navigation'


//Common sign out action
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
                id: user.id
            },
            message: 'User logged out successfully',
            params: { email: user.email }
        })
    }

    await authService.signOut()
    redirect('/login')
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
