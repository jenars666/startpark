import dotenv from 'dotenv';

dotenv.config();

function parseCorsOrigins(value) {
  if (!value) return ['http://localhost:3000'];
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value || '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

export const env = {
  port: parsePositiveInt(process.env.PORT, 5001),
  mongoUri: process.env.MONGODB_URI || '',
  adminPanelSecret: process.env.ADMIN_PANEL_SECRET || '',
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
  jwtSecret: process.env.JWT_SECRET || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    bucket: process.env.R2_BUCKET || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL || '',
    signedUrlExpiresSeconds: parsePositiveInt(
      process.env.R2_SIGNED_URL_EXPIRES_SECONDS,
      300
    ),
  },
};

export function assertEnv() {
  const missing = [];

  if (!env.mongoUri) missing.push('MONGODB_URI');
  if (!env.jwtSecret) missing.push('JWT_SECRET');
  if (!env.googleClientId) missing.push('GOOGLE_CLIENT_ID');
  if (!env.r2.accountId) missing.push('R2_ACCOUNT_ID');
  if (!env.r2.bucket) missing.push('R2_BUCKET');
  if (!env.r2.accessKeyId) missing.push('R2_ACCESS_KEY_ID');
  if (!env.r2.secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY');

  if (missing.length > 0) {
    throw new Error(`Missing required environment values: ${missing.join(', ')}`);
  }
}
