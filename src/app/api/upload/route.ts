import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, R2_CONFIG } from '@/src/lib/r2-client';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const hasClerkKeys = Boolean(
      process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    );

    let uploaderId = 'local-dev';
    if (hasClerkKeys) {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      uploaderId = userId;
    }
    
    // Parse request body
    const { fileName, fileType, fileSize, documentType } = await request.json();
    
    // Validate file type
    if (!R2_CONFIG.allowedMimeTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }
    
    // Validate file size
    if (fileSize > R2_CONFIG.maxFileSize) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      );
    }
    
    // Generate unique file key
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const fileId = nanoid(10);
    const fileExtension = fileName.split('.').pop();
    const fileKey = `${uploaderId}/${timestamp}/${documentType}_${fileId}.${fileExtension}`;
    
    // Create presigned URL for PUT operation
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: fileKey,
      ContentType: fileType,
      ContentLength: fileSize,
      Metadata: {
        userId: uploaderId,
        originalFileName: fileName,
        documentType,
        uploadedAt: new Date().toISOString(),
      },
    });
    
    const presignedUrl = await getSignedUrl(r2Client, command, {
      expiresIn: R2_CONFIG.presignedUrlExpiry,
    });

    const fileUrl = R2_CONFIG.publicUrl
      ? `${R2_CONFIG.publicUrl}/${fileKey}`
      : null;
    
    return NextResponse.json({
      presignedUrl,
      fileKey,
      filePath: fileKey,
      fileUrl,
      expiresAt: Date.now() + R2_CONFIG.presignedUrlExpiry * 1000,
    });
    
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}