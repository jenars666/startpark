'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Star, MessageSquare, Settings, LogOut, Bell,
  Search, TrendingUp, ChevronRight, Database,
  MessageCircle, Briefcase, Ticket, Calendar,
  Shield, UserCheck, FileText
} from 'lucide-react';
import './admin.css';

const NAV_ITEMS = [
  {
    section: 'Overview',
    links: [
      { icon: LayoutDashboard, label: 'Dashboard',  id: 'dashboard' },
      { icon: TrendingUp,      label: 'Analytics',  id: 'analytics' },
    ],
  },
  {
    section: 'Inventory',
    links: [
      { icon: Package,      label: 'Products',   id: 'products', badge: '12' },
      { icon: Database,     label: 'Stock Mgmt', id: 'inventory' },
      { icon: Briefcase,    label: 'Group Orders',id: 'group-orders', badge: 'New' },
    ],
  },
  {
    section: 'Enquiries',
    links: [
      { icon: MessageCircle, label: 'WhatsApp',    id: 'whatsapp-mgmt', badge: '8' },
      { icon: ShoppingBag,   label: 'Web Orders',  id: 'orders',   badge: '5'  },
      { icon: Users,         label: 'Customers',   id: 'customers'             },
    ],
  },
  {
    section: 'Marketing',
    links: [
      { icon: Ticket,        label: 'Coupons',   id: 'coupons'  },
      { icon: Calendar,      label: 'Festivals', id: 'calendar' },
      { icon: Star,          label: 'Reviews',   id: 'reviews'  },
    ],
  },
  {
    section: 'Management',
    links: [
      { icon: Shield,        label: 'Staff / Roles', id: 'staff' },
      { icon: FileText,      label: 'Reports',       id: 'reports' },
      { icon: Settings,      label: 'Settings',      id: 'settings' },
    ],
  },
];

interface AdminLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
  children: React.ReactNode;
}

export function AdminLayout({ activeTab, setActiveTab, title, children }: AdminLayoutProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    router.push('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = (id: string) => {
    setActiveTab(id);
    closeMobileMenu();
  };

  return (
    <div className={`admin-shell ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="admin-mobile-overlay" onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-logo-text">Star</div>
          <div className="admin-logo-sub">Mens Park</div>
          <span className="admin-logo-badge">Admin Panel</span>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map((group) => (
            <div key={group.section}>
              <div className="admin-nav-section">{group.section}</div>
              {group.links.map((link) => (
                <button
                  key={link.id}
                  className={`admin-nav-link ${activeTab === link.id ? 'active' : ''}`}
                  onClick={() => handleLinkClick(link.id)}
                >
                  <link.icon size={17} />
                  {link.label}
                  {link.badge && <span className="nav-badge">{link.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-avatar">A</div>
            <div className="admin-user-info">
              <div className="admin-user-name">Admin</div>
              <div className="admin-user-role">admin@starmenspark.com</div>
            </div>
            <button className="admin-logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle Menu">
              <div className="hamburger">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
            <span className="admin-topbar-title">{title}</span>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-topbar-search desktop-only">
              <Search size={14} color="#888" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="admin-notif-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="admin-notif-dot" />
            </button>
            <div className="admin-avatar admin-avatar-sm">A</div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
