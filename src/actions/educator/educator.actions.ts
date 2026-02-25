"use server";

import { educatorService } from "@/lib/educator/educator.service";
import { revalidatePath } from "next/cache";

// Fetches aggregate stats for the educator engagement dashboard
export async function getEducatorStats() {
    try {
        const stats = await educatorService.getStats();
        return { success: true as const, stats };
    } catch (error) {
        return { success: false as const, error: "Failed to fetch statistics" };
    }
}

// Fetches a paginated list of approved educators with optional search filtering
export async function getEducatorsList(page: number = 1, pageSize: number = 8, search?: string) {
    try {
        const result = await educatorService.getList(page, pageSize, search);
        return { success: true as const, ...result };
    } catch (error) {
        return { success: false as const, error: "Failed to fetch educators" };
    }
}

// Deletes an educator and removes their associated application record
export async function deleteEducator(applicationId: string, userId: string) {
    try {
        await educatorService.deleteEducator(applicationId, userId);
        revalidatePath('/admin/educators');
        return { success: true as const };
    } catch (error) {
        return { success: false as const, error: "Failed to delete educator" };
    }
}
