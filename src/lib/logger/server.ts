import { createClient } from "@/lib/supabase/server"
import { CreateSystemLogParams } from "./index"

// Inserts a structured system log event into the DB from any Server Component or Server Action
export async function logServerEvent(logData: CreateSystemLogParams) {
    const supabase = await createClient()

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
            console.error('Failed to write system log (server):', JSON.stringify(error, null, 2))
        }
    } catch (err) {
        console.error('Exception writing system log (server):', err)
    }
}
