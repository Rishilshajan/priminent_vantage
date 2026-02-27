"use server"

import { createClient } from "@/lib/supabase/server"
import { enterpriseManagementService } from "@/lib/enterprise/enterprise-management.service"

export async function getAnalyticsDataAction() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const data = await enterpriseManagementService.getAnalyticsData(user.id);
        return { success: true, data };
    } catch (err: any) {
        console.error("Error in getAnalyticsDataAction:", err);
        return { success: false, error: err.message || "Failed to fetch analytics data" };
    }
}
