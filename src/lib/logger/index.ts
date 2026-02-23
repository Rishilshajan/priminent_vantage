import { createClient } from "@/lib/supabase/client"

export type LogLevel = 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'

export interface CreateSystemLogParams {
    event_id?: string
    version?: string
    timestamp?: string
    level: LogLevel
    message?: string
    actor?: {
        type?: 'user' | 'system' | 'api_key'
        id?: string
        name?: string
        role?: string
        ip?: string
        user_agent?: string
    }
    organization?: {
        org_id?: string
        org_name?: string
    }
    action: {
        code: string
        category: 'SECURITY' | 'ORGANIZATION' | 'CONTENT' | 'SYSTEM'
    }
    target?: {
        resource_type?: string
        resource_id?: string
    }
    params?: Record<string, unknown>
    result?: Record<string, unknown>
    tags?: string[]
}

export interface SystemLog {
    id: string
    event_version?: string
    timestamp: string
    level: LogLevel
    message: string | null
    actor_type: 'user' | 'system' | 'api_key'
    actor_id: string | null
    actor_name: string | null
    actor_role?: string | null
    actor_ip?: string | null
    actor_user_agent?: string | null
    org_id?: string | null
    org_name?: string | null
    action_code: string
    action_category: 'SECURITY' | 'ORGANIZATION' | 'CONTENT' | 'SYSTEM'
    target_resource_type?: string | null
    target_resource_id?: string | null
    resource_type?: string | null
    resource_id?: string | null
    params: Record<string, unknown>
    result: Record<string, unknown>
    tags: string[]
}

/**
 * Logs a system event from a Client Component.
 */
export async function logSystemEvent(logData: CreateSystemLogParams) {
    const supabase = createClient()

    try {
        const payload = {
            event_id: logData.event_id,
            event_version: logData.version || '1.0.0',
            timestamp: logData.timestamp || new Date().toISOString(),
            level: logData.level,
            message: logData.message || null,
            actor_type: logData.actor?.type,
            actor_id: logData.actor?.id,
            actor_name: logData.actor?.name,
            actor_role: logData.actor?.role,
            actor_ip: logData.actor?.ip,
            actor_user_agent: logData.actor?.user_agent,
            org_id: logData.organization?.org_id,
            org_name: logData.organization?.org_name,
            action_code: logData.action.code,
            action_category: logData.action.category,
            target_resource_type: logData.target?.resource_type,
            target_resource_id: logData.target?.resource_id,
            params: logData.params || {},
            result: logData.result || {},
            tags: logData.tags || [],
        }

        const { error } = await supabase
            .from('system_logs')
            .insert(payload)

        if (error) {
            console.error('Failed to write system log (client):', JSON.stringify(error, null, 2))
        }
    } catch (err) {
        console.error('Exception writing system log (client):', err)
    }
}
