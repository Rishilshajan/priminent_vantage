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

/**
 * Fetches analytics and engagement data for the admin reports dashboard.
 */
export async function getAdminReportsDataAction() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false as const, error: "Unauthorized" }

    try {
        const profile = await adminService.getProfile(user.id)
        if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
            return { success: false as const, error: "Permission denied" }
        }

        const data = await adminService.getReportsData()
        return { success: true as const, data }
    } catch (error: any) {
        console.error('Failed to fetch admin reports data:', error)
        return { success: false as const, error: error.message || "Failed to load reports data." }
    }
}
