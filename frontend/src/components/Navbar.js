import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CartDrawer from './CartDrawer';
import {
  ShoppingBag,
  Search,
  LogOut,
  Package,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header style={styles.header}>
        <div style={styles.container}>
          {/* Brand Logo */}
          <Link to="/" style={styles.brand}>
            <div style={styles.brandIcon}>
              <Sparkles size={18} color="#ffffff" />
            </div>
            <span style={styles.brandText}>
              Shop<span style={{ color: '#4f46e5' }}>Easy</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
            <Search size={16} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={styles.clearSearchBtn}
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Desktop Navigation */}
          <nav style={styles.navLinks}>
            <Link
              to="/"
              style={{
                ...styles.navLink,
                ...(isActive('/') ? styles.activeNavLink : {}),
              }}
            >
              Shop Catalog
            </Link>

            {user ? (
              <Link
                to="/orders"
                style={{
                  ...styles.navLink,
                  ...(isActive('/orders') ? styles.activeNavLink : {}),
                }}
              >
                My Orders
              </Link>
            ) : null}

            {/* Cart Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              style={styles.cartBtn}
              title="Open Shopping Cart"
            >
              <ShoppingBag size={18} />
              <span style={styles.cartText}>Cart</span>
              <span style={styles.cartBadge}>{itemCount}</span>
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div style={styles.userDropdownWrap}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={styles.userMenuBtn}
                >
                  <div style={styles.avatarCircle}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span style={styles.username}>{user.username}</span>
                  <ChevronDown size={14} color="#64748b" />
                </button>

                {isUserMenuOpen && (
                  <div style={styles.userDropdown} className="animate-fade-in">
                    <div style={styles.userInfoHeader}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{user.username}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{user.email || 'Customer Account'}</p>
                    </div>
                    <div style={styles.dropdownDivider} />
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={styles.dropdownItem}
                    >
                      <Package size={16} /> My Orders
                    </Link>
                    <div style={styles.dropdownDivider} />
                    <button onClick={handleLogout} style={styles.dropdownLogoutBtn}>
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Link to="/login" style={styles.loginBtn}>
                  Log In
                </Link>
                <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
  },
  container: {
    maxWidth: 1240,
    margin: '0 auto',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
  },
  brandText: {
    fontSize: 22,
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.5px',
  },
  searchForm: {
    flex: 1,
    maxWidth: 460,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    color: '#94a3b8',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '9px 36px 9px 40px',
    borderRadius: 9999,
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: 13,
    color: '#0f172a',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 12,
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
  },
  navLink: {
    fontSize: 14,
    fontWeight: 600,
    color: '#475569',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  },
  activeNavLink: {
    color: '#4f46e5',
  },
  cartBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    borderRadius: 9999,
    backgroundColor: '#eef2ff',
    border: '1px solid #c7d2fe',
    color: '#4f46e5',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cartText: {
    fontWeight: 600,
  },
  cartBadge: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    borderRadius: 9999,
    padding: '2px 7px',
    fontSize: 11,
    fontWeight: 700,
  },
  userDropdownWrap: {
    position: 'relative',
  },
  userMenuBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: 8,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0f172a',
  },
  userDropdown: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    width: 200,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    padding: '8px 0',
    zIndex: 110,
  },
  userInfoHeader: {
    padding: '8px 16px',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    margin: '4px 0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    color: '#334155',
    textDecoration: 'none',
  },
  dropdownLogoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    color: '#ef4444',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
  },
  loginBtn: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0f172a',
    textDecoration: 'none',
    padding: '8px 12px',
  },
};
