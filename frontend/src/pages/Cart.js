import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  Tag,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Cart() {
  const { cart, updateItem, removeItem } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'PROMO10' || promoCode.trim().toUpperCase() === 'CLIENT20') {
      const discount = promoCode.trim().toUpperCase() === 'CLIENT20' ? 20 : 10;
      setDiscountPercent(discount);
      setAppliedPromo(promoCode.trim().toUpperCase());
      addToast(`Promo code "${promoCode.toUpperCase()}" applied! (${discount}% OFF)`, 'success');
      setPromoCode('');
    } else {
      addToast('Invalid promo code. Try "PROMO10" or "CLIENT20"', 'error');
    }
  };

  const handleRemove = async (itemId, productName) => {
    try {
      await removeItem(itemId);
      addToast(`Removed ${productName} from cart`, 'info');
    } catch {
      addToast('Failed to remove item', 'error');
    }
  };

  const cartTotal = Number(cart.total || 0);
  const discountAmount = (cartTotal * discountPercent) / 100;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const freeShippingThreshold = 50;
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIconWrap}>
          <ShoppingBag size={56} color="#cbd5e1" />
        </div>
        <h2 style={{ margin: '20px 0 8px', fontSize: 22, color: '#0f172a' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 24px', maxWidth: 400 }}>
          Explore our wide selection of products and find something special today.
        </p>
        <Link to="/" className="btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}>
      <h1 style={styles.pageTitle}>Shopping Cart ({cart.items.length})</h1>

      {/* Free Shipping Progress Indicator */}
      <div style={styles.shippingBarCard}>
        <div style={styles.shippingHeader}>
          <Truck size={18} color="#4f46e5" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
            {amountNeededForFreeShipping === 0
              ? '🎉 You unlocked FREE Express Shipping!'
              : `Add $${amountNeededForFreeShipping.toFixed(2)} more to qualify for FREE Shipping`}
          </span>
        </div>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressBar, width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Main Grid: Cart Items & Summary Box */}
      <div style={styles.grid}>
        {/* Left Column: Items List */}
        <div style={styles.itemsCol}>
          {cart.items.map((item) => (
            <div key={item.id} style={styles.cartRow}>
              <img
                src={item.product.image || 'https://via.placeholder.com/100?text=Product'}
                alt={item.product.name}
                style={styles.itemImage}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/products/${item.product.slug}`} style={styles.itemName}>
                  {item.product.name}
                </Link>
                <span style={styles.itemCategory}>{item.product.category?.name}</span>
                <div style={styles.itemPrice}>${Number(item.product.price).toFixed(2)} unit</div>
              </div>

              {/* Quantity Controls */}
              <div style={styles.qtyBox}>
                <button
                  style={styles.qtyBtn}
                  disabled={item.quantity <= 1}
                  onClick={() => updateItem(item.id, item.quantity - 1)}
                >
                  <Minus size={13} />
                </button>
                <span style={styles.qtyVal}>{item.quantity}</span>
                <button
                  style={styles.qtyBtn}
                  onClick={() => updateItem(item.id, item.quantity + 1)}
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Subtotal */}
              <div style={styles.itemSubtotal}>
                ${Number(item.subtotal).toFixed(2)}
              </div>

              {/* Remove Button */}
              <button
                style={styles.removeBtn}
                onClick={() => handleRemove(item.id, item.product.name)}
                title="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <Link to="/" style={styles.continueLink}>
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div style={styles.summaryCol}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={styles.promoForm}>
              <div style={styles.promoInputWrap}>
                <Tag size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Promo Code (PROMO10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={styles.promoInput}
                />
              </div>
              <button type="submit" style={styles.promoBtn}>
                Apply
              </button>
            </form>

            {appliedPromo && (
              <div style={styles.appliedPromoBadge}>
                <Sparkles size={14} color="#15803d" />
                <span>Code <strong>{appliedPromo}</strong> Applied (-{discountPercent}%)</span>
              </div>
            )}

            <div style={styles.divider} />

            {/* Price Calculations */}
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div style={{ ...styles.summaryRow, color: '#10b981' }}>
                <span>Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: amountNeededForFreeShipping === 0 ? '#10b981' : '#0f172a' }}>
                {amountNeededForFreeShipping === 0 ? 'FREE' : '$5.99'}
              </span>
            </div>

            <div style={styles.divider} />

            <div style={styles.totalRow}>
              <span>Estimated Total</span>
              <span style={styles.finalTotal}>
                ${(finalTotal + (amountNeededForFreeShipping === 0 ? 0 : 5.99)).toFixed(2)}
              </span>
            </div>

            <button
              className="btn-primary"
              style={styles.checkoutBtn}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div style={styles.securityNote}>
              <ShieldCheck size={16} color="#10b981" />
              <span>Guaranteed Safe & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: '#0f172a',
    marginBottom: 20,
    letterSpacing: '-0.4px',
  },
  shippingBarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    border: '1px solid #e2e8f0',
    padding: '16px 20px',
    marginBottom: 28,
  },
  shippingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 9999,
    transition: 'width 0.4s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 32,
  },
  itemsCol: {
    flex: 2,
  },
  cartRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    padding: 16,
    marginBottom: 14,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    objectFit: 'cover',
    backgroundColor: '#f8fafc',
  },
  itemName: {
    fontSize: 15,
    fontWeight: 700,
    color: '#0f172a',
    textDecoration: 'none',
    display: 'block',
  },
  itemCategory: {
    fontSize: 12,
    color: '#64748b',
    display: 'block',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: 600,
    color: '#4f46e5',
    marginTop: 4,
  },
  qtyBox: {
    display: 'inline-flex',
    alignItems: 'center',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    padding: '6px 10px',
    color: '#475569',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  qtyVal: {
    padding: '0 10px',
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: 800,
    color: '#0f172a',
    minWidth: 80,
    textAlign: 'right',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: 8,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
  },
  continueLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
    color: '#4f46e5',
    textDecoration: 'none',
  },
  summaryCol: {
    maxWidth: 380,
    width: '100%',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    border: '1px solid #e2e8f0',
    padding: 24,
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 16px',
  },
  promoForm: {
    display: 'flex',
    gap: 8,
    marginBottom: 12,
  },
  promoInputWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  promoInput: {
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 13,
    outline: 'none',
  },
  promoBtn: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: 10,
    padding: '0 14px',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
  },
  appliedPromoBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 12,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    margin: '16px 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  finalTotal: {
    fontSize: 24,
    fontWeight: 800,
    color: '#0f172a',
  },
  checkoutBtn: {
    width: '100%',
    padding: '14px',
    fontSize: 15,
  },
  securityNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontSize: 12,
    color: '#64748b',
    marginTop: 16,
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    border: '1px solid #e2e8f0',
    maxWidth: 540,
    margin: '60px auto',
    padding: 48,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyIconWrap: {
    width: 90,
    height: 90,
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
