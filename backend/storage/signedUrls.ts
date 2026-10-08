/**
 * WARDROBE AI - Secure Object Storage & Direct-to-Storage Signed URLs
 * Enforces server-side generated object keys, private access, and short-lived upload URLs.
 */

import crypto from 'crypto';

export interface PresignedUploadResponse {
  uploadUrl: string;
  storageKey: string;
  expiresInSeconds: number;
  headers: Record<string, string>;
}

export interface PresignedDownloadResponse {
  downloadUrl: string;
  expiresInSeconds: number;
}

// Disallowed extensions / malicious file checks
const ALLOWED_MIME_EXTENSIONS: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

/**
 * Validates file upload metadata and prevents path traversal or unsafe file types.
 */
export function validateUploadMetadata(filename: string, mimeType: string, fileSizeBytes: number) {
  if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size ${fileSizeBytes} bytes exceeds maximum allowed limit of ${MAX_FILE_SIZE_BYTES} bytes`);
  }

  const allowedExts = ALLOWED_MIME_EXTENSIONS[mimeType];
  if (!allowedExts) {
    throw new Error(`MIME type '${mimeType}' is not supported. Supported: image/jpeg, image/png, image/webp`);
  }

  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  if (!allowedExts.includes(ext)) {
    throw new Error(`File extension '${ext}' does not match claimed MIME type '${mimeType}'`);
  }
}

/**
 * Generates an authorized, short-lived presigned upload URL for direct-to-storage upload.
 * Generates server-side random UUID key: never uses user-supplied filename.
 */
export async function generatePresignedUploadUrl(
  userId: string,
  filename: string,
  mimeType: string,
  fileSizeBytes: number
): Promise<PresignedUploadResponse> {
  validateUploadMetadata(filename, mimeType, fileSizeBytes);

  // Server-generated safe random key: users/{userId}/wardrobe/{uuid}.{ext}
  const fileExt = mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/png' ? 'png' : 'webp';
  const objectId = crypto.randomUUID();
  const storageKey = `users/${userId}/wardrobe/${objectId}.${fileExt}`;

  // Short expiration (15 minutes = 900 seconds)
  const expiresInSeconds = 900;

  // In production with AWS S3 or GCS:
  // Using S3Client.getSignedUrl(new PutObjectCommand({ Bucket, Key: storageKey, ContentType: mimeType }))
  // Or Google Cloud Storage getSignedUrl({ action: 'write', expires: Date.now() + 900000 })
  const mockStorageEndpoint = process.env.STORAGE_ENDPOINT || 'https://storage.wardrobe-ai.internal';
  const uploadUrl = `${mockStorageEndpoint}/upload/${storageKey}?signature=${crypto.randomBytes(16).toString('hex')}&expires=${Date.now() + expiresInSeconds * 1000}`;

  return {
    uploadUrl,
    storageKey,
    expiresInSeconds,
    headers: {
      'Content-Type': mimeType,
      'x-amz-server-side-encryption': 'AES256',
    },
  };
}

/**
 * Generates a short-lived download URL for private images.
 * Never exposes raw private storage buckets to public internet.
 */
export async function generatePresignedDownloadUrl(
  userId: string,
  storageKey: string
): Promise<PresignedDownloadResponse> {
  // Ensure user owns this storage path
  if (!storageKey.startsWith(`users/${userId}/`)) {
    throw new Error('Forbidden: Storage key does not belong to authorized user');
  }

  const expiresInSeconds = 3600; // 1 hour
  const mockStorageEndpoint = process.env.STORAGE_ENDPOINT || 'https://storage.wardrobe-ai.internal';
  const downloadUrl = `${mockStorageEndpoint}/read/${storageKey}?token=${crypto.randomBytes(16).toString('hex')}`;

  return {
    downloadUrl,
    expiresInSeconds,
  };
}
