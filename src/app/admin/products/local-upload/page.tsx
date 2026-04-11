'use client';

import { useRef, useState } from 'react';
import { AdminLayout } from '../../AdminLayout';
import {
  createProductViaApi,
  getProductUploadSignedUrl,
  isProductsApiEnabled,
  uploadFileToSignedUrl,
} from '@/lib/productsApi';
import toast from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import './local-upload.css';

const CATEGORIES = ['Casual Shirt', 'Formal Shirt', 'Vesthi', 'Group Shirt'];
const COLORS = ['Multi', 'Black', 'White', 'Navy', 'Grey', 'Blue', 'Beige', 'Brown', 'Green'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function splitSizes(csv: string) {
  return csv
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export default function LocalUploadProductPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [saving, setSaving] = useState(false);

  const [adminSecret, setAdminSecret] = useState('');
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Casual Shirt',
    price: '',
    oldPrice: '',
    stock: '100',
    color: 'Multi',
    tag: '',
    sizeCsv: 'S,M,L,XL',
    status: 'active',
  });

  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const apiModeEnabled = isProductsApiEnabled();

  function handleImageSelect(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error('Image size must be 5MB or less.');
      return;
    }

    setMainImage(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setMainPreview((event.target?.result as string) || '');
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!apiModeEnabled) {
      toast.error('Set NEXT_PUBLIC_PRODUCTS_API_BASE_URL to enable this local upload flow.');
      return;
    }

    if (!adminSecret.trim()) {
      toast.error('Admin secret is required.');
      return;
    }

    if (!mainImage) {
      toast.error('Main image is required.');
      return;
    }

    if (!form.name.trim() || !form.price.trim()) {
      toast.error('Name and price are required.');
      return;
    }

    setSaving(true);

    try {
      toast.loading('Uploading image to R2...');

      const signedUpload = await getProductUploadSignedUrl({
        fileName: mainImage.name,
        contentType: mainImage.type,
        adminSecret: adminSecret.trim(),
      });

      await uploadFileToSignedUrl(signedUpload.uploadUrl, mainImage);

      toast.dismiss();
      toast.loading('Saving product to MongoDB...');

      await createProductViaApi({
        adminSecret: adminSecret.trim(),
        product: {
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          price: Number(form.price),
          oldPrice: form.oldPrice.trim() ? Number(form.oldPrice) : null,
          stock: Number(form.stock),
          color: form.color,
          tag: form.tag.trim(),
          sizes: splitSizes(form.sizeCsv),
          status: form.status,
          imageUrl: signedUpload.publicUrl,
          imageKey: signedUpload.objectKey,
        },
      });

      toast.dismiss();
      toast.success('Product uploaded successfully.');

      setForm((prev) => ({
        ...prev,
        name: '',
        description: '',
        price: '',
        oldPrice: '',
        tag: '',
      }));
      setMainImage(null);
      setMainPreview('');
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Failed to upload product.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} title="Local Product Upload">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Local Product Upload (MongoDB + R2)</h1>
        <p className="admin-page-subtitle">
          Use this flow for local-first product entry and then deploy after review.
        </p>
      </div>

      {!apiModeEnabled && (
        <div className="admin-card local-upload-alert-card">
          <div className="admin-card-content-p">
            <strong>API mode is disabled.</strong>
            <p>
              Add NEXT_PUBLIC_PRODUCTS_API_BASE_URL to your frontend env and restart dev server.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-grid-2 gap-1.25rem">
          <div className="admin-card admin-card-3d">
            <div className="admin-card-header">
              <span className="admin-card-title">Admin Access</span>
            </div>
            <div className="admin-card-content-p admin-settings-row">
              <div className="admin-settings-field">
                <label className="admin-settings-label">Admin Secret</label>
                <input
                  type="password"
                  value={adminSecret}
                  onChange={(event) => setAdminSecret(event.target.value)}
                  className="admin-settings-value admin-input-3d"
                  placeholder="Enter x-admin-secret"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <div className="admin-card admin-card-3d">
            <div className="admin-card-header">
              <span className="admin-card-title">Main Image</span>
            </div>
            <div className="admin-card-content-p">
              {mainPreview ? (
                <div className="admin-image-preview-3d">
                  <img src={mainPreview} alt="preview" className="w-full aspect-[3/4] object-cover rounded-lg" />
                  <button
                    type="button"
                    title="Remove selected image"
                    onClick={() => {
                      setMainImage(null);
                      setMainPreview('');
                    }}
                    className="admin-action-btn red admin-delete-overlay-btn"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => mainImageInputRef.current?.click()}
                  className="admin-upload-zone"
                >
                  <div className="admin-upload-icon-wrapper">
                    <Upload size={40} />
                  </div>
                  <p className="admin-upload-title">Click to upload</p>
                  <p className="admin-upload-subtitle">JPG, PNG, WEBP up to 5MB</p>
                </div>
              )}
              <input
                ref={mainImageInputRef}
                type="file"
                title="Choose product image"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    handleImageSelect(file);
                  }
                }}
              />
            </div>
          </div>

          <div className="admin-card admin-card-3d local-upload-full-width">
            <div className="admin-card-header">
              <span className="admin-card-title">Product Details</span>
            </div>
            <div className="admin-card-content-p admin-settings-row">
              <div className="admin-grid-2 gap-1.25rem">
                <div className="admin-settings-field">
                  <label className="admin-settings-label">Name</label>
                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="admin-settings-value admin-input-3d"
                    placeholder="Premium Cotton Shirt"
                    required
                  />
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label">Category</label>
                  <select
                    title="Select product category"
                    value={form.category}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, category: event.target.value }))
                    }
                    className="admin-settings-value admin-input-3d"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label">Price (INR)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, price: event.target.value }))
                    }
                    className="admin-settings-value admin-input-3d"
                    placeholder="999"
                    required
                  />
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label">Old Price (optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.oldPrice}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, oldPrice: event.target.value }))
                    }
                    className="admin-settings-value admin-input-3d"
                    placeholder="1499"
                  />
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label">Stock</label>
                  <input
                    type="number"
                    title="Stock quantity"
                    min="0"
                    value={form.stock}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, stock: event.target.value }))
                    }
                    className="admin-settings-value admin-input-3d"
                  />
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label">Color</label>
                  <select
                    title="Select product color"
                    value={form.color}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, color: event.target.value }))
                    }
                    className="admin-settings-value admin-input-3d"
                  >
                    {COLORS.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label">Tag</label>
                  <input
                    value={form.tag}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, tag: event.target.value }))
                    }
                    className="admin-settings-value admin-input-3d"
                    placeholder="Bestseller"
                  />
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label">Sizes (comma separated)</label>
                  <input
                    value={form.sizeCsv}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, sizeCsv: event.target.value }))
                    }
                    className="admin-settings-value admin-input-3d"
                    placeholder="S,M,L,XL"
                  />
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label">Status</label>
                  <select
                    title="Select product status"
                    value={form.status}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, status: event.target.value }))
                    }
                    className="admin-settings-value admin-input-3d"
                  >
                    <option value="active">active</option>
                    <option value="draft">draft</option>
                    <option value="archived">archived</option>
                  </select>
                </div>
              </div>

              <div className="admin-settings-field">
                <label className="admin-settings-label">Description</label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  rows={4}
                  className="admin-settings-value admin-input-3d resize-none"
                  placeholder="Fabric, fit, wash instructions, etc."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-submit-section">
          <button
            type="submit"
            disabled={saving || !apiModeEnabled}
            className={`admin-submit-btn-modern ${saving ? 'admin-btn-loading' : ''}`}
          >
            {saving ? 'Uploading Product...' : 'Upload Product'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
