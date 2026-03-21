'use client';

import { useState } from 'react';
import {
  TrendingUp, TrendingDown, ShoppingBag, Users,
  Package, IndianRupee, ArrowUpRight, Plus,
  MessageSquare, Eye, Pencil, Trash2, Star,
  Download, Filter, RefreshCw, ChevronRight,
  Database, MessageCircle, Briefcase, Ticket,
  Calendar, Shield, Search, Phone, ExternalLink,
  History, CheckCircle2, AlertCircle, Clock, FileText
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';

/* ── Mock Data ── */
const WHATSAPP_ENQUIRIES = [
  { id: 'W-001', name: 'Manoj P',    phone: '+91 98401 23456', message: 'Need 50 shirts for wedding in blue', status: 'new',       date: 'Today, 10:30 AM' },
  { id: 'W-002', name: 'Sathish R',  phone: '+91 91234 56789', message: 'Do you have 3XL designer white?',    status: 'replied',   date: 'Today, 09:15 AM' },
  { id: 'W-003', name: 'Kunal G',    phone: '+91 99887 76655', message: 'Price for bulk booking?',            status: 'confirmed', date: 'Yesterday' },
  { id: 'W-004', name: 'Arun V',     phone: '+91 94432 12345', message: 'Ready to pay advance for 20 units', status: 'completed', date: '20 Mar' },
];

const GROUP_ORDERS = [
  { id: 'GR-105', event: 'Lakshmi Wedding', count: 45, color: 'Navy Blue', date: '15 Apr 2026', status: 'in_progress', revenue: '₹42,750' },
  { id: 'GR-104', event: 'Office Annual Meet', count: 120, color: 'Classic White', date: '02 Apr 2026', status: 'confirmed', revenue: '₹1,14,000' },
  { id: 'GR-103', event: 'Family Function', count: 15, color: 'Yellow', date: '25 Mar 2026', status: 'ready', revenue: '₹14,250' },
  { id: 'GR-102', event: 'College Reunion', count: 80, color: 'Sky Blue', date: '21 Mar 2026', status: 'delivered', revenue: '₹76,000' },
];

const STOCK_HISTORY = [
  { product: 'Group Shirt (Blue)', action: 'Restocked', qty: '+50', by: 'Admin', date: 'Today, 11:20 AM' },
  { product: 'Designer White', action: 'Update', qty: '-3', by: 'Sales Staff A', date: 'Today, 10:45 AM' },
  { product: 'Formal Bottom', action: 'Sync', qty: '0', by: 'System', date: 'Today, 09:00 AM' },
];

const COUPONS = [
  { code: 'STUDENT10', type: 'Percentage', value: '10%', used: 142, status: 'active', expiry: '31 Dec 2026' },
  { code: 'FESTIVAL500', type: 'Flat', value: '₹500', used: 85, status: 'active', expiry: '15 Apr 2026' },
  { code: 'WELCOME5', type: 'Percentage', value: '5%', used: 312, status: 'inactive', expiry: 'Expired' },
];

const FESTIVALS = [
  { name: 'Tamil New Year', date: '14 Apr 2026', status: 'upcoming', enquiries: 12 },
  { name: 'Eid al-Fitr', date: '31 Mar 2026', status: 'immediate', enquiries: 24 },
  { name: 'Pongal', date: '14 Jan 2026', status: 'past', enquiries: 145 },
];

const STAFF = [
  { name: 'Admin (You)', role: 'Owner', access: 'All', status: 'active' },
  { name: 'Muthu', role: 'Sales Manager', access: 'Orders, Inventory', status: 'active' },
  { name: 'Saravanan', role: 'Staff', access: 'Inventory', status: 'active' },
];

const RECENT_ORDERS = [
  { id: '#ORD-1042', customer: 'Rajan Kumar',   product: 'Group Shirt (Blue)',      amount: '₹3,990',  status: 'delivered',  date: '21 Mar 2026' },
  { id: '#ORD-1041', customer: 'Muthukumar S',  product: 'Designer Shirt (White)',  amount: '₹1,299',  status: 'processing', date: '21 Mar 2026' },
  { id: '#ORD-1040', customer: 'Vijay D',        product: 'Formal Bottom',          amount: '₹850',    status: 'pending',    date: '20 Mar 2026' },
  { id: '#ORD-1039', customer: 'Arjun M',        product: 'Casual Shirt Pack x5',   amount: '₹6,500',  status: 'delivered',  date: '20 Mar 2026' },
  { id: '#ORD-1038', customer: 'Suresh R',       product: 'Vesti & Shirt Combo',    amount: '₹1,750',  status: 'cancelled',  date: '19 Mar 2026' },
];

const TOP_PRODUCTS = [
  { name: 'Group Shirt – Navy Blue',    category: 'Group Shirts',    price: '₹950',  sales: 142, img: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=100&q=80' },
  { name: 'Designer Shirt – White',    category: 'Designer Shirts', price: '₹1,299', sales: 98,  img: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=100&q=80' },
  { name: 'Formal Bottom – Black',     category: 'Bottoms',         price: '₹850',  sales: 76,  img: 'https://images.unsplash.com/photo-1542272604-78021c326e0e?w=100&q=80' },
  { name: 'Casual Patterned Shirt',    category: 'Casual',          price: '₹799',  sales: 64,  img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&q=80' },
  { name: 'Vesti & Shirt Combo',       category: 'Vesti & Shirt',   price: '₹1,750', sales: 55, img: 'https://images.unsplash.com/photo-1620012253295-c159f0f9b3ec?w=100&q=80' },
];

const REVIEWS = [
  { name: 'Priya S',     rating: 5, text: 'Shirts were perfect for our family function. Quality is top notch!', date: '20 Mar' },
  { name: 'Karthik M',   rating: 5, text: 'Best group shirt shop in Dindigul. Fast delivery too!',               date: '18 Mar' },
  { name: 'Anand R',     rating: 4, text: 'Good quality material. Will order again.',                            date: '17 Mar' },
  { name: 'Meena V',     rating: 5, text: 'Loved the Vesti & Shirt combo. Got so many compliments!',             date: '15 Mar' },
];

const CUSTOMERS = [
  { name: 'Rajan Kumar',   email: 'rajan@gmail.com',    orders: 7,  total: '₹24,300', joined: 'Jan 2026',  status: 'active' },
  { name: 'Vijay D',       email: 'vijay@gmail.com',    orders: 4,  total: '₹8,990',  joined: 'Feb 2026',  status: 'active' },
  { name: 'Suresh R',      email: 'suresh@gmail.com',   orders: 2,  total: '₹3,500',  joined: 'Mar 2026',  status: 'inactive' },
  { name: 'Muthukumar S',  email: 'muthu@gmail.com',    orders: 12, total: '₹41,200', joined: 'Dec 2025',  status: 'active' },
  { name: 'Arjun M',       email: 'arjun@gmail.com',    orders: 3,  total: '₹9,750',  joined: 'Mar 2026',  status: 'active' },
];

const PRODUCTS_LIST = [
  { id: 'P001', name: 'Group Shirt - Navy Blue', category: 'Group Shirts', price: '₹950',  stock: 58, status: 'active' },
  { id: 'P002', name: 'Designer Shirt - White',  category: 'Designer',     price: '₹1,299',stock: 23, status: 'active' },
  { id: 'P003', name: 'Formal Bottom - Black',   category: 'Bottoms',      price: '₹850',  stock: 0,  status: 'out_of_stock' },
  { id: 'P004', name: 'Casual Patterned Shirt',  category: 'Casual',       price: '₹799',  stock: 44, status: 'active' },
  { id: 'P005', name: 'Vesti & Shirt Combo',      category: 'Vesti',        price: '₹1,750',stock: 17, status: 'active' },
  { id: 'P006', name: 'Formal Shirt - Light Blue',category: 'Formal',       price: '₹999', stock: 31, status: 'active' },
];

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
          <div className="admin-stat-number">₹2,84,500</div>
          <div className="admin-stat-change up"><TrendingUp size={13} /> +18.2% this month</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Group Orders</span>
            <div className="admin-stat-icon admin-action-btn purple"><Briefcase size={18} /></div>
          </div>
          <div className="admin-stat-number">12 Active</div>
          <div className="admin-stat-change up"><Plus size={13} /> 3 new this week</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Stock Alerts</span>
            <div className="admin-stat-icon admin-action-btn orange"><AlertCircle size={18} /></div>
          </div>
          <div className="admin-stat-number">4 Items</div>
          <div className="admin-stat-change orange">Critical levels</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">WhatsApp Enquiries</span>
            <div className="admin-stat-icon admin-action-btn green"><MessageCircle size={18} /></div>
          </div>
          <div className="admin-stat-number">8 New</div>
          <div className="admin-stat-change up"><TrendingUp size={13} /> High traffic</div>
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
          <table className="admin-table">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.slice(0, 4).map(order => (
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

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Upcoming Festival</span>
          </div>
          <div className="admin-festival-widget alert">
            <div className="admin-text-red admin-fw-800">Eid al-Fitr</div>
            <div className="admin-text-muted-sm">31st March 2026</div>
            <div className="admin-text-muted-xs mt-8">24 Pre-orders waiting</div>
            <button className="admin-quick-btn orange mt-12 w-full" title="Send Broadcast">Send Broadcast</button>
          </div>
        </div>
      </div>
    </>
  );
}

function ProductsTab() {
  return (
    <>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">Manage your product catalogue</p>
        </div>
        <button className="admin-quick-btn blue" style={{ width: 'auto', padding: '0.6rem 1.25rem' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">All Products ({PRODUCTS_LIST.length})</span>
          <button className="admin-card-action"><Filter size={13} /> Filter</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Product Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS_LIST.map(p => (
              <tr key={p.id}>
                <td><code className="admin-code-gray">{p.id}</code></td>
                <td className="admin-fw-600">{p.name}</td>
                <td className="admin-text-muted-sm">{p.category}</td>
                <td className="admin-fw-700">{p.price}</td>
                <td>
                  <span className={`admin-fw-700 ${p.stock === 0 ? 'admin-action-btn-red' : p.stock < 20 ? 'admin-stat-change orange' : 'admin-stat-change up'}`} style={{ color: p.stock === 0 ? '#ef4444' : p.stock < 20 ? '#f97316' : '#10b981' }}>
                    {p.stock === 0 ? 'Out of Stock' : `${p.stock} units`}
                  </span>
                </td>
                <td><StatusBadge status={p.status} /></td>
                <td>
                  <div className="admin-action-btn-group">
                    <button className="admin-action-btn blue" title="View"><Eye size={13} /></button>
                    <button className="admin-action-btn green" title="Edit"><Pencil size={13} /></button>
                    <button className="admin-action-btn red" title="Delete"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function OrdersTab() {
  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <p className="admin-page-subtitle">Track and manage all customer orders</p>
      </div>
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Orders', value: '1,042', color: '#3b82f6' },
          { label: 'Delivered',    value: '980',   color: '#10b981' },
          { label: 'Processing',   value: '37',    color: '#f59e0b' },
          { label: 'Cancelled',    value: '25',    color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-label">{s.label}</div>
            <div className="admin-stat-number" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">All Orders</span>
          <button className="admin-card-action"><Download size={13} /> Export</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map(o => (
              <tr key={o.id}>
                <td><code className="admin-code-blue">{o.id}</code></td>
                <td className="admin-fw-600">{o.customer}</td>
                <td className="admin-text-muted-sm">{o.product}</td>
                <td className="admin-fw-700">{o.amount}</td>
                <td className="admin-text-muted-sm">{o.date}</td>
                <td><StatusBadge status={o.status} /></td>
                <td><button className="admin-card-action admin-text-muted-xs">View <ChevronRight size={12} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function CustomersTab() {
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
    </>
  );
}

function ReviewsTab() {
  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reviews</h1>
        <p className="admin-page-subtitle">Monitor and respond to customer feedback</p>
      </div>
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        {[
          { label: 'Total Reviews', value: '600+' },
          { label: 'Average Rating', value: '4.7 ★' },
          { label: 'Responded', value: '432' },
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
  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Inventory & Stock</h1>
        <p className="admin-page-subtitle">Manage stock levels and history</p>
      </div>
      
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Low Stock Items</div>
          <div className="admin-stat-number" style={{ color: '#f59e0b' }}>3</div>
          <div className="admin-stat-change orange"><AlertCircle size={13} /> Threshold: 20 units</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Out of Stock</div>
          <div className="admin-stat-number" style={{ color: '#ef4444' }}>1</div>
          <div className="admin-stat-change down">Formal Bottom – Black</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total SKUs</div>
          <div className="admin-stat-number">124</div>
          <div className="admin-stat-change up"><Plus size={13} /> 2 added this week</div>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Bulk Stock Update</span>
            <button className="admin-quick-btn blue" style={{ width: 'auto', padding: '4px 12px' }}>Save All</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>Product</th><th>Current</th><th>Add Qty</th></tr>
            </thead>
            <tbody>
              {PRODUCTS_LIST.slice(0, 5).map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td className="admin-fw-700">{p.stock}</td>
                  <td><input type="number" placeholder="0" className="admin-settings-value" style={{ width: 60, padding: '2px 8px' }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Stock History Log</span>
            <button className="admin-card-action"><History size={13} /> View Full</button>
          </div>
          <div style={{ padding: '0.5rem 1rem' }}>
            {STOCK_HISTORY.map((h, i) => (
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
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th><th>Enquiry Message</th><th>Date / Time</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {WHATSAPP_ENQUIRIES.map(w => (
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
  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Bulk & Group Orders</h1>
        <p className="admin-page-subtitle">Manage high-volume events and custom orders</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Bulk Revenue</div>
          <div className="admin-stat-number" style={{ color: '#7c3aed' }}>₹2,47,000</div>
          <div className="admin-stat-change up"><TrendingUp size={13} /> Last 30 days</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Active Groups</div>
          <div className="admin-stat-number">12</div>
          <div className="admin-stat-change up">In production</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Pieces</div>
          <div className="admin-stat-number">840</div>
          <div className="admin-stat-change purple">Ordered pieces</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Active Group Orders</span>
          <button className="admin-quick-btn blue" title="New Bulk Order"><Plus size={16} /> New Bulk Order</button>
        </div>
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
    </>
  );
}

function CouponsTab() {
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
    </>
  );
}

function CalendarTab() {
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
          { t: 'Monthly Sales', d: 'Full revenue breakdown for March 2026', i: FileText },
          { t: 'Inventory Report', d: 'Stock levels of all 124 SKUs', i: Database },
          { t: 'Customer List', d: 'Contact details of 3,841 customers', i: Users },
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
