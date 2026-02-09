import { createClient as createServerClient } from "@/lib/supabase/server"
import { CreateSystemLogParams } from "@/lib/logger"

/**
 * Logs a system event from a Server Component or Server Action.
 * Uses the server-side Supabase client.
 */
export async function logServerEvent(logData: CreateSystemLogParams) {
    const supabase = await createServerClient()

    try {
        const { error } = await supabase
            .from('system_logs')
            .insert({
                ...logData,
                timestamp: new Date().toISOString(),
            })

        if (error) {
            console.error('Failed to write system log (server):', error)
        }
    } catch (err) {
        console.error('Exception writing system log (server):', err)
    }
}
