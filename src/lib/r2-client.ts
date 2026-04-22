import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3';

const getR2Endpoint = () => {
  const customEndpoint = process.env.R2_ENDPOINT;
  if (customEndpoint) {
    return customEndpoint;
  }

  const accountId = (process.env.R2_ACCOUNT_ID || '').trim();
  return `https://${accountId}.r2.cloudflarestorage.com`;
};

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: getR2Endpoint(),
  credentials: {
    accessKeyId: (process.env.R2_ACCESS_KEY_ID || '').trim(),
    secretAccessKey: (process.env.R2_SECRET_ACCESS_KEY || '').trim(),
  },
});

export const R2_CONFIG = {
  bucketName: process.env.R2_BUCKET_NAME!,
  publicUrl: process.env.R2_PUBLIC_URL,
  maxFileSize: 10 * 1024 * 1024,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  presignedUrlExpiry: 300,
};

// Optional utility to test connection
export async function testR2Connection(): Promise<boolean> {
  try {
    await r2Client.send(new HeadBucketCommand({
      Bucket: R2_CONFIG.bucketName,
    }));
    return true;
  } catch (error) {
    console.error('R2 connection test failed:', error);
    return false;
  }
}

// Convert R2 SDK errors into user-friendly messages
export function handleR2Error(error: any): string {
  if (error.name === 'NoSuchBucket') return 'Bucket does not exist.';
  if (error.name === 'InvalidAccessKeyId') return 'Invalid access key.';
  if (error.name === 'SignatureDoesNotMatch') return 'Authentication failed.';
  if (error.name === 'AccessDenied') return 'Access denied. Check your token permissions.';
  return `R2 operation failed: ${error.message || 'Unknown error'}`;
}