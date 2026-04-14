import express from 'express';
import { z } from 'zod';
import { Product } from '../models/Product.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { emitProductUpdate } from '../config/socket.js';

const router = express.Router();

const createProductSchema = z.object({
  name: z.string().trim().min(1).max(180),
  description: z.string().trim().max(4000).optional().default(''),
  category: z.string().trim().min(1),
  price: z.coerce.number().min(0),
  oldPrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0).optional().default(0),
  status: z.enum(['active', 'draft', 'archived']).optional().default('active'),
  imageUrl: z.string().trim().url(),
  imageKey: z.string().trim().min(1),
  color: z.string().trim().optional().default('Multi'),
  tag: z.string().trim().optional().default(''),
  sizes: z.array(z.string().trim()).optional().default([]),
});

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(String(req.query.page || '1'), 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit || '50'), 10) || 50));
    const skip = (page - 1) * limit;

    const category = String(req.query.category || '').trim();
    const search = String(req.query.search || '').trim();
    const status = String(req.query.status || 'active').trim();

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return res.json({
      ok: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found.',
      });
    }

    return res.json({
      ok: true,
      data: product,
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const payload = createProductSchema.parse(req.body);
    const product = await Product.create(payload);
    
    emitProductUpdate('product:created', product);

    return res.status(201).json({
      ok: true,
      message: 'Product created successfully.',
      data: product,
    });
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const payload = createProductSchema.partial().parse(req.body);
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ ok: false, message: 'Product not found' });
    }

    emitProductUpdate('product:updated', product);

    return res.json({
      ok: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ ok: false, message: 'Product not found' });
    }

    emitProductUpdate('product:deleted', { id: product._id });

    return res.json({
      ok: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
