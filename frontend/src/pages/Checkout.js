import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  Building,
  MapPin,
  User,
  Phone,
  Sparkles
} from 'lucide-react';

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [placing, setPlacing] = useState(false);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center', padding: 24 }}>
        <h2>No Items to Checkout</h2>
        <p style={{ color: '#64748b' }}>Your shopping cart is currently empty.</p>
        <Link to="/" className="btn-primary" style={{ marginTop: 16 }}>
          Explore Products
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);

    const fullShippingAddress = `${fullName} (${phone}), ${addressLine}, ${city} - ${postalCode}`;

    try {
      await api.post('orders/', { shipping_address: fullShippingAddress });
      await refreshCart();
      addToast('Order placed successfully! Thank you for your purchase.', 'success');
      navigate('/orders');
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to place order. Please try again.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  const totalAmount = Number(cart.total || 0);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}>
      <h1 style={styles.pageTitle}>Secure Checkout</h1>

      <div style={styles.checkoutLayout}>
        {/* Left Form Column */}
        <div style={styles.formCol}>
          <form onSubmit={handlePlaceOrder}>
            {/* Step 1: Shipping Address */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.stepBadge}>1</div>
                <h3 style={styles.sectionTitle}>Shipping & Delivery Address</h3>
              </div>

              <div style={styles.inputGrid}>
                <div style={styles.fieldFull}>
                  <label style={styles.label}>Full Name</label>
                  <div style={styles.inputWrap}>
                    <User size={16} color="#94a3b8" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.fieldFull}>
                  <label style={styles.label}>Phone Number</label>
                  <div style={styles.inputWrap}>
                    <Phone size={16} color="#94a3b8" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.fieldFull}>
                  <label style={styles.label}>Street Address</label>
                  <div style={styles.inputWrap}>
                    <MapPin size={16} color="#94a3b8" />
                    <input
                      type="text"
                      required
                      placeholder="123 Shopping Avenue, Suite 400"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.fieldHalf}>
                  <label style={styles.label}>City</label>
                  <div style={styles.inputWrap}>
                    <Building size={16} color="#94a3b8" />
                    <input
                      type="text"
                      required
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.fieldHalf}>
                  <label style={styles.label}>Postal / ZIP Code</label>
                  <div style={styles.inputWrap}>
                    <input
                      type="text"
                      required
                      placeholder="10001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      style={{ ...styles.input, paddingLeft: 12 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Selection */}
            <div style={{ ...styles.sectionCard, marginTop: 24 }}>
              <div style={styles.sectionHeader}>
                <div style={styles.stepBadge}>2</div>
                <h3 style={styles.sectionTitle}>Payment Options</h3>
              </div>

              <div style={styles.paymentOptionsGrid}>
                <label
                  style={{
                    ...styles.paymentOption,
                    ...(paymentMethod === 'card' ? styles.paymentOptionActive : {}),
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    style={{ display: 'none' }}
                  />
                  <CreditCard size={20} color={paymentMethod === 'card' ? '#4f46e5' : '#64748b'} />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Credit / Debit Card</span>
                </label>

                <label
                  style={{
                    ...styles.paymentOption,
                    ...(paymentMethod === 'upi' ? styles.paymentOptionActive : {}),
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    style={{ display: 'none' }}
                  />
                  <Sparkles size={20} color={paymentMethod === 'upi' ? '#4f46e5' : '#64748b'} />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>UPI / GPay / Apple Pay</span>
                </label>

                <label
                  style={{
                    ...styles.paymentOption,
                    ...(paymentMethod === 'cod' ? styles.paymentOptionActive : {}),
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    style={{ display: 'none' }}
                  />
                  <Truck size={20} color={paymentMethod === 'cod' ? '#4f46e5' : '#64748b'} />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Cash on Delivery</span>
                </label>
              </div>

              {/* Mock Credit Card Fields */}
              {paymentMethod === 'card' && (
                <div style={styles.cardInputBox}>
                  <div style={styles.fieldFull}>
                    <label style={styles.label}>Card Number</label>
                    <div style={styles.inputWrap}>
                      <CreditCard size={16} color="#94a3b8" />
                      <input
                        type="text"
                        placeholder="4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        style={{ ...styles.input, paddingLeft: 12 }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>CVC / CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        style={{ ...styles.input, paddingLeft: 12 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={placing}
                style={styles.submitOrderBtn}
              >
                {placing ? (
                  'Processing Payment & Placing Order...'
                ) : (
                  <>
                    <Lock size={16} /> Pay & Place Order (${totalAmount.toFixed(2)})
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Summary Review Column */}
        <div style={styles.summaryCol}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Review Your Items ({cart.items.length})</h3>

            <div style={styles.itemsReviewList}>
              {cart.items.map((item) => (
                <div key={item.id} style={styles.reviewItemRow}>
                  <img
                    src={item.product.image || 'https://via.placeholder.com/60?text=Product'}
                    alt={item.product.name}
                    style={styles.reviewThumb}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={styles.reviewItemName}>{item.product.name}</span>
                    <span style={styles.reviewQty}>Qty: {item.quantity}</span>
                  </div>
                  <span style={styles.reviewPrice}>${Number(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={styles.divider} />

            <div style={styles.calcRow}>
              <span>Items Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div style={styles.calcRow}>
              <span>Shipping</span>
              <span style={{ color: '#10b981' }}>FREE</span>
            </div>

            <div style={styles.divider} />

            <div style={styles.grandTotalRow}>
              <span>Total Amount</span>
              <span style={styles.grandTotalValue}>${totalAmount.toFixed(2)}</span>
            </div>

            <div style={styles.trustFooter}>
              <ShieldCheck size={18} color="#10b981" />
              <span>256-Bit SSL Encryption Guaranteed</span>
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
    marginBottom: 28,
  },
  checkoutLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 32,
  },
  formCol: {
    flex: 2,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    border: '1px solid #e2e8f0',
    padding: 28,
    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },
  fieldFull: {
    gridColumn: '1 / -1',
  },
  fieldHalf: {
    gridColumn: 'span 1',
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#334155',
    marginBottom: 6,
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    border: '1px solid #cbd5e1',
    borderRadius: 10,
    padding: '10px 14px',
    backgroundColor: '#f8fafc',
  },
  input: {
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 14,
    color: '#0f172a',
    outline: 'none',
  },
  paymentOptionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 12,
    marginBottom: 20,
  },
  paymentOption: {
    padding: 16,
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  paymentOptionActive: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
    boxShadow: '0 2px 8px rgba(79,70,229,0.15)',
  },
  cardInputBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    border: '1px solid #e2e8f0',
    marginBottom: 20,
  },
  submitOrderBtn: {
    width: '100%',
    padding: '16px',
    fontSize: 16,
    borderRadius: 12,
    marginTop: 10,
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
    position: 'sticky',
    top: 90,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 16px',
  },
  itemsReviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxHeight: 260,
    overflowY: 'auto',
  },
  reviewItemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  reviewThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    objectFit: 'cover',
    backgroundColor: '#f8fafc',
  },
  reviewItemName: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#0f172a',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  reviewQty: {
    fontSize: 12,
    color: '#64748b',
  },
  reviewPrice: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    margin: '16px 0',
  },
  calcRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  grandTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
  },
  grandTotalValue: {
    fontSize: 22,
    fontWeight: 800,
    color: '#4f46e5',
  },
  trustFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontSize: 12,
    color: '#64748b',
    marginTop: 20,
    paddingTop: 16,
    borderTop: '1px solid #f1f5f9',
  },
};
