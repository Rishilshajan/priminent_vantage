import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export interface UploadFileParams {
    file: File | Buffer;
    fileName: string;
    folder: string; // e.g., "logos", "banners", "videos", "tasks"
    orgId: string;
    simulationId?: string;
    taskId?: string;
    contentType?: string;
}

/**
 * Upload a file to S3
 */
export async function uploadToS3(params: UploadFileParams): Promise<{ url: string; key: string }> {
    const { file, fileName, folder, orgId, simulationId, taskId, contentType } = params;

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
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType || (file instanceof File ? file.type : 'application/octet-stream'),
        // Note: ACL removed - bucket has ACLs disabled (AWS best practice)
    });

    await s3Client.send(command);

    // Construct public URL
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { url, key };
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
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
}

/**
 * Validate file size (in MB)
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
    const fileSizeMB = file.size / (1024 * 1024);
    return fileSizeMB <= maxSizeMB;
}

/**
 * File validation constants
 */
export const FILE_VALIDATION = {
    LOGO: {
        allowedTypes: ['image/png', 'image/svg+xml', 'image/jpeg'],
        maxSizeMB: 2,
    },
    BANNER: {
        allowedTypes: ['image/png', 'image/jpeg', 'image/jpg'],
        maxSizeMB: 5,
    },
    VIDEO: {
        allowedTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
        maxSizeMB: 500,
    },
    PDF: {
        allowedTypes: ['application/pdf'],
        maxSizeMB: 10,
    },
    DATASET: {
        allowedTypes: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        maxSizeMB: 50,
    },
    DOCUMENT: {
        allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        maxSizeMB: 10,
    },
};

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
