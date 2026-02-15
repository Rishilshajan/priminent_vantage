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
