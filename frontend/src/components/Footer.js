import React from 'react';
import { Sparkles, ShieldCheck, Heart, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.topRow}>
          {/* Brand Info */}
          <div style={styles.colMain}>
            <div style={styles.brand}>
              <div style={styles.brandIcon}>
                <Sparkles size={16} color="#ffffff" />
              </div>
              <span style={styles.brandText}>
                Shop<span style={{ color: '#4f46e5' }}>Easy</span>
              </span>
            </div>
            <p style={styles.brandDesc}>
              Your one-stop full-stack e-commerce marketplace. Fast delivery, secure payments, and premium customer service.
            </p>
            <div style={styles.badgeWrap}>
              <ShieldCheck size={16} color="#10b981" />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Verified Secure Shopping SSL</span>
            </div>
          </div>

          {/* Quick Links */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Categories</h4>
            <ul style={styles.list}>
              <li>Electronics & Tech</li>
              <li>Fashion & Apparel</li>
              <li>Home & Kitchen</li>
              <li>Gadgets & Accessories</li>
            </ul>
          </div>

          <div style={styles.col}>
            <h4 style={styles.colTitle}>Customer Support</h4>
            <ul style={styles.list}>
              <li>Track Order</li>
              <li>Shipping Policy</li>
              <li>Returns & Refunds</li>
              <li>FAQ & Help Center</li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Stay Updated</h4>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 12px' }}>
              Subscribe to get special discounts & product updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()} style={styles.subscribeForm}>
              <input
                type="email"
                placeholder="Enter your email"
                style={styles.subscribeInput}
              />
              <button type="submit" style={styles.subscribeBtn}>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        <div style={styles.bottomRow}>
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} ShopEasy Inc. All rights reserved. Crafted for Excellence.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
            <span>Built with</span> <Heart size={14} color="#ef4444" fill="#ef4444" /> <span>Django & React</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    marginTop: 'auto',
    borderTop: '1px solid #1e293b',
  },
  container: {
    maxWidth: 1240,
    margin: '0 auto',
    padding: '48px 24px 24px',
  },
  topRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 36,
    marginBottom: 40,
  },
  colMain: {
    maxWidth: 300,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  brandIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 20,
    fontWeight: 800,
    color: '#ffffff',
  },
  brandDesc: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 1.6,
    margin: '0 0 16px',
  },
  badgeWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  col: {},
  colTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 16px',
    letterSpacing: '0.5px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    fontSize: 13,
    color: '#94a3b8',
    cursor: 'pointer',
  },
  subscribeForm: {
    display: 'flex',
    gap: 8,
  },
  subscribeInput: {
    flex: 1,
    padding: '9px 12px',
    borderRadius: 8,
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    fontSize: 13,
    outline: 'none',
  },
  subscribeBtn: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '0 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  bottomRow: {
    paddingTop: 24,
    borderTop: '1px solid #1e293b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    fontSize: 13,
    color: '#64748b',
  },
};
