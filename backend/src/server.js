import http from 'node:http';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { ZodError } from 'zod';
import { env, assertEnv } from './config/env.js';
import { connectMongo } from './config/mongo.js';
import { initializeSocket } from './config/socket.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigins,
    credentials: false,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { ok: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { ok: false, message: 'Too many login attempts, please try again later.' },
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'Products backend is healthy.',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/products', productRoutes);
app.use('/api', uploadRoutes);
app.use('/api/auth', authRoutes);

app.use((error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid request payload.',
      issues: error.issues,
    });
  }

  if (error?.name === 'CastError') {
    return res.status(400).json({
      ok: false,
      message: 'Invalid resource id.',
    });
  }

  const statusCode = error?.statusCode || 500;
  const message = error?.message || 'Internal server error';

  console.error(error);

  return res.status(statusCode).json({
    ok: false,
    message,
  });
});

async function start() {
  assertEnv();
  await connectMongo();

  const server = http.createServer(app);
  initializeSocket(server);

  server.listen(env.port, () => {
    console.log(`Products backend running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start products backend', error);
  process.exit(1);
});
