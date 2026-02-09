import { createClient } from "@/lib/supabase/client"

export type LogLevel = 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'

export interface SystemLog {
    id: string
    event_version: number
    timestamp: string
    level: LogLevel
    actor_id: string | null
    actor_type: string | null
    actor_name: string | null
    actor_role: string | null
    actor_email: string | null
    ip_address: string | null
    user_agent: string | null
    org_id: string | null
    org_name: string | null
    action_code: string
    action_category: string | null
    resource_type: string | null
    resource_id: string | null
    message: string | null
    params: Record<string, any> | null
    result: Record<string, any> | null
    tags: string[] | null
    created_at: string
}

export interface CreateSystemLogParams {
    level: LogLevel
    action_code: string
    action_category?: string
    actor_id?: string
    actor_type?: 'user' | 'system' | 'api_key'
    actor_name?: string
    actor_role?: string
    actor_email?: string
    ip_address?: string
    user_agent?: string
    org_id?: string
    org_name?: string
    resource_type?: string
    resource_id?: string
    message?: string
    params?: Record<string, any>
    result?: Record<string, any>
    tags?: string[]
}

/**
 * Logs a system event from a Client Component.
 * Uses the browser-side Supabase client.
 */
export async function logSystemEvent(logData: CreateSystemLogParams) {
    const supabase = createClient()

    try {
        const { error } = await supabase
            .from('system_logs')
            .insert({
                ...logData,
                timestamp: new Date().toISOString(),
            })

        if (error) {
            console.error('Failed to write system log (client):', error)
        }
    } catch (err) {
        console.error('Exception writing system log (client):', err)
    }
}
