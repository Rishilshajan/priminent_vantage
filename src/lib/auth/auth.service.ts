import { createClient } from '@/lib/supabase/server'

export const authService = {
    // Registers a new user with email, password, and optional metadata (name, role, etc.)
    async signUp(data: { email: string; password: string; options?: Record<string, unknown> }) {
        const supabase = await createClient()
        return await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: data.options,
        })
    },

    // Authenticates an existing user with email and password
    async signInWithPassword(data: { email: string; password: string }) {
        const supabase = await createClient()
        return await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })
    },

    // Initiates an OAuth login flow with the given provider (Google, GitHub) and redirect URL
    async signInWithOAuth(provider: 'google' | 'github', redirectTo: string) {
        const supabase = await createClient()
        return await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo,
            },
        })
    },

    // Sends a password reset email with a redirect link to the specified URL
    async resetPasswordForEmail(email: string, redirectTo: string) {
        const supabase = await createClient()
        return await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
        })
    },

    // Signs out the currently authenticated user and clears the session
    async signOut() {
        const supabase = await createClient()
        return await supabase.auth.signOut()
    },

    // Returns the currently authenticated user object from the active session
    async getUser() {
        const supabase = await createClient()
        return await supabase.auth.getUser()
    }
}
