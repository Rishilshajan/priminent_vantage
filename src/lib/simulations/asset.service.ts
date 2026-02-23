import { createClient } from "@/lib/supabase/server";
import { logServerEvent } from "@/lib/logger/server";
import { uploadToS3, deleteFromS3, extractS3KeyFromUrl } from "@/lib/s3/index";

export const assetService = {
    // Uploads a simulation/task asset to S3 and persists the metadata record in the DB
    async uploadAsset(formData: FormData) {
        try {
            const simulationId = formData.get('simulationId') as string;
            const assetType = formData.get('assetType') as 'logo' | 'banner' | 'video' | 'pdf' | 'dataset' | 'document' | 'signature';
            const taskId = formData.get('taskId') as string | undefined;
            const file = formData.get('file') as File;

            if (!file || !((file as any) instanceof File)) {
                throw new Error('Invalid file upload: No file received');
            }

            const supabase = await createClient();

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication required");

            const { data: simulation } = await supabase
                .from('simulations')
                .select('org_id')
                .eq('id', simulationId)
                .single();

            if (!simulation) throw new Error("Simulation not found");

            const { data: membership } = await supabase
                .from('organization_members')
                .select('role, org_id')
                .eq('org_id', simulation.org_id)
                .eq('user_id', user.id)
                .single();

            if (!membership || !['admin', 'owner'].includes(membership.role)) {
                throw new Error("Access denied: You don't have permission to upload assets");
            }

            const folderMap: Record<string, string> = {
                logo: 'logos',
                banner: 'banners',
                video: 'videos',
                pdf: 'tasks',
                dataset: 'tasks',
                document: 'tasks',
                signature: 'signatures',
            };

            const folder = folderMap[assetType] || 'misc';

            const { url, key } = await uploadToS3({
                file,
                fileName: file.name,
                folder,
                orgId: membership.org_id,
                simulationId,
                taskId,
                contentType: file.type,
            });

            const { data: asset, error: assetError } = await supabase
                .from('simulation_assets')
                .insert({
                    simulation_id: simulationId,
                    task_id: taskId,
                    asset_type: assetType,
                    file_name: file.name,
                    file_url: url,
                    file_size: file.size,
                    mime_type: file.type || 'application/octet-stream',
                    uploaded_by: user.id,
                })
                .select()
                .single();

            if (assetError) {
                await deleteFromS3(key);
                throw new Error(`Failed to save asset record: ${assetError.message}`);
            }

            return { url, asset };
        } catch (err: any) {
            throw err;
        }
    },

    // Deletes a single asset: removes the file from S3 and the record from the DB
    async deleteAsset(assetId: string) {
        const supabase = await createClient();

        try {
            const { data: asset } = await supabase
                .from('simulation_assets')
                .select('*')
                .eq('id', assetId)
                .single();

            if (!asset) throw new Error("Asset not found");

            const key = extractS3KeyFromUrl(asset.file_url);
            if (key) {
                await deleteFromS3(key);
            }

            const { error: deleteError } = await supabase
                .from('simulation_assets')
                .delete()
                .eq('id', assetId);

            if (deleteError) throw new Error("Failed to delete asset");

            return true;
        } catch (err: any) {
            throw err;
        }
    },

    // Bulk-deletes all S3 files for a simulation's assets (called before deleting the simulation)
    async deleteSimulationAssets(simulationId: string) {
        const supabase = await createClient();

        try {
            const { data: assets } = await supabase
                .from('simulation_assets')
                .select('*')
                .eq('simulation_id', simulationId);

            if (assets && assets.length > 0) {
                for (const asset of assets) {
                    const key = extractS3KeyFromUrl(asset.file_url);
                    if (key) {
                        await deleteFromS3(key);
                    }
                }
            }
            return true;
        } catch (err: any) {
            console.error("Cleanup assets error:", err);
            return false;
        }
    },

    // Bulk-deletes all S3 files for a specific task's assets (called before deleting the task)
    async deleteTaskAssets(taskId: string) {
        const supabase = await createClient();

        try {
            const { data: assets } = await supabase
                .from('simulation_assets')
                .select('*')
                .eq('task_id', taskId);

            if (assets && assets.length > 0) {
                for (const asset of assets) {
                    const key = extractS3KeyFromUrl(asset.file_url);
                    if (key) {
                        await deleteFromS3(key);
                    }
                }
            }
            return true;
        } catch (err: any) {
            console.error("Cleanup task assets error:", err);
            return false;
        }
    }
};
