import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import {
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('products/', { params: { search: slug } })
      .then((res) => {
        const list = res.data.results || res.data;
        const found = list.find((p) => p.slug === slug) || list[0];
        setProduct(found || null);

        if (found?.category?.id) {
          api.get('products/', { params: { category: found.category.id } }).then((relRes) => {
            const relList = relRes.data.results || relRes.data;
            setRelatedProducts(relList.filter((p) => p.id !== found.id).slice(0, 4));
          });
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 24px' }}>
        <div className="skeleton" style={{ height: 24, width: 200, marginBottom: 24 }} />
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          <div className="skeleton" style={{ width: 450, height: 400, borderRadius: 20 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 32, width: '80%', marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 24, width: '40%', marginBottom: 24 }} />
            <div className="skeleton" style={{ height: 80, width: '100%', marginBottom: 24 }} />
            <div className="skeleton" style={{ height: 48, width: 200 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center', padding: 24 }}>
        <h2>Product Not Found</h2>
        <p style={{ color: '#64748b' }}>The requested product does not exist or has been removed.</p>
        <Link to="/" className="btn-primary" style={{ marginTop: 16 }}>
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      addToast('Please log in to add items to your cart.', 'info');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      addToast(`Added ${quantity}x "${product.name}" to cart!`, 'success');
    } catch {
      addToast('Failed to add product to cart.', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      addToast('Please log in to proceed to checkout.', 'info');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      navigate('/checkout');
    } catch {
      addToast('Failed to process buy now.', 'error');
    }
  };

  const mockRating = (4.4 + ((product.id * 5) % 6) / 10).toFixed(1);
  const mockReviewsCount = 38 + ((product.id * 17) % 200);

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: '24px 24px 60px' }}>
      {/* Breadcrumb Navigation */}
      <div style={styles.breadcrumb}>
        <Link to="/" style={styles.bcLink}>Catalog</Link>
        <ChevronRight size={14} color="#94a3b8" />
        <span style={styles.bcLink}>{product.category?.name || 'Category'}</span>
        <ChevronRight size={14} color="#94a3b8" />
        <span style={styles.bcActive}>{product.name}</span>
      </div>

      {/* Main Product Showcase Section */}
      <div style={styles.productGrid}>
        {/* Left: Product Image */}
        <div style={styles.imageCol}>
          <div style={styles.mainImageWrap}>
            <img
              src={product.image || 'https://via.placeholder.com/500?text=Product'}
              alt={product.name}
              style={styles.mainImage}
            />
            {product.category && (
              <span style={styles.categoryBadge}>{product.category.name}</span>
            )}
          </div>
        </div>

        {/* Right: Details & Purchase Actions */}
        <div style={styles.infoCol}>
          <h1 style={styles.title}>{product.name}</h1>

          {/* Rating */}
          <div style={styles.ratingRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} fill="#f59e0b" color="#f59e0b" />
              ))}
              <span style={{ fontSize: 14, fontWeight: 700, marginLeft: 4 }}>{mockRating}</span>
            </div>
            <span style={{ color: '#64748b', fontSize: 13 }}>•</span>
            <span style={{ fontSize: 13, color: '#64748b' }}>{mockReviewsCount} customer reviews</span>
          </div>

          {/* Price & Stock */}
          <div style={styles.priceRow}>
            <span style={styles.price}>${Number(product.price).toFixed(2)}</span>
            <span style={styles.stockBadge}>
              <CheckCircle2 size={14} color="#10b981" /> In Stock ({product.stock} items)
            </span>
          </div>

          <p style={styles.description}>
            {product.description || 'Designed for high performance and durability. Built using premium quality materials.'}
          </p>

          <div style={styles.divider} />

          {/* Quantity Selector */}
          <div style={styles.actionBlock}>
            <label style={styles.qtyLabel}>Quantity</label>
            <div style={styles.qtyControl}>
              <button
                style={styles.qtyBtn}
                disabled={quantity <= 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={14} />
              </button>
              <span style={styles.qtyValue}>{quantity}</span>
              <button
                style={styles.qtyBtn}
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={styles.btnRow}>
            <button
              className="btn-primary"
              style={styles.cartBtn}
              onClick={handleAddToCart}
              disabled={adding}
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button
              className="btn-secondary"
              style={styles.buyBtn}
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>

          {/* Product Guarantee Highlights */}
          <div style={styles.perksCard}>
            <div style={styles.perkItem}>
              <Truck size={18} color="#4f46e5" />
              <div>
                <strong style={styles.perkTitle}>Free Express Shipping</strong>
                <p style={styles.perkDesc}>Delivered within 2-4 business days</p>
              </div>
            </div>
            <div style={styles.perkItem}>
              <ShieldCheck size={18} color="#4f46e5" />
              <div>
                <strong style={styles.perkTitle}>1 Year Warranty</strong>
                <p style={styles.perkDesc}>Full manufacturer coverage</p>
              </div>
            </div>
            <div style={styles.perkItem}>
              <RotateCcw size={18} color="#4f46e5" />
              <div>
                <strong style={styles.perkTitle}>Hassle-Free Returns</strong>
                <p style={styles.perkDesc}>30 days money-back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div style={styles.relatedSection}>
          <h3 style={styles.relatedTitle}>You Might Also Like</h3>
          <div style={styles.relatedGrid}>
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    fontSize: 13,
  },
  bcLink: {
    color: '#64748b',
    textDecoration: 'none',
  },
  bcActive: {
    color: '#0f172a',
    fontWeight: 600,
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 40,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    border: '1px solid #e2e8f0',
    padding: 36,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
  },
  imageCol: {},
  mainImageWrap: {
    width: '100%',
    height: 420,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: 12,
    fontWeight: 700,
    padding: '6px 14px',
    borderRadius: 9999,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 12px',
    letterSpacing: '-0.5px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: 800,
    color: '#4f46e5',
  },
  stockBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    borderRadius: 9999,
    backgroundColor: '#dcfce7',
    color: '#15803d',
    fontSize: 12,
    fontWeight: 600,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 1.6,
    margin: '0 0 24px',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 24,
  },
  actionBlock: {
    marginBottom: 24,
  },
  qtyLabel: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: 8,
  },
  qtyControl: {
    display: 'inline-flex',
    alignItems: 'center',
    border: '1px solid #cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    padding: '10px 14px',
    color: '#475569',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  qtyValue: {
    padding: '0 16px',
    fontSize: 15,
    fontWeight: 700,
    color: '#0f172a',
  },
  btnRow: {
    display: 'flex',
    gap: 14,
    marginBottom: 32,
  },
  cartBtn: {
    flex: 1,
    padding: '14px 24px',
    fontSize: 15,
  },
  buyBtn: {
    flex: 1,
    padding: '14px 24px',
    fontSize: 15,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
  },
  perksCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    border: '1px solid #f1f5f9',
  },
  perkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  perkTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
    display: 'block',
  },
  perkDesc: {
    fontSize: 11,
    color: '#64748b',
    margin: 0,
  },
  relatedSection: {
    marginTop: 48,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: '#0f172a',
    marginBottom: 20,
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 20,
  },
};
