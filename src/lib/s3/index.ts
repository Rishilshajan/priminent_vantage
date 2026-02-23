import 'server-only';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UploadFileParams } from "@/lib/s3/shared";

const AWS_REGION = process.env.AWS_REGION;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!AWS_REGION || !AWS_S3_BUCKET_NAME || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
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

// Uploads a file (or Buffer) to the configured S3 bucket and returns its public URL and storage key
export async function uploadToS3(params: UploadFileParams): Promise<{ url: string; key: string }> {
    const { file, fileName, folder, orgId, simulationId, taskId, contentType } = params;

    if (!BUCKET_NAME || !AWS_REGION) {
        throw new Error("S3 is not configured. Missing AWS_S3_BUCKET_NAME or AWS_REGION.");
    }

    let key = `${folder}/${orgId}`;
    if (simulationId) key += `/${simulationId}`;
    if (taskId) key += `/${taskId}`;
    key += `/${fileName}`;

    let buffer: Buffer;
    if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
    } else {
        buffer = file;
    }

    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: contentType || (file instanceof File ? file.type : 'application/octet-stream'),
        });

        await s3Client.send(command);
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

// Sends a delete command to S3 to permanently remove a file by its storage key
export async function deleteFromS3(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });
    await s3Client.send(command);
}

// Generates a time-limited presigned S3 URL for temporary private file access
export async function getSignedS3Url(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
}

// Extracts the S3 object key from a full S3 public URL by stripping the host portion
export function extractS3KeyFromUrl(url: string): string | null {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        return pathname.startsWith('/') ? pathname.substring(1) : pathname;
    } catch {
        return null;
    }
}

export { validateFileType, validateFileSize, FILE_VALIDATION } from "@/lib/s3/shared";
