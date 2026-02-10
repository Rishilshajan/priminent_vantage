import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const authService = {
    async signUp(data: { email: string; password: string; options?: Record<string, unknown> }) {
        const supabase = await createClient()
        return await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: data.options,
        })
    },

    async signInWithPassword(data: { email: string; password: string }) {
        const supabase = await createClient()
        return await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })
    },

    async signInWithOAuth(provider: 'google' | 'github', redirectTo: string) {
        const supabase = await createClient()
        return await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo,
            },
        })
    },

    async resetPasswordForEmail(email: string, redirectTo: string) {
        const supabase = await createClient()
        return await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
        })
    },

    async signOut() {
        const supabase = await createClient()
        return await supabase.auth.signOut()
    },

    async getUser() {
        const supabase = await createClient()
        return await supabase.auth.getUser()
    }
}
