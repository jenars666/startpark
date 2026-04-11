import express from 'express';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';
import { r2Client, buildPublicR2Url } from '../config/r2.js';
import { env } from '../config/env.js';
import { requireAdminSecret } from '../middleware/adminSecret.js';

const router = express.Router();

const signUploadSchema = z.object({
  fileName: z.string().trim().min(1).max(300),
  contentType: z.string().trim().min(1),
});

function normalizeExtension(fileName, contentType) {
  const ext = path.extname(fileName).replace('.', '').toLowerCase();
  if (ext) return ext;

  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';

  return 'bin';
}

router.post('/products/upload-sign-url', requireAdminSecret, async (req, res, next) => {
  try {
    const payload = signUploadSchema.parse(req.body);

    if (!payload.contentType.startsWith('image/')) {
      return res.status(400).json({
        ok: false,
        message: 'Only image uploads are allowed.',
      });
    }

    const ext = normalizeExtension(payload.fileName, payload.contentType);
    const objectKey = `products/${Date.now()}-${randomBytes(8).toString('hex')}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: env.r2.bucket,
      Key: objectKey,
      ContentType: payload.contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, {
      expiresIn: env.r2.signedUrlExpiresSeconds,
    });

    return res.json({
      ok: true,
      data: {
        uploadUrl,
        publicUrl: buildPublicR2Url(objectKey),
        objectKey,
        expiresInSeconds: env.r2.signedUrlExpiresSeconds,
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
