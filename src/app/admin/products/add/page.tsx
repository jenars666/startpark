'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '../../AdminLayout';
import { uploadProductImage, addProduct } from '@/lib/firebase/adminProductService';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';
import { Upload, X, Plus, ArrowLeft } from 'lucide-react';

const CATEGORIES = ['Casual Shirt', 'Formal Shirt', 'Vesthi', 'Group Shirt'];
const ALL_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
const BADGES = ['', 'Bestseller', 'New', 'Sale', 'Premium', 'Limited'];
const COLORS = ['Multi', 'Black', 'White', 'Navy', 'Grey', 'Blue', 'Beige', 'Brown', 'Green'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function isUploadTimeoutError(error: unknown) {
  if (error instanceof FirebaseError) {
    return error.code === 'storage/retry-limit-exceeded';
  }

  return error instanceof Error && error.message.toLowerCase().includes('upload timed out');
}

function getAddProductErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'permission-denied':
        return 'Permission denied. Ensure users/{uid}.role is set to admin in Firestore.';
      case 'unauthenticated':
      case 'storage/unauthenticated':
        return 'You are signed out. Please log in again as admin.';
      case 'storage/unauthorized':
        return 'Image upload is blocked by Firebase Storage rules.';
      case 'storage/object-not-found':
        return 'Firebase Storage bucket/path not found. Confirm the configured storage bucket in NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.';
      case 'storage/canceled':
        return 'Upload was canceled or timed out. Verify Firebase Storage bucket/rules and try again.';
      case 'storage/retry-limit-exceeded':
        return 'Image upload timed out. Check internet, verify Firebase Storage bucket/rules, and try again with a smaller image.';
      case 'storage/quota-exceeded':
        return 'Storage quota exceeded. Please free up storage or upgrade plan.';
      case 'storage/unknown':
        return 'Unknown Storage error. This often means Storage bucket is not provisioned or bucket name is incorrect.';
      default:
        return error.message || 'Failed to add product.';
    }
  }

  if (error instanceof Error) {
    if (isUploadTimeoutError(error)) {
      return 'Upload timed out. Check Firebase Storage bucket setup/rules and confirm the bucket name in .env.local.';
    }
    if (error.message.includes('Firestore not initialized')) {
      return 'Firestore is not initialized. Check NEXT_PUBLIC_FIREBASE_* environment variables.';
    }
    if (error.message.includes('Firebase Storage not initialized')) {
      return 'Firebase Storage is not initialized. Check NEXT_PUBLIC_FIREBASE_* environment variables.';
    }
    return error.message;
  }

  return 'Failed to add product. Please try again.';
}

