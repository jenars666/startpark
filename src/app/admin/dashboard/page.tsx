'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useProductUpdates } from '@/hooks/useSocket';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'casual-shirt',
    price: '',
    oldPrice: '',
    stock: '',
    color: 'Multi',
    tag: '',
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    checkAuth();
    loadProducts();
  }, []);

  useProductUpdates((event, data) => {
    if (event === 'created') {
      setProducts(prev => [data, ...prev]);
      toast.success('New product added!');
    } else if (event === 'updated') {
      setProducts(prev => prev.map(p => p._id === data._id ? data : p));
      toast.success('Product updated!');
    } else if (event === 'deleted') {
      setProducts(prev => prev.filter(p => p._id !== data.id));
      toast.success('Product deleted!');
    }
  });

  async function checkAuth() {
    try {
      const data = await apiClient.verifyToken();
      if (data.user.role !== 'admin') {
        toast.error('Admin access required');
        window.location.href = '/';
        return;
      }
      setUser(data.user);
    } catch (error) {
      toast.error('Please login first');
      window.location.href = '/';
    }
  }

  async function loadProducts() {
    try {
      const data = await apiClient.getProducts({ limit: 100 });
      setProducts(data.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    setUploading(true);
    try {
      const { publicUrl, key } = await apiClient.uploadImage(imageFile, setUploadProgress);

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        stock: parseInt(formData.stock) || 0,
        imageUrl: publicUrl,
        imageKey: key,
      };

      await apiClient.createProduct(productData);
      toast.success('Product created successfully!');
      
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        category: 'casual-shirt',
        price: '',
        oldPrice: '',
        stock: '',
        color: 'Multi',
        tag: '',
      });
      setImageFile(null);
      setUploadProgress(0);
    } catch (error) {
      toast.error(error.message || 'Failed to create product');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    
    try {
      await apiClient.deleteProduct(id);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user && <span>Welcome, {user.name}</span>}
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f5f5f5', padding: '2rem', marginBottom: '2rem', border: '3px solid #000' }}>
          <h2>Add New Product</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label>Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '0.5rem', border: '2px solid #000' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: '0.5rem', border: '2px solid #000' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label>Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '2px solid #000' }}>
                <option value="casual-shirt">Casual Shirt</option>
                <option value="formal-shirt">Formal Shirt</option>
                <option value="vesthi-shirt">Vesthi Shirt</option>
                <option value="group-shirt">Group Shirt</option>
              </select>
            </div>

            <div>
              <label>Price *</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required style={{ width: '100%', padding: '0.5rem', border: '2px solid #000' }} />
            </div>

            <div>
              <label>Old Price</label>
              <input type="number" value={formData.oldPrice} onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '2px solid #000' }} />
            </div>

            <div>
              <label>Stock</label>
              <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '2px solid #000' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Image *</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required style={{ width: '100%', padding: '0.5rem', border: '2px solid #000' }} />
            {uploading && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ background: '#ddd', height: '20px', border: '2px solid #000' }}>
                  <div style={{ background: '#4CAF50', height: '100%', width: `${uploadProgress}%`, transition: 'width 0.3s' }} />
                </div>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
            )}
          </div>

          <button type="submit" disabled={uploading} style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
            {uploading ? 'Uploading...' : 'Create Product'}
          </button>
        </form>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h2>Products ({products.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {products.map(product => (
            <div key={product._id} style={{ border: '3px solid #000', padding: '1rem', background: '#fff' }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <h3 style={{ fontSize: '1rem', margin: '0.5rem 0' }}>{product.name}</h3>
              <p style={{ fontWeight: 'bold' }}>₹{product.price}</p>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>{product.category}</p>
              <p style={{ fontSize: '0.875rem' }}>Stock: {product.stock}</p>
              <button onClick={() => handleDelete(product._id)} style={{ background: '#f44336', color: '#fff', border: '2px solid #000', padding: '0.5rem 1rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
