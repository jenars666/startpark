import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 4000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    oldPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    imageKey: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: 'Multi',
      trim: true,
    },
    tag: {
      type: String,
      default: '',
      trim: true,
    },
    sizes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ category: 1, status: 1, createdAt: -1 });

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
