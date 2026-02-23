import { createClient } from '@/lib/supabase/server'

export const adminService = {
    // Fetches the full profile record for an admin user by their auth user ID
    async getProfile(userId: string) {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) throw error
        return data
    },
}
