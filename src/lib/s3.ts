import 'server-only';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UploadFileParams } from "./s3-shared";

// These variables are only available on the server
const AWS_REGION = process.env.AWS_REGION;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// Initialize S3 Client lazily or check envs in a way that doesn't crash module evaluation if possible,
// but for server-side it's better to know early.
if (!AWS_REGION || !AWS_S3_BUCKET_NAME || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    // Only log this once on the server
    if (typeof window === 'undefined') {
        console.warn("S3 Configuration is incomplete. Uploads will fail until environment variables are set.");
    }
}

export const s3Client = new S3Client({
    region: AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID || '',
        secretAccessKey: AWS_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = AWS_S3_BUCKET_NAME || '';

/**
 * Upload a file to S3
 */
export async function uploadToS3(params: UploadFileParams): Promise<{ url: string; key: string }> {
    const { file, fileName, folder, orgId, simulationId, taskId, contentType } = params;

    if (!BUCKET_NAME || !AWS_REGION) {
        throw new Error("S3 is not configured. Missing AWS_S3_BUCKET_NAME or AWS_REGION.");
    }

    // Construct S3 key path
    let key = `${folder}/${orgId}`;
    if (simulationId) key += `/${simulationId}`;
    if (taskId) key += `/${taskId}`;
    key += `/${fileName}`;

    // Convert File to Buffer if needed
    let buffer: Buffer;
    if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
    } else {
        buffer = file;
    }

    // Upload to S3
    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: contentType || (file instanceof File ? file.type : 'application/octet-stream'),
        });

        await s3Client.send(command);

        // Construct public URL
        const url = `https://${BUCKET_NAME}.s3.${AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

        return { url, key };
    } catch (err: any) {
        console.error("S3 Upload Error Detail:", {
            message: err.message,
            code: err.code,
            requestId: err.$metadata?.requestId,
            bucket: BUCKET_NAME,
            key: key
        });
        throw new Error(`S3 Upload failed: ${err.message} (${err.code || 'unknown'})`);
    }
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    await s3Client.send(command);
}

/**
 * Generate a signed URL for private file access (optional, for future use)
 */
export async function getSignedS3Url(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
}

/**
 * Extract S3 key from URL
 */
export function extractS3KeyFromUrl(url: string): string | null {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        // Remove leading slash
        return pathname.startsWith('/') ? pathname.substring(1) : pathname;
    } catch {
        return null;
    }
}

export { validateFileType, validateFileSize, FILE_VALIDATION } from "./s3-shared";
