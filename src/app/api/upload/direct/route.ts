import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_CONFIG, handleR2Error } from '@/src/lib/r2-client';
import { randomUUID } from 'crypto';

type UploadPurpose = 'editor-image' | 'thumbnail-image' | 'thumbnail-model';

const ALLOWED_MODEL_MIME_TYPES = [
  'model/gltf-binary',
  'model/gltf+json',
  'application/octet-stream',
  'application/gltf-buffer',
  'application/gltf+json',
];

const ALLOWED_MODEL_EXTENSIONS = ['glb', 'gltf'];

export async function POST(request: NextRequest) {
  try {
    // Verify admin secret if configured
    const adminSecret = process.env.ADMIN_SECRET;
    if (adminSecret) {
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (token !== adminSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const uploaderId = 'admin';

    const formData = await request.formData();
    const file = formData.get('file');
    const slug = String(formData.get('slug') || '').trim();
    const purpose = String(formData.get('purpose') || 'editor-image') as UploadPurpose;
    const documentId = formData.get('documentId')
      ? String(formData.get('documentId'))
      : undefined;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    const extension = file.name.includes('.')
      ? file.name.split('.').pop()?.toLowerCase() || ''
      : '';

    if (purpose === 'thumbnail-model') {
      const modelMimeAllowed = ALLOWED_MODEL_MIME_TYPES.includes(file.type);
      const modelExtAllowed = ALLOWED_MODEL_EXTENSIONS.includes(extension);
      if (!modelMimeAllowed && !modelExtAllowed) {
        return NextResponse.json({ error: 'Invalid model file type' }, { status: 400 });
      }
    } else if (!R2_CONFIG.allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid image file type' }, { status: 400 });
    }

    if (file.size > R2_CONFIG.maxFileSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    let fileKey = `${slug}/images/${Date.now()}-${randomUUID().slice(0, 8)}.webp`;
    if (purpose === 'thumbnail-image') {
      const safeExt = extension || 'webp';
      fileKey = `${slug}/thumbnail.${safeExt}`;
    }
    if (purpose === 'thumbnail-model') {
      const safeExt = ALLOWED_MODEL_EXTENSIONS.includes(extension) ? extension : 'glb';
      fileKey = `${slug}/model.${safeExt}`;
    }

    const body = new Uint8Array(await file.arrayBuffer());

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_CONFIG.bucketName,
        Key: fileKey,
        Body: body,
        ContentType: file.type,
        ContentLength: file.size,
        Metadata: {
          userId: uploaderId,
          originalFileName: file.name,
          documentType: purpose,
          slug,
          uploadedAt: new Date().toISOString(),
        },
      })
    );

    const fileUrl = R2_CONFIG.publicUrl
      ? `${R2_CONFIG.publicUrl}/${fileKey}`
      : fileKey;

    return NextResponse.json({
      success: true,
      fileKey,
      filePath: fileKey,
      fileUrl,
      purpose,
      documentId,
    });
  } catch (error) {
    console.error('Direct upload failed:', error);
    const message = handleR2Error(error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
