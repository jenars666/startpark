import http from 'node:http';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { ZodError } from 'zod';
import { env, assertEnv } from './config/env.js';
import { connectMongo } from './config/mongo.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

app.use(
  cors({
    origin: env.corsOrigins,
    credentials: false,
  })
);
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

  server.listen(env.port, () => {
    console.log(`Products backend running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start products backend', error);
  process.exit(1);
});
