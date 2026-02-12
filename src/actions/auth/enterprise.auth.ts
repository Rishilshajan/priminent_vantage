'use server'

import { authService } from '@/lib/auth/auth.service'
import { logServerEvent } from "@/lib/logger-server"
import { getBaseUrl } from '@/lib/utils/url'


//Enterprise-specific password reset
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
                code: 'ENTERPRISE_PASSWORD_RESET_FAILED',
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
            code: 'ENTERPRISE_PASSWORD_RESET_REQUESTED',
            category: 'SECURITY'
        },
        actor: { type: 'user' },
        message: 'Enterprise password reset requested',
        params: { email }
    })

    return { success: true }
}


//Enroll MFA for Enterprise users
export async function enrollMFA() {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors()

    if (!listError && factors?.all && factors.all.length > 0) {
        for (const factor of factors.all) {
            await supabase.auth.mfa.unenroll({ factorId: factor.id })
        }
    }

    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
    })

    if (error) {
        return { error: error.message }
    }

    return {
        success: true,
        id: data.id,
        totp: data.totp
    }
}


//Verify MFA for Enterprise users
export async function verifyMFA(factorId: string, code: string) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId
    })

    if (challengeError) return { error: challengeError.message }

    const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code
    })

    if (verifyError) return { error: verifyError.message }

    return { success: true }
}
