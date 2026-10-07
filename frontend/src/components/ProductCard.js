import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, Star, ImageOff, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Generate deterministic mock rating for presentation
  const mockRating = (4.3 + ((product.id * 7) % 7) / 10).toFixed(1);
  const mockReviews = 24 + ((product.id * 13) % 150);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addToast('Please log in to add items to your cart.', 'info');
      return;
    }

    setAdding(true);
    try {
      await addToCart(product.id, 1);
      addToast(`Added "${product.name}" to your cart!`, 'success');
    } catch {
      addToast('Failed to add item to cart.', 'error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={styles.cardWrapper} className="animate-fade-in">
      <Link to={`/products/${product.slug}`} style={styles.cardLink}>
        {/* Product Image Box */}
        <div style={styles.imageContainer}>
          {!imgError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={styles.image}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={styles.placeholder}>
              <ImageOff size={28} color="#94a3b8" />
              <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>No Preview</span>
            </div>
          )}

          {/* Category Pill on Image */}
          {product.category && (
            <span style={styles.categoryBadge}>{product.category.name}</span>
          )}

          {/* Stock Tag */}
          <span style={styles.stockTag}>
            <span style={styles.stockDot} /> In Stock ({product.stock})
          </span>
        </div>

        {/* Product Meta */}
        <div style={styles.infoBox}>
          {/* Star Rating */}
          <div style={styles.ratingRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{mockRating}</span>
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>({mockReviews} reviews)</span>
          </div>

          <h3 style={styles.title} title={product.name}>
            {product.name}
          </h3>

          <p style={styles.description}>
            {product.description || 'Premium quality product crafted with attention to detail.'}
          </p>

          <div style={styles.footerRow}>
            <div>
              <span style={styles.priceLabel}>Price</span>
              <div style={styles.price}>${Number(product.price).toFixed(2)}</div>
            </div>

            <button
              onClick={handleAdd}
              disabled={adding}
              style={{
                ...styles.addBtn,
                ...(adding ? styles.addBtnAdding : {}),
              }}
              title="Add to Cart"
            >
              {adding ? (
                <Check size={16} />
              ) : (
                <>
                  <ShoppingBag size={15} /> Add
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

const styles = {
  cardWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  imageContainer: {
    height: 190,
    backgroundColor: '#f8fafc',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(4px)',
    color: '#0f172a',
    fontSize: 11,
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: 9999,
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
  },
  stockTag: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(4px)',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
  infoBox: {
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 6px',
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  description: {
    fontSize: 12,
    color: '#64748b',
    margin: '0 0 16px',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footerRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 12,
    borderTop: '1px solid #f1f5f9',
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
  },
  price: {
    fontSize: 18,
    fontWeight: 800,
    color: '#0f172a',
  },
  addBtn: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: 10,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)',
  },
  addBtnAdding: {
    backgroundColor: '#10b981',
    boxShadow: 'none',
  },
};
