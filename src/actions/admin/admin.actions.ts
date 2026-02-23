'use server'

import { adminService } from '@/lib/admin/admin.service'
import { createClient } from '@/lib/supabase/server'

// Fetches the admin profile for the currently authenticated user
export async function getAdminProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user)
        return null

    try {
        return await adminService.getProfile(user.id)
    } catch (error) {
        console.error('Failed to fetch admin profile:', error)
        return null
    }
}
