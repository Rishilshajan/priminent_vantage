"use server";

import { assetService } from "@/lib/simulations/asset.service";

// Uploads a simulation or task asset file to S3 and returns the public URL
export async function uploadAsset(formData: FormData) {
    try {
        const data = await assetService.uploadAsset(formData);
        return { data };
    } catch (err: any) {
        return { error: err.message || "Failed to upload asset" };
    }
}

// Deletes a simulation asset record and removes the file from S3 storage
export async function deleteAsset(assetId: string) {
    try {
        await assetService.deleteAsset(assetId);
        return { success: true };
    } catch (err: any) {
        return { error: err.message || "Failed to delete asset" };
    }
}
