import { useState, useCallback } from 'react';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileKey?: string;
  error?: string;
  documentId?: string;
}

interface UploadState {
  isUploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
  result: UploadResult | null;
}

export function useFileUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: null,
    error: null,
    result: null,
  });
  
  const uploadFile = useCallback(async (
    file: File,
    slug: string,
    documentId?: string,
    adminSecret?: string
  ): Promise<UploadResult> => {
    try {
      // Reset state
      setUploadState({
        isUploading: true,
        progress: null,
        error: null,
        result: null,
      });
      
      const normalizedSlug = slug.trim();
      if (!normalizedSlug) {
        throw new Error('Slug is required before uploading images');
      }

      const webpFile = await convertImageToWebp(file);

      const result = await uploadToApi(webpFile, normalizedSlug, documentId, adminSecret, (progress) => {
        setUploadState(prev => ({
          ...prev,
          progress,
        }));
      });
      
      setUploadState({
        isUploading: false,
        progress: null,
        error: null,
        result,
      });
      
      return result;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setUploadState({
        isUploading: false,
        progress: null,
        error: errorMessage,
        result: null,
      });
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);
  
  return {
    uploadState,
    uploadFile,
  };
}

// Helper function to upload file to API route using FormData.
async function uploadToApi(
  file: File,
  slug: string,
  documentId: string | undefined,
  adminSecret: string | undefined,
  onProgress: (progress: UploadProgress) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('file', file);
    formData.append('slug', slug);
    if (documentId) {
      formData.append('documentId', documentId);
    }
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = {
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        };
        onProgress(progress);
      }
    });
    
    xhr.addEventListener('load', () => {
      let responseData: {
        error?: string;
        fileUrl?: string;
        fileKey?: string;
        documentId?: string;
      } = {};

      try {
        responseData = JSON.parse(xhr.responseText);
      } catch {
        responseData = {};
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({
          success: true,
          fileUrl: responseData.fileUrl,
          fileKey: responseData.fileKey,
          documentId: responseData.documentId || documentId,
        });
      } else {
        reject(
          new Error(responseData.error || `Upload failed with status: ${xhr.status}`)
        );
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network or CORS error'));
    });
    
    xhr.open('POST', '/api/upload/direct');
    if (adminSecret) {
      xhr.setRequestHeader('Authorization', `Bearer ${adminSecret}`);
    }
    xhr.send(formData);
  });
}

async function convertImageToWebp(file: File): Promise<File> {
  if (file.type === 'image/webp') {
    return new File([file], 'picture.webp', { type: 'image/webp' });
  }

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to process image in browser');
  }

  context.drawImage(bitmap, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', 0.92);
  });

  if (!blob) {
    throw new Error('Unable to convert image to webp');
  }

  return new File([blob], 'picture.webp', { type: 'image/webp' });
}