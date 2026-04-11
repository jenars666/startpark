'use client';

import { useState, useEffect } from 'react';
import { subscribeToAllOrders } from '@/lib/firebase/orderService';
import { subscribeToAllProducts } from '@/lib/firebase/productService';
import { subscribeToWhatsAppEnquiries, subscribeToGroupOrders, subscribeToStockHistory, subscribeToCoupons, subscribeToFestivals, subscribeToStaff, subscribeToTopProducts, subscribeToReviews, subscribeToCustomers } from '@/lib/firebase/adminService';
import { updateOrderStatus, updateProduct as updateProductDoc, deleteProduct as deleteProductDoc } from '@/lib/firebase/adminCrudService';
import toast from 'react-hot-toast';

import { Eye } from 'lucide-react';
import {
  TrendingUp,
  Package, IndianRupee, ArrowUpRight, Plus,
  MessageSquare, Pencil, Trash2, Star,
  Download, Filter, ChevronRight,
  Database, MessageCircle, Briefcase,
  Calendar, Shield, Phone, ExternalLink,
  History, CheckCircle2, AlertCircle, Clock, FileText, Users
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';

/* ── Mock Data ── */






















/* ── Helper ── */
function StatusBadge({ status }: { status: string }) {
  return <span className={`admin-status ${status}`}>{status.replace('_', ' ')}</span>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="admin-flex-gap-2">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} fill={i <= rating ? '#f59e0b' : 'none'} color={i <= rating ? '#f59e0b' : '#ddd'} />
      ))}
    </div>
  );
}

