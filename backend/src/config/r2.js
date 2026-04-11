import { S3Client } from '@aws-sdk/client-s3';
import { env } from './env.js';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.r2.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.r2.accessKeyId,
    secretAccessKey: env.r2.secretAccessKey,
  },
});

export function buildPublicR2Url(objectKey) {
  if (env.r2.publicBaseUrl) {
    return `${env.r2.publicBaseUrl.replace(/\/$/, '')}/${objectKey}`;
  }

  return `https://${env.r2.bucket}.${env.r2.accountId}.r2.cloudflarestorage.com/${objectKey}`;
}
