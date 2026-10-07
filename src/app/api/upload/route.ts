import { NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { apiSuccess, apiError } from '@/lib/server/utils/response';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // 1. Multipart Form Data Upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return apiError('No file provided in form data', 400);
      }

      // MIME type validation
      const mime = file.type.toLowerCase();
      if (!ALLOWED_MIME_TYPES.has(mime)) {
        return apiError(
          'Invalid file format. Supported formats are JPG, JPEG, PNG, and WEBP.',
          400
        );
      }

      // Size validation
      if (file.size > MAX_FILE_SIZE) {
        return apiError('File size exceeds the 5 MB limit.', 400);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = mime.split('/')[1] === 'jpeg' ? 'jpg' : mime.split('/')[1];
      const filename = `event-${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;

      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'events');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);

        const publicUrl = `/uploads/events/${filename}`;
        return apiSuccess({
          url: publicUrl,
          filename: file.name,
          storedName: filename,
          size: file.size,
          mimeType: mime,
        });
      } catch (fsErr) {
        // Fallback for read-only environments (e.g. serverless tmp or data URL)
        const base64Data = buffer.toString('base64');
        const dataUrl = `data:${mime};base64,${base64Data}`;
        return apiSuccess({
          url: dataUrl,
          filename: file.name,
          storedName: filename,
          size: file.size,
          mimeType: mime,
        });
      }
    }

    // 2. Base64 JSON payload upload
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { image, filename: originalFilename } = body;

      if (!image || typeof image !== 'string') {
        return apiError('No image provided in request body', 400);
      }

      const match = image.match(/^data:(image\/[a-zA-Z0-9.+_-]+);base64,(.+)$/);
      if (!match) {
        return apiError('Invalid data URL image format', 400);
      }

      const mime = match[1].toLowerCase();
      if (!ALLOWED_MIME_TYPES.has(mime)) {
        return apiError(
          'Invalid file format. Supported formats are JPG, JPEG, PNG, and WEBP.',
          400
        );
      }

      const buffer = Buffer.from(match[2], 'base64');
      if (buffer.length > MAX_FILE_SIZE) {
        return apiError('File size exceeds the 5 MB limit.', 400);
      }

      const ext = mime.split('/')[1] === 'jpeg' ? 'jpg' : mime.split('/')[1];
      const filename = `event-${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;

      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'events');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);

        const publicUrl = `/uploads/events/${filename}`;
        return apiSuccess({
          url: publicUrl,
          filename: originalFilename || filename,
          storedName: filename,
          size: buffer.length,
          mimeType: mime,
        });
      } catch (fsErr) {
        return apiSuccess({
          url: image,
          filename: originalFilename || filename,
          storedName: filename,
          size: buffer.length,
          mimeType: mime,
        });
      }
    }

    return apiError('Unsupported Content-Type', 415);
  } catch (error: any) {
    return apiError(error.message || 'Image upload failed', 500);
  }
}
