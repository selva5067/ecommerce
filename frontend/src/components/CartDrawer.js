import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, updateItem, removeItem } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpdate = async (itemId, newQty) => {
    try {
      await updateItem(itemId, newQty);
    } catch {
      addToast('Failed to update cart quantity', 'error');
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

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} onClick={(e) => e.stopPropagation()} className="animate-fade-in">
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={styles.iconCircle}>
              <ShoppingBag size={18} color="#4f46e5" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Your Shopping Cart</h3>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                {cart.items?.length || 0} {cart.items?.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.body}>
          {!cart.items || cart.items.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIconWrap}>
                <ShoppingBag size={48} color="#cbd5e1" />
              </div>
              <h4 style={{ margin: '16px 0 8px', fontSize: 16, color: '#1e293b' }}>Your cart is empty</h4>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px', textAlign: 'center' }}>
                Looks like you haven't added anything to your cart yet.
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  onClose();
                  navigate('/');
                }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div style={styles.itemList}>
              {cart.items.map((item) => (
                <div key={item.id} style={styles.cartItem}>
                  <img
                    src={item.product.image || 'https://via.placeholder.com/80?text=Product'}
                    alt={item.product.name}
                    style={styles.itemImage}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      to={`/products/${item.product.slug}`}
                      onClick={onClose}
                      style={styles.itemName}
                    >
                      {item.product.name}
                    </Link>
                    <span style={styles.itemCategory}>{item.product.category?.name}</span>
                    <div style={styles.itemPrice}>${Number(item.product.price).toFixed(2)}</div>

                    <div style={styles.itemControls}>
                      <div style={styles.qtyBox}>
                        <button
                          style={styles.qtyBtn}
                          disabled={item.quantity <= 1}
                          onClick={() => handleUpdate(item.id, item.quantity - 1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={styles.qtyVal}>{item.quantity}</span>
                        <button
                          style={styles.qtyBtn}
                          onClick={() => handleUpdate(item.id, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        style={styles.removeBtn}
                        onClick={() => handleRemove(item.id, item.product.name)}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div style={styles.itemSubtotal}>
                    ${Number(item.subtotal).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.items && cart.items.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.summaryRow}>
              <span style={{ color: '#64748b', fontSize: 14 }}>Subtotal</span>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#0f172a' }}>
                ${Number(cart.total).toFixed(2)}
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 16px' }}>
              Taxes and shipping calculated at checkout.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  onClose();
                  navigate('/cart');
                }}
              >
                View Cart Page
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1.2 }}
                onClick={handleCheckout}
              >
                Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 999,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  drawer: {
    width: '100%',
    maxWidth: 440,
    height: '100%',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    backgroundColor: '#eef2ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: 6,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 24px',
  },
  emptyState: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 0',
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  cartItem: {
    display: 'flex',
    gap: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    border: '1px solid #f1f5f9',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    objectFit: 'cover',
    backgroundColor: '#e2e8f0',
  },
  itemName: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#0f172a',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemCategory: {
    display: 'block',
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: 600,
    color: '#4f46e5',
    margin: '4px 0 8px',
  },
  itemControls: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  qtyBox: {
    display: 'inline-flex',
    alignItems: 'center',
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    padding: '4px 8px',
    color: '#475569',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  qtyVal: {
    padding: '0 8px',
    fontSize: 12,
    fontWeight: 600,
    color: '#0f172a',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0f172a',
    alignSelf: 'flex-start',
  },
  footer: {
    padding: '20px 24px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    boxShadow: '0 -4px 12px rgba(0,0,0,0.03)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};