/* ── Tab Views ── */
function DashboardTab() {

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [allEnquiries, setAllEnquiries] = useState<any[]>([]);
  useEffect(() => {
    const unsubR = subscribeToAllOrders(setRecentOrders);
    const unsubT = subscribeToTopProducts(setTopProducts);
    const unsubS = subscribeToStockHistory(setStockHistory);
    const unsubP = subscribeToAllProducts(setAllProducts);
    const unsubC = subscribeToCustomers(setAllCustomers);
    const unsubE = subscribeToWhatsAppEnquiries(setAllEnquiries);
    return () => { unsubR(); unsubT(); unsubS(); unsubP(); unsubC(); unsubE(); };
  }, []);

  const totalRevenue = recentOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockCount = allProducts.filter(p => p.stock > 0 && p.stock < 20).length;
  const newEnquiryCount = allEnquiries.filter(e => e.status === 'new').length;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard Overview</h1>
        <p className="admin-page-subtitle">Welcome back, Admin — here&apos;s what&apos;s happening across Star Mens Park.</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Total Revenue</span>
            <div className="admin-stat-icon admin-action-btn blue"><IndianRupee size={18} /></div>
          </div>
          <div className="admin-stat-number">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="admin-stat-change up"><TrendingUp size={13} /> {recentOrders.length} orders total</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Total Customers</span>
            <div className="admin-stat-icon admin-action-btn purple"><Users size={18} /></div>
          </div>
          <div className="admin-stat-number">{allCustomers.length}</div>
          <div className="admin-stat-change up"><TrendingUp size={13} /> Registered users</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Stock Alerts</span>
            <div className="admin-stat-icon admin-action-btn orange"><AlertCircle size={18} /></div>
          </div>
          <div className="admin-stat-number">{lowStockCount} Items</div>
          <div className="admin-stat-change orange">{lowStockCount > 0 ? 'Low stock levels' : 'All stocked'}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">WhatsApp Enquiries</span>
            <div className="admin-stat-icon admin-action-btn green"><MessageCircle size={18} /></div>
          </div>
          <div className="admin-stat-number">{newEnquiryCount > 0 ? `${newEnquiryCount} New` : `${allEnquiries.length} Total`}</div>
          <div className="admin-stat-change up">{allEnquiries.length > 0 ? <><TrendingUp size={13} /> Active</> : 'No enquiries yet'}</div>
        </div>
      </div>

      <div className="admin-grid-3-1">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Revenue Chart (Daily)</span>
            <div className="admin-flex-gap-2">
              <button className="admin-card-action active" aria-label="View Daily Revenue">Daily</button>
              <button className="admin-card-action" aria-label="View Weekly Revenue">Weekly</button>
            </div>
          </div>
          <div className="admin-revenue-chart-mock">
            {[30, 45, 25, 60, 85, 40, 55].map((h, i) => (
              <div key={i} className="admin-chart-bar-wrapper">
                <div className="admin-chart-bar admin-bg-blue-light" style={{ height: `${h}%` }}>
                  <div className="admin-chart-bar-fill admin-bg-blue" style={{ height: '100%' }} />
                </div>
                <div className="admin-chart-label">{'MTWTFSS'[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Top Categories</span>
          </div>
          <div className="admin-card-content-p">
            {[
              { n: 'Group Shirts', v: 45 },
              { n: 'Designer', v: 30 },
              { n: 'Bottoms', v: 15 },
              { n: 'Vesti', v: 10 },
            ].map(c => (
              <div key={c.n} className="admin-category-stat">
                <div className="admin-flex-between">
                  <span className="admin-text-muted-xs admin-fw-700">{c.n}</span>
                  <span className="admin-text-muted-xs">{c.v}%</span>
                </div>
                <div className="admin-progress-bar">
                  <div className="admin-progress-fill blue" style={{ width: `${c.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-grid-3-1">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Recent Web Orders</span>
            <button className="admin-card-action" aria-label="View All Orders">View All <ArrowUpRight size={13} /></button>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 4).map(order => (
                  <tr key={order.id}>
                    <td><code className="admin-code-blue">{order.id}</code></td>
                    <td className="admin-fw-600">{order.customer}</td>
                    <td className="admin-text-muted-sm admin-truncate-160">{order.product}</td>
                    <td className="admin-fw-700">{order.amount}</td>
                    <td><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Quick Stats</span>
          </div>
          <div className="admin-festival-widget alert">
            <div className="admin-fw-800" style={{ color: '#3b82f6' }}>{recentOrders.filter(o => o.status === 'pending').length} Pending</div>
            <div className="admin-text-muted-sm">Orders awaiting processing</div>
            <div className="admin-text-muted-xs mt-8">{recentOrders.filter(o => o.status === 'delivered').length} Delivered</div>
            <div className="admin-text-muted-xs">{recentOrders.filter(o => o.status === 'processing').length} Processing</div>
          </div>
        </div>
      </div>
    </>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: 'Casual Shirt',
    price: '0',
    oldPrice: '',
    stock: '0',
    status: 'active',
    tag: '',
    color: 'Multi',
  });

  useEffect(() => {
    const unsubscribe = subscribeToAllProducts((data) => {
      setProducts(data);
      setLoading(false);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  function openEditModal(product: any) {
    setEditingProduct(product);
    setEditForm({
      name: product.name || product.title || '',
      category: product.category || 'Casual Shirt',
      price: String(product.price ?? '0'),
      oldPrice: product.oldPrice ? String(product.oldPrice) : '',
      stock: String(product.stock ?? 0),
      status: product.status || (product.stock === 0 ? 'out_of_stock' : 'active'),
      tag: product.tag || '',
      color: product.color || 'Multi',
    });
  }

  function closeEditModal() {
    if (savingEdit) return;
    setEditingProduct(null);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;

    const trimmedName = editForm.name.trim();
    const trimmedCategory = editForm.category.trim();
    const normalizedPrice = editForm.price.replace(/[^0-9.]/g, '') || '0';
    const normalizedOldPrice = editForm.oldPrice.replace(/[^0-9.]/g, '');
    const parsedStock = Number(editForm.stock);
    const normalizedStock = Number.isFinite(parsedStock) && parsedStock >= 0
      ? Math.floor(parsedStock)
      : 0;

    if (!trimmedName) {
      toast.error('Product name is required.');
      return;
    }

    if (!trimmedCategory) {
      toast.error('Category is required.');
      return;
    }

    setSavingEdit(true);

    try {
      await updateProductDoc(editingProduct.id, {
        name: trimmedName,
        category: trimmedCategory,
        price: normalizedPrice,
        oldPrice: normalizedOldPrice || normalizedPrice,
        stock: normalizedStock,
        inStock: normalizedStock > 0,
        status: normalizedStock === 0 ? 'out_of_stock' : editForm.status,
        tag: editForm.tag.trim(),
        color: editForm.color.trim() || 'Multi',
      });

      toast.success('Product updated successfully.');
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDeleteProduct(product: any) {
    const confirmed = window.confirm(
      `Delete "${product.name || product.title || 'this product'}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingProductId(product.id);

    try {
      await deleteProductDoc(product.id);
      toast.success('Product deleted successfully.');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setDeletingProductId(null);
    }
  }

  return (
    <>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">Manage your product catalogue</p>
        </div>
        <div className="admin-flex-gap-2">
          <button
            onClick={() => window.location.href = '/admin/products/local-upload'}
            className="admin-quick-btn"
            style={{ width: 'auto', padding: '0.6rem 1.25rem' }}
          >
            <Plus size={16} /> Local Upload
          </button>
          <button 
            onClick={() => window.location.href = '/admin/products/add'}
            className="admin-quick-btn blue" 
            style={{ width: 'auto', padding: '0.6rem 1.25rem' }}
          >
            <Plus size={16} /> Firebase Add
          </button>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">All Products ({loading ? '...' : products.length})</span>
          <button className="admin-card-action"><Filter size={13} /> Filter</button>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Product Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="admin-text-center admin-text-muted-sm">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-text-center admin-text-muted-sm">No products found.</td>
                </tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td><code className="admin-code-gray">{p.id}</code></td>
                  <td className="admin-fw-600">{p.name || p.title}</td>
                  <td className="admin-text-muted-sm">{p.category}</td>
                  <td className="admin-fw-700">₹{p.price}</td>
                  <td>
                    <span className={`admin-fw-700 ${p.stock === 0 ? 'admin-action-btn-red' : p.stock < 20 ? 'admin-stat-change orange' : 'admin-stat-change up'}`} style={{ color: p.stock === 0 ? '#ef4444' : p.stock < 20 ? '#f97316' : '#10b981' }}>
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} units`}
                    </span>
                  </td>
                  <td><StatusBadge status={p.status || 'active'} /></td>
                  <td>
                    <div className="admin-action-btn-group">
                      <button className="admin-action-btn blue" title="View"><Eye size={13} /></button>
                      <button
                        className="admin-action-btn green"
                        title="Edit"
                        onClick={() => openEditModal(p)}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        className="admin-action-btn red"
                        title="Delete"
                        onClick={() => handleDeleteProduct(p)}
                        disabled={deletingProductId === p.id}
                      >
                        {deletingProductId === p.id ? <Clock size={13} /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingProduct && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Edit Product</h3>
              <button className="admin-card-action" onClick={closeEditModal} disabled={savingEdit}>
                Close
              </button>
            </div>

            <form className="admin-modal-body" onSubmit={handleEditSubmit}>
              <div className="admin-grid-2">
                <div className="admin-settings-field">
                  <label className="admin-settings-label" htmlFor="edit-product-name">Product Name</label>
                  <input
                    id="edit-product-name"
                    title="Product Name"
                    className="admin-settings-value"
                    value={editForm.name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label" htmlFor="edit-product-category">Category</label>
                  <select
                    id="edit-product-category"
                    title="Category"
                    className="admin-settings-value"
                    value={editForm.category}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="Casual Shirt">Casual Shirt</option>
                    <option value="Formal Shirt">Formal Shirt</option>
                    <option value="Vesthi">Vesthi</option>
                    <option value="Group Shirt">Group Shirt</option>
                  </select>
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label" htmlFor="edit-product-price">Sale Price</label>
                  <input
                    id="edit-product-price"
                    title="Sale Price"
                    className="admin-settings-value"
                    type="number"
                    min="0"
                    step="1"
                    value={editForm.price}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label" htmlFor="edit-product-old-price">Original Price</label>
                  <input
                    id="edit-product-old-price"
                    title="Original Price"
                    className="admin-settings-value"
                    type="number"
                    min="0"
                    step="1"
                    value={editForm.oldPrice}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, oldPrice: e.target.value }))}
                  />
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label" htmlFor="edit-product-stock">Stock</label>
                  <input
                    id="edit-product-stock"
                    title="Stock"
                    className="admin-settings-value"
                    type="number"
                    min="0"
                    step="1"
                    value={editForm.stock}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, stock: e.target.value }))}
                    required
                  />
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label" htmlFor="edit-product-status">Status</label>
                  <select
                    id="edit-product-status"
                    title="Status"
                    className="admin-settings-value"
                    value={editForm.status}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="out_of_stock">out_of_stock</option>
                  </select>
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label" htmlFor="edit-product-tag">Tag</label>
                  <input
                    id="edit-product-tag"
                    title="Tag"
                    className="admin-settings-value"
                    value={editForm.tag}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, tag: e.target.value }))}
                    placeholder="Bestseller / New / Sale"
                  />
                </div>

                <div className="admin-settings-field">
                  <label className="admin-settings-label" htmlFor="edit-product-color">Color</label>
                  <input
                    id="edit-product-color"
                    title="Color"
                    className="admin-settings-value"
                    value={editForm.color}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, color: e.target.value }))}
                    placeholder="Multi"
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-action-btn gray" onClick={closeEditModal} disabled={savingEdit}>
                  Cancel
                </button>
                <button type="submit" className="admin-quick-btn blue" disabled={savingEdit}>
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAllOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <p className="admin-page-subtitle">Track and manage all customer orders</p>
      </div>
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Orders', value: orders.length.toString(), color: '#3b82f6' },
          { label: 'Delivered',    value: deliveredCount.toString(),   color: '#10b981' },
          { label: 'Processing',   value: processingCount.toString(),    color: '#f59e0b' },
          { label: 'Cancelled',    value: cancelledCount.toString(),    color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-label">{s.label}</div>
            <div className="admin-stat-number" style={{ color: s.color }}>{loading ? '...' : s.value}</div>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">All Orders</span>
          <button className="admin-card-action"><Download size={13} /> Export</button>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="admin-text-center admin-text-muted-sm">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-text-center admin-text-muted-sm">No orders found.</td>
                </tr>
              ) : orders.map(o => (
                <tr key={o.id}>
                  <td><code className="admin-code-blue">{o.id}</code></td>
                  <td className="admin-fw-600">
                    {o.customerInfo?.name || o.customer?.name || 'Guest'}
                  </td>
                  <td className="admin-text-muted-sm">
                    {o.items?.map((i: any) => i.name).join(', ') || o.product || 'Unknown'}
                  </td>
                  <td className="admin-fw-700">₹{(o.total || o.amount || 0).toLocaleString('en-IN')}</td>
                  <td className="admin-text-muted-sm">
                    {o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString() : (o.date || new Date().toLocaleDateString())}
                  </td>
                  <td>
                    <select 
                      value={o.status?.toLowerCase() || 'pending'} 
                      onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td><button className="admin-card-action admin-text-muted-xs">View <ChevronRight size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CustomersTab() {

  const [CUSTOMERS, setCustomers] = useState<any[]>([]);
  useEffect(() => { return subscribeToCustomers(setCustomers); }, []);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Customers</h1>
        <p className="admin-page-subtitle">Manage your customer base</p>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">All Customers ({CUSTOMERS.length})</span>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Orders</th><th>Total Spent</th><th>Joined</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {CUSTOMERS.map((c, i) => (
                <tr key={i}>
                  <td>
                    <div className="admin-sidebar-user">
                      <div className="admin-avatar admin-avatar-sm">
                        {c.name.charAt(0)}
                      </div>
                      <span className="admin-fw-600">{c.name}</span>
                    </div>
                  </td>
                  <td className="admin-text-muted-sm">{c.email}</td>
                  <td className="admin-fw-700">{c.orders}</td>
                  <td className="admin-fw-700">{c.total}</td>
                  <td className="admin-text-muted-xs">{c.joined}</td>
                  <td><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ReviewsTab() {

  const [REVIEWS, setReviews] = useState<any[]>([]);
  useEffect(() => { return subscribeToReviews(setReviews); }, []);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reviews</h1>
        <p className="admin-page-subtitle">Monitor and respond to customer feedback</p>
      </div>
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        {[
          { label: 'Total Reviews', value: REVIEWS.length > 0 ? `${REVIEWS.length}` : '0' },
          { label: 'Average Rating', value: REVIEWS.length > 0 ? `${(REVIEWS.reduce((s: number, r: any) => s + (r.rating || 0), 0) / REVIEWS.length).toFixed(1)} ★` : 'N/A' },
          { label: 'Reviews This Month', value: REVIEWS.length > 0 ? `${REVIEWS.length}` : '0' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-label">{s.label}</div>
            <div className="admin-stat-number">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Customer Reviews</span>
        </div>
        <div style={{ padding: '0.5rem 0' }}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={{ padding: '1rem 1.5rem', borderBottom: i < REVIEWS.length - 1 ? '1px solid #f0f0f0' : 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="admin-flex-between">
                <div className="admin-sidebar-user">
                  <div className="admin-avatar admin-avatar-sm">{r.name.charAt(0)}</div>
                  <div>
                    <div className="admin-fw-700">{r.name}</div>
                    <StarRating rating={r.rating} />
                  </div>
                </div>
                <span className="admin-text-muted-xs">{r.date}</span>
              </div>
              <p className="admin-text-muted-sm" style={{ marginLeft: 40 }}>&quot;{r.text}&quot;</p>
              <button className="admin-action-btn blue" style={{ width: 'fit-content', marginLeft: 40, padding: '5px 12px', fontSize: '0.78rem' }}>
                <MessageSquare size={12} style={{ marginRight: 4 }} />Reply
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SettingsTab() {
  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Settings</h1>
        <p className="admin-page-subtitle">Manage store configuration</p>
      </div>
      <div className="admin-grid-2">
        {[
          { title: 'Store Info',       fields: [{ label: 'Store Name', value: 'Star Mens Park' }, { label: 'Location', value: 'Dindigul Bazaar, Tamil Nadu' }, { label: 'Phone', value: '+91 99999 99999' }] },
          { title: 'Announcement Bar', fields: [{ label: 'Message', value: 'Group Shirts from ₹399 — All Sizes 22 to 5XL!' }, { label: 'Link Text', value: 'Enquire Now →' }] },
          { title: 'Admin Credentials',fields: [{ label: 'Admin Email', value: 'admin@starmenspark.com' }, { label: 'Password', value: '••••••••' }] },
          { title: 'Social Links',     fields: [{ label: 'Instagram', value: '@starmenspark' }, { label: 'WhatsApp', value: '+91 XXXXX XXXXX' }] },
        ].map((section) => (
          <div key={section.title} className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">{section.title}</span>
              <button className="admin-card-action"><Pencil size={12} /> Edit</button>
            </div>
            <div className="admin-settings-row">
              {section.fields.map(f => (
                <div key={f.label} className="admin-settings-field">
                  <div className="admin-settings-label">{f.label}</div>
                  <div className="admin-settings-value">{f.value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function InventoryTab() {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  
  useEffect(() => { 
    const unsubR = subscribeToAllProducts(setProductsList);
    const unsubS = subscribeToStockHistory(setStockHistory);
    return () => { unsubR(); unsubS(); };
  }, []);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Inventory & Stock</h1>
        <p className="admin-page-subtitle">Manage stock levels and history</p>
      </div>
      
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Low Stock Items</div>
          <div className="admin-stat-number" style={{ color: '#f59e0b' }}>{productsList.filter(p => p.stock > 0 && p.stock < 20).length}</div>
          <div className="admin-stat-change orange"><AlertCircle size={13} /> Threshold: 20 units</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Out of Stock</div>
          <div className="admin-stat-number" style={{ color: '#ef4444' }}>{productsList.filter(p => p.stock === 0).length}</div>
          <div className="admin-stat-change down">{productsList.filter(p => p.stock === 0).map(p => p.name).slice(0, 1).join('') || 'None'}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total SKUs</div>
          <div className="admin-stat-number">{productsList.length}</div>
          <div className="admin-stat-change up"><Package size={13} /> In catalog</div>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Bulk Stock Update</span>
            <button className="admin-quick-btn blue" style={{ width: 'auto', padding: '4px 12px' }}>Save All</button>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr><th>Product</th><th>Current</th><th>Add Qty</th></tr>
              </thead>
              <tbody>
                {productsList.slice(0, 5).map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td className="admin-fw-700">{p.stock}</td>
                    <td><input type="number" placeholder="0" className="admin-settings-value" style={{ width: 60, padding: '2px 8px' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Stock History Log</span>
            <button className="admin-card-action"><History size={13} /> View Full</button>
          </div>
          <div style={{ padding: '0.5rem 1rem' }}>
            {stockHistory.map((h, i) => (
              <div key={i} className="admin-product-row" style={{ borderBottom: '1px solid #eee' }}>
                <div className="admin-product-info">
                  <div className="admin-fw-600">{h.product}</div>
                  <div className="admin-text-muted-xs">{h.by} • {h.date}</div>
                </div>
                <div className="admin-text-right">
                  <div className={`admin-fw-700 ${h.qty.startsWith('+') ? 'up' : h.qty === '0' ? '' : 'down'}`} style={{ color: h.qty.startsWith('+') ? '#10b981' : h.qty === '0' ? '#888' : '#ef4444' }}>
                    {h.qty}
                  </div>
                  <div className="admin-text-muted-xs">{h.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function WhatsAppMgmtTab() {

  const [whatsappEnquiries, setWhatsapp] = useState<any[]>([]);
  useEffect(() => { return subscribeToWhatsAppEnquiries(setWhatsapp); }, []);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">WhatsApp Order Enquiries</h1>
        <p className="admin-page-subtitle">Track and manage customer WhatsApp chats</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Incoming Enquiries</span>
          <div className="admin-flex-gap-2">
            <button className="admin-card-action active">All</button>
            <button className="admin-card-action">New</button>
            <button className="admin-card-action">Replied</button>
          </div>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th><th>Enquiry Message</th><th>Date / Time</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {whatsappEnquiries.map(w => (
                <tr key={w.id}>
                  <td>
                    <div className="admin-fw-600">{w.name}</div>
                    <div className="admin-text-muted-xs">{w.phone}</div>
                  </td>
                  <td className="admin-text-muted-sm admin-truncate-160" title={w.message}>&quot;{w.message}&quot;</td>
                  <td className="admin-text-muted-sm">{w.date}</td>
                  <td>
                    <span className={`admin-status ${w.status}`}>
                      {w.status === 'new' && <Clock size={10} style={{ marginRight: 4 }} />}
                      {w.status === 'replied' && <MessageCircle size={10} style={{ marginRight: 4 }} />}
                      {w.status === 'confirmed' && <CheckCircle2 size={10} style={{ marginRight: 4 }} />}
                      {w.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-btn-group">
                      <button className="admin-action-btn green" title="WhatsApp Reply"><MessageCircle size={13} /></button>
                      <button className="admin-action-btn blue" title="Call"><Phone size={13} /></button>
                      <button className="admin-action-btn purple" title="Update Status"><Pencil size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Quick Reply Templates</span>
          <button className="admin-card-action"><Plus size={13} /> Add New</button>
        </div>
        <div className="admin-grid-3" style={{ padding: '1rem', gap: '1rem' }}>
          {[
            { t: 'Ready to collect', m: 'Your order is ready to collect at our Dindigul Bazaar shop, sir!' },
            { t: 'Bulk Enquiry', m: 'Thank you for your enquiry. For bulk orders, please share your event date and color choice.' },
            { t: 'Location Share', m: 'Here is our shop location: Star Mens Park, Main Road, Dindigul.' },
          ].map((temp, i) => (
            <div key={i} className="admin-stat-card" style={{ cursor: 'pointer', border: '1px dashed #ddd' }}>
              <div className="admin-fw-700" style={{ marginBottom: 4 }}>{temp.t}</div>
              <div className="admin-text-muted-xs" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{temp.m}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function GroupOrdersTab() {

  const [GROUP_ORDERS, setGroupOrders] = useState<any[]>([]);
  useEffect(() => { return subscribeToGroupOrders(setGroupOrders); }, []);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Bulk & Group Orders</h1>
        <p className="admin-page-subtitle">Manage high-volume events and custom orders</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Bulk Revenue</div>
          <div className="admin-stat-number" style={{ color: '#7c3aed' }}>{GROUP_ORDERS.length > 0 ? GROUP_ORDERS.map(g => parseInt(g.revenue.replace(/[^0-9]/g, '') || '0')).reduce((a: number, b: number) => a + b, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }) : '₹0'}</div>
          <div className="admin-stat-change up"><TrendingUp size={13} /> All time</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Active Groups</div>
          <div className="admin-stat-number">{GROUP_ORDERS.length}</div>
          <div className="admin-stat-change up">{GROUP_ORDERS.filter(g => g.status === 'in_progress' || g.status === 'pending').length} in production</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Pieces</div>
          <div className="admin-stat-number">{GROUP_ORDERS.reduce((sum: number, g: any) => sum + (g.count || 0), 0)}</div>
          <div className="admin-stat-change purple">Ordered pieces</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Active Group Orders</span>
          <button className="admin-quick-btn blue" title="New Bulk Order"><Plus size={16} /> New Bulk Order</button>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event / Group</th><th>Quantity</th><th>Color</th><th>Deadline</th><th>Revenue</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {GROUP_ORDERS.map(g => (
                <tr key={g.id}>
                  <td>
                    <div className="admin-fw-600">{g.event}</div>
                    <div className="admin-code-gray">{g.id}</div>
                  </td>
                  <td className="admin-fw-700">{g.count} pcs</td>
                  <td>
                    <div className="admin-flex-gap-2">
                      <div className="admin-dot" style={{ backgroundColor: g.color.toLowerCase().includes('blue') ? 'blue' : g.color.toLowerCase().includes('white') ? '#eee' : '#f59e0b' }} />
                      {g.color}
                    </div>
                  </td>
                  <td className="admin-text-muted-sm">{g.date}</td>
                  <td className="admin-fw-700">{g.revenue}</td>
                  <td>
                    <span className={`admin-status ${g.status}`}>
                      {g.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-btn-group">
                      <button className="admin-action-btn blue" title="View Details"><ExternalLink size={13} /></button>
                      <button className="admin-action-btn purple" title="Export Sizes"><FileText size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CouponsTab() {

  const [COUPONS, setCoupons] = useState<any[]>([]);
  const [FESTIVALS, setFestivals] = useState<any[]>([]);
  useEffect(() => {
    const uC = subscribeToCoupons(setCoupons);
    const uF = subscribeToFestivals(setFestivals);
    return () => { uC(); uF(); };
  }, []);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Coupons & Offers</h1>
        <p className="admin-page-subtitle">Manage discounts and seasonal promotions</p>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Active Coupons</span>
          <button className="admin-quick-btn blue"><Plus size={16} /> Create Coupon</button>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Code</th><th>Type</th><th>Value</th><th>Usage</th><th>Expiry</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {COUPONS.map(c => (
                <tr key={c.code}>
                  <td><code className="admin-fw-800" style={{ color: '#7c3aed' }}>{c.code}</code></td>
                  <td>{c.type}</td>
                  <td className="admin-fw-700">{c.value}</td>
                  <td>{c.used} times</td>
                  <td className="admin-text-muted-sm">{c.expiry}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <div className="admin-action-btn-group">
                      <button className="admin-action-btn blue"><Pencil size={13} /></button>
                      <button className="admin-action-btn red"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CalendarTab() {
  const [FESTIVALS, setFestivals] = useState<any[]>([]);
  useEffect(() => { const unsub = subscribeToFestivals(setFestivals); return () => unsub(); }, []);
  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Festival Calendar</h1>
        <p className="admin-page-subtitle">Plan for upcoming peak seasons</p>
      </div>
      <div className="admin-grid-3">
        {FESTIVALS.map(f => (
          <div key={f.name} className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">{f.name}</span>
              <StatusBadge status={f.status} />
            </div>
            <div style={{ padding: '1rem' }}>
              <div className="admin-text-muted-sm admin-fw-700">{f.date}</div>
              <div className="admin-stat-number" style={{ fontSize: '1.5rem', marginTop: 8 }}>{f.enquiries}</div>
              <div className="admin-text-muted-xs">Pre-order enquiries</div>
              <button className="admin-quick-btn blue" style={{ marginTop: 16, width: '100%' }}>Send WhatsApp Reminders</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StaffTab() {

  const [STAFF, setStaff] = useState<any[]>([]);
  useEffect(() => { return subscribeToStaff(setStaff); }, []);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Staff / Role Management</h1>
        <p className="admin-page-subtitle">Manage shop staff access levels</p>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Shop Staff</span>
          <button className="admin-quick-btn blue"><Plus size={16} /> Add Staff</button>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Role</th><th>Access</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {STAFF.map(s => (
                <tr key={s.name}>
                  <td className="admin-fw-600">{s.name}</td>
                  <td><span className="admin-text-muted-xs admin-fw-700" style={{ background: '#f5f5f5', padding: '2px 8px', borderRadius: 4 }}>{s.role.toUpperCase()}</span></td>
                  <td className="admin-text-muted-sm">{s.access}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>
                    <div className="admin-action-btn-group">
                      <button className="admin-action-btn blue"><Pencil size={13} /></button>
                      <button className="admin-action-btn red"><Shield size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ReportsTab() {
  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reports & Exports</h1>
        <p className="admin-page-subtitle">Download your shop data</p>
      </div>
      <div className="admin-grid-3">
        {[
          { t: 'Monthly Sales', d: 'Revenue breakdown and order analytics', i: FileText },
          { t: 'Inventory Report', d: 'Stock levels for all products', i: Database },
          { t: 'Customer List', d: 'Contact details of all registered customers', i: Users },
        ].map(r => (
          <div key={r.t} className="admin-card" style={{ cursor: 'pointer' }}>
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div className="admin-action-btn blue" style={{ width: 48, height: 48, margin: '0 auto 1rem', borderRadius: '50%' }}>
                <r.i size={24} />
              </div>
              <div className="admin-fw-700">{r.t}</div>
              <div className="admin-text-muted-sm" style={{ margin: '8px 0 16px' }}>{r.d}</div>
              <button className="admin-quick-btn green" style={{ width: '100%' }}>Download PDF</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── TAB TITLES ── */
const TAB_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  products:  'Products',
  inventory: 'Stock Management',
  'group-orders': 'Group Orders',
  'whatsapp-mgmt': 'WhatsApp Enquiries',
  orders:    'Web Orders',
  customers: 'Customers',
  coupons:   'Coupons & Offers',
  calendar:  'Festival Calendar',
  reviews:   'Reviews',
  staff:     'Staff / Roles',
  reports:   'Reports',
  settings:  'Settings',
};

/* ── Main Export ── */
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':     return <DashboardTab />;
      case 'products':      return <ProductsTab />;
      case 'inventory':     return <InventoryTab />;
      case 'group-orders':  return <GroupOrdersTab />;
      case 'whatsapp-mgmt': return <WhatsAppMgmtTab />;
      case 'orders':        return <OrdersTab />;
      case 'customers':     return <CustomersTab />;
      case 'reviews':       return <ReviewsTab />;
      case 'coupons':       return <CouponsTab />;
      case 'calendar':      return <CalendarTab />;
      case 'staff':        return <StaffTab />;
      case 'reports':       return <ReportsTab />;
      case 'settings':      return <SettingsTab />;
      default:
        return (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', textTransform: 'none', marginBottom: '0.5rem' }}>
              {TAB_TITLES[activeTab] || activeTab}
            </h2>
            <p>This section is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title={TAB_TITLES[activeTab] || 'Admin'}
    >
      {renderTab()}
    </AdminLayout>
  );
}
