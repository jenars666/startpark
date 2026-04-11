import { timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';

function safeCompare(a, b) {
  const aBuffer = Buffer.from(a || '', 'utf8');
  const bBuffer = Buffer.from(b || '', 'utf8');

  if (aBuffer.length !== bBuffer.length) return false;

  return timingSafeEqual(aBuffer, bBuffer);
}

export function requireAdminSecret(req, res, next) {
  const provided = req.header('x-admin-secret') || '';

  if (!provided || !safeCompare(provided, env.adminPanelSecret)) {
    return res.status(401).json({
      ok: false,
      message: 'Unauthorized admin request.',
    });
  }

  return next();
}
