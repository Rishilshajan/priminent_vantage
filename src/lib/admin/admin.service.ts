import { createClient } from '@/lib/supabase/server'

export const adminService = {
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

    // Placeholder for other admin actions found in components
    // logic from access-codes, candidates, etc. will be moved here as needed
}
