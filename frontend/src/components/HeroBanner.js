import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Clock, RefreshCw } from 'lucide-react';

export default function HeroBanner({ onExplore }) {
  return (
    <div style={styles.heroSection}>
      <div style={styles.bannerCard}>
        <div style={styles.badge}>
          <Sparkles size={14} color="#f59e0b" />
          <span>New Collection 2026</span>
        </div>
        <h1 style={styles.title}>
          Elevate Your Shopping Experience with <span style={styles.highlightText}>ShopEasy</span>
        </h1>
        <p style={styles.subtitle}>
          Discover top-tier electronics, premium fashion, and home essentials with instant checkout & fast worldwide delivery.
        </p>

        <div style={styles.ctaGroup}>
          <button className="btn-primary" style={styles.heroBtn} onClick={onExplore}>
            Explore Products <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div style={styles.trustGrid}>
        <div style={styles.trustItem}>
          <div style={styles.trustIconWrap}>
            <Truck size={20} color="#4f46e5" />
          </div>
          <div>
            <h4 style={styles.trustTitle}>Free Worldwide Shipping</h4>
            <p style={styles.trustDesc}>On all orders above $50</p>
          </div>
        </div>

        <div style={styles.trustItem}>
          <div style={styles.trustIconWrap}>
            <ShieldCheck size={20} color="#4f46e5" />
          </div>
          <div>
            <h4 style={styles.trustTitle}>100% Secure Checkout</h4>
            <p style={styles.trustDesc}>Encrypted JWT token protection</p>
          </div>
        </div>

        <div style={styles.trustItem}>
          <div style={styles.trustIconWrap}>
            <RefreshCw size={20} color="#4f46e5" />
          </div>
          <div>
            <h4 style={styles.trustTitle}>30-Day Money Back</h4>
            <p style={styles.trustDesc}>No questions asked returns</p>
          </div>
        </div>

        <div style={styles.trustItem}>
          <div style={styles.trustIconWrap}>
            <Clock size={20} color="#4f46e5" />
          </div>
          <div>
            <h4 style={styles.trustTitle}>24/7 Dedicated Support</h4>
            <p style={styles.trustDesc}>Live assistance anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  heroSection: {
    marginBottom: 32,
  },
  bannerCard: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
    borderRadius: 24,
    padding: '48px 40px',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.3)',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    fontSize: 12,
    fontWeight: 600,
    color: '#fbbf24',
    marginBottom: 20,
  },
  title: {
    fontSize: 'clamp(28px, 4vw, 44px)',
    fontWeight: 800,
    lineHeight: 1.2,
    maxWidth: 700,
    margin: '0 0 16px',
    letterSpacing: '-0.5px',
  },
  highlightText: {
    background: 'linear-gradient(135deg, #818cf8 0%, #38bdf8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    maxWidth: 600,
    margin: '0 0 28px',
    lineHeight: 1.6,
  },
  ctaGroup: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
  },
  heroBtn: {
    padding: '14px 28px',
    fontSize: 15,
    borderRadius: 12,
  },
  trustGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginTop: 24,
  },
  trustItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  trustIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  trustDesc: {
    fontSize: 11,
    color: '#64748b',
    margin: '2px 0 0',
  },
};