export default function AddProductPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    category: 'Casual Shirt',
    tag: '',
    color: 'Multi',
    stock: '100',
    inStock: true,
    sizes: [] as string[],
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [hoverImage, setHoverImage] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState('');
  const [hoverPreview, setHoverPreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const mainRef = useRef<HTMLInputElement>(null);
  const hoverRef = useRef<HTMLInputElement>(null);

  function handleImageSelect(
    file: File,
    setFile: (f: File) => void,
    setPreview: (p: string) => void
  ) {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error('Image size must be 5MB or less.');
      return;
    }

    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function toggleSize(size: string) {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  }

  async function uploadImageWithSingleRetry(
    file: File,
    productId: string,
    slot: 'main' | 'hover',
    onProgress?: (percent: number) => void
  ) {
    try {
      return await uploadProductImage(file, productId, slot, onProgress);
    } catch (error) {
      if (isUploadTimeoutError(error)) {
        toast.dismiss();
        toast.loading('Upload timed out. Retrying once...');
        return uploadProductImage(file, productId, slot, onProgress);
      }

      throw error;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!mainImage) {
      toast.error('Please add a main product image');
      return;
    }
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    if (form.sizes.length === 0) {
      toast.error('Select at least one size');
      return;
    }

    if (!db) {
      toast.error('Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_* env values.');
      return;
    }

    if (!auth?.currentUser) {
      toast.error('Please log in as admin and try again.');
      return;
    }

    try {
      const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const userRole = userSnap.exists() ? userSnap.data().role : undefined;
      if (userRole !== 'admin') {
        toast.error('Your account is not admin in Firestore. Set users/{uid}.role to admin.');
        return;
      }
    } catch (roleError) {
      console.error(roleError);
      toast.error('Unable to verify admin role. Please try again.');
      return;
    }

    setSaving(true);

    try {
      const tempId = `prod-${Date.now()}`;

      toast.loading('Uploading images...');
      const imageUrl = await uploadImageWithSingleRetry(
        mainImage,
        tempId,
        'main',
        (p) => setUploadProgress(p)
      );

      let hoverImageUrl = '';
      if (hoverImage) {
        hoverImageUrl = await uploadImageWithSingleRetry(hoverImage, tempId, 'hover');
      }

      toast.dismiss();
      await addProduct({
        name: form.name,
        description: form.description,
        price: form.price,
        oldPrice: form.oldPrice || form.price,
        category: form.category,
        sizes: form.sizes,
        tag: form.tag,
        color: form.color,
        stock: Number(form.stock),
        inStock: form.inStock,
        img: imageUrl,
        hoverImg: hoverImageUrl,
      });

      toast.success('Product added successfully!');
      router.push('/admin');

    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error(getAddProductErrorMessage(err));
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} title="Add Product">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Add New Product</h1>
        <p className="admin-page-subtitle">Upload images and fill details to add to store</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-grid-3-1">
          {/* Images Section */}
          <div className="admin-grid-2 gap-1.25rem">
            <div className="admin-card admin-card-3d admin-image-upload-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Main Image <span className="admin-text-red">*</span></span>
              </div>
              <div className="admin-card-content-p">
                {mainPreview ? (
                  <div className="admin-image-preview-3d">
                    <img src={mainPreview} alt="preview" className="w-full aspect-[3/4] object-cover rounded-lg" />
                    <button type="button" onClick={() => { setMainImage(null); setMainPreview(''); }} className="admin-action-btn red admin-delete-overlay-btn">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => mainRef.current?.click()} className="admin-upload-zone">
                    <div className="admin-upload-icon-wrapper">
                      <Upload size={40} />
                    </div>
                    <p className="admin-upload-title">Click to upload</p>
                    <p className="admin-upload-subtitle">JPG, PNG up to 5MB</p>
                  </div>
                )}
                <input ref={mainRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageSelect(f, setMainImage, setMainPreview);
                }} />
              </div>
            </div>

            <div className="admin-card admin-card-3d admin-image-upload-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Hover Image <span className="admin-text-muted-xs">(optional)</span></span>
              </div>
              <div className="admin-card-content-p">
                {hoverPreview ? (
                  <div className="admin-image-preview-3d">
                    <img src={hoverPreview} alt="hover" className="w-full aspect-[3/4] object-cover rounded-lg" />
                    <button type="button" onClick={() => { setHoverImage(null); setHoverPreview(''); }} className="admin-action-btn red admin-delete-overlay-btn">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => hoverRef.current?.click()} className="admin-upload-zone admin-upload-zone-secondary">
                    <div className="admin-upload-icon-wrapper">
                      <Plus size={32} />
                    </div>
                    <p className="admin-upload-subtitle">Add hover view</p>
                  </div>
                )}
                <input ref={hoverRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageSelect(f, setHoverImage, setHoverPreview);
                }} />
              </div>
            </div>
          </div>

          {/* Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="admin-card admin-card-3d admin-upload-progress-card">
              <div className="admin-upload-progress-header">
                <Upload size={20} className="admin-upload-progress-icon" />
                <span className="admin-fw-800 admin-text-blue">Uploading images...</span>
                <span className="admin-upload-progress-percent">{uploadProgress}%</span>
              </div>
              <div className="admin-progress-3d mt-2">
                <div className="admin-progress-fill-3d" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="admin-card admin-card-3d admin-product-details-card">
            <div className="admin-card-header">
              <span className="admin-card-title">📝 Product Details</span>
            </div>
            <div className="admin-card-content-p admin-settings-row">
              {/* Name */}
              <div className="admin-settings-field">
                <label className="admin-settings-label">Product Name <span className="admin-text-red">*</span></label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="admin-settings-value admin-input-3d" placeholder="Premium Cotton Casual Shirt" required />
              </div>

              {/* Description */}
              <div className="admin-settings-field">
                <label className="admin-settings-label">Description</label>
                <textarea value={form.description} rows={3} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="admin-settings-value admin-input-3d resize-none" placeholder="Key features and details..." />
              </div>

              {/* Price Grid */}
              <div className="admin-grid-2 gap-1.25rem">
                <div className="admin-settings-field">
                  <label className="admin-settings-label">Sale Price (₹) <span className="admin-text-red">*</span></label>
                  <input value={form.price} type="number" min="0" onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="admin-settings-value admin-input-3d" placeholder="999" required />
                </div>
                <div className="admin-settings-field">
                  <label className="admin-settings-label">Original Price (₹)</label>
                  <input value={form.oldPrice} type="number" min="0" onChange={(e) => setForm((p) => ({ ...p, oldPrice: e.target.value }))} className="admin-settings-value admin-input-3d" placeholder="1499" />
                </div>
              </div>

              {/* Category etc Grid */}
              <div className="admin-grid-3 gap-1.25rem">
                <div className="admin-settings-field">
                  <label className="admin-settings-label">Category <span className="admin-text-red">*</span></label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="admin-settings-value admin-input-3d">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-settings-field">
                  <label className="admin-settings-label">Badge</label>
                  <select value={form.tag} onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))} className="admin-settings-value admin-input-3d">
                    {BADGES.map((b) => <option key={b} value={b}>{b || 'None'}</option>)}
                  </select>
                </div>
                <div className="admin-settings-field">
                  <label className="admin-settings-label">Color</label>
                  <select value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} className="admin-settings-value admin-input-3d">
                    {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Sizes */}
              <div className="admin-settings-field">
                <label className="admin-settings-label">Available Sizes <span className="admin-text-red">*</span></label>
                <div className="admin-size-selector-grid flex flex-wrap gap-3 mt-2">
                  {ALL_SIZES.map((size) => (
                    <button 
                      key={size} 
                      type="button" 
                      onClick={() => toggleSize(size)} 
                      className={`admin-size-toggle px-4 py-2 font-bold rounded-xl transition-all duration-300 shadow-md ${form.sizes.includes(size) ? 'bg-blue-600 text-white translate-y-[-2px] shadow-blue-500/30' : 'bg-white text-gray-700 hover:bg-blue-50 hover:translate-y-[-1px]'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div className="admin-grid-2 gap-1.25rem">
                <div className="admin-settings-field">
                  <label className="admin-settings-label">Stock Quantity</label>
                  <input value={form.stock} type="number" min="0" onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} className="admin-settings-value admin-input-3d" />
                </div>
                <div className="admin-settings-field">
                  <label className="flex items-center justify-center h-full gap-3 mt-4 cursor-pointer admin-text-muted-sm bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={form.inStock} 
                        onChange={(e) => setForm({ ...form, inStock: e.target.checked })} 
                        className="peer sr-only"
                      />
                      <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-6 peer-checked:after:border-white shadow-inner"></div>
                    </div>
                    <span className="font-semibold text-gray-800 tracking-wide">In Stock (Track Quantity)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-submit-section">
          <button type="submit" disabled={saving} className={`admin-submit-btn-modern ${saving ? 'admin-btn-loading' : ''}`}>
            {saving ? (
              <>
                <span className="admin-spinner"></span>
                <span>Adding Product{uploadProgress > 0 ? ` (${uploadProgress}%)` : ''}...</span>
              </>
            ) : (
              <>
                <span className="admin-btn-icon">✨</span>
                <span>Add Product to Store</span>
                <span className="admin-btn-arrow">→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
