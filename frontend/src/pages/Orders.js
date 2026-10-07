import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import {
  PackageCheck,
  Clock,
  MapPin,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('orders/')
      .then((res) => {
        setOrders(res.data.results || res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
        <div className="skeleton" style={{ height: 32, width: 220, marginBottom: 24 }} />
        {[1, 2].map((n) => (
          <div key={n} className="skeleton" style={{ height: 220, borderRadius: 20, marginBottom: 20 }} />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIconWrap}>
          <PackageCheck size={56} color="#cbd5e1" />
        </div>
        <h2 style={{ margin: '20px 0 8px', fontSize: 22, color: '#0f172a' }}>No Orders Found</h2>
        <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 24px', maxWidth: 400 }}>
          You haven't placed any orders yet. Once you make a purchase, it will appear here.
        </p>
        <Link to="/" className="btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
          Start Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 60px' }}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.pageTitle}>Order History</h1>
          <p style={styles.pageSub}>Track and manage your past purchases</p>
        </div>
      </div>

      <div style={styles.ordersList}>
        {orders.map((order) => {
          const isPaid = order.status === 'paid' || order.status === 'completed';

          return (
            <div key={order.id} style={styles.orderCard} className="animate-fade-in">
              {/* Card Header */}
              <div style={styles.cardHeader}>
                <div>
                  <span style={styles.orderIdLabel}>ORDER NUMBER</span>
                  <div style={styles.orderId}>#{order.id}</div>
                  <div style={styles.dateWrap}>
                    <Clock size={13} color="#94a3b8" />
                    <span>{new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    ...styles.statusBadge,
                    ...(isPaid ? styles.statusPaid : styles.statusPending)
                  }}>
                    <CheckCircle2 size={14} /> {order.status.toUpperCase()}
                  </span>
                  <div style={styles.totalPrice}>
                    ${Number(order.total).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div style={styles.timelineBox}>
                <div style={styles.timelineStep}>
                  <div style={{ ...styles.stepCircle, ...styles.stepActive }}>✓</div>
                  <span style={styles.stepText}>Order Placed</span>
                </div>
                <div style={styles.timelineLineActive} />
                <div style={styles.timelineStep}>
                  <div style={{ ...styles.stepCircle, ...styles.stepActive }}>✓</div>
                  <span style={styles.stepText}>Payment Confirmed</span>
                </div>
                <div style={styles.timelineLineActive} />
                <div style={styles.timelineStep}>
                  <div style={{ ...styles.stepCircle, ...styles.stepActive }}>
                    <Truck size={12} />
                  </div>
                  <span style={styles.stepText}>In Transit</span>
                </div>
              </div>

              {/* Items List */}
              <div style={styles.itemsSection}>
                <h4 style={styles.itemsHeader}>Ordered Items ({order.items.length})</h4>
                <div style={styles.itemsGrid}>
                  {order.items.map((item) => (
                    <div key={item.id} style={styles.itemRow}>
                      <div style={styles.itemIconCircle}>
                        <ShoppingBag size={18} color="#4f46e5" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={styles.itemName}>{item.product_name}</span>
                        <span style={styles.itemQty}>Quantity: {item.quantity}</span>
                      </div>
                      <div style={styles.itemSubtotal}>
                        ${Number(item.subtotal).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Summary */}
              {order.shipping_address && (
                <div style={styles.addressFooter}>
                  <MapPin size={16} color="#64748b" />
                  <span>Delivery Address: <strong>{order.shipping_address}</strong></span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  headerRow: {
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 4px',
  },
  pageSub: {
    fontSize: 14,
    color: '#64748b',
    margin: 0,
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
  },
  cardHeader: {
    padding: '20px 24px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  orderIdLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: '0.5px',
  },
  orderId: {
    fontSize: 18,
    fontWeight: 800,
    color: '#0f172a',
  },
  dateWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: 700,
  },
  statusPaid: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#b45309',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 800,
    color: '#0f172a',
    marginTop: 4,
  },
  timelineBox: {
    padding: '16px 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 600,
  },
  timelineStep: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#e2e8f0',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: {
    backgroundColor: '#4f46e5',
  },
  stepText: {
    fontSize: 12,
    fontWeight: 600,
    color: '#334155',
  },
  timelineLineActive: {
    flex: 1,
    height: 2,
    backgroundColor: '#4f46e5',
    margin: '0 12px',
  },
  itemsSection: {
    padding: '20px 24px',
  },
  itemsHeader: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 14px',
  },
  itemsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '10px 12px',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  itemIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0f172a',
    display: 'block',
  },
  itemQty: {
    fontSize: 12,
    color: '#64748b',
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0f172a',
  },
  addressFooter: {
    padding: '14px 24px',
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #f1f5f9',
    fontSize: 13,
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
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
