'use server'

import { adminService } from '@/lib/admin/admin.service'
import { createClient } from '@/lib/supabase/server'

// Example action structure based on potential needs
export async function getAdminProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    try {
        return await adminService.getProfile(user.id)
    } catch (error) {
        console.error('Failed to fetch admin profile:', error)
        return null
    }
}
