import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import HeroBanner from '../components/HeroBanner';
import { Search, ArrowUpDown, X, Layers } from 'lucide-react';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [ordering, setOrdering] = useState('');
  const [loading, setLoading] = useState(true);

  const catalogRef = useRef(null);

  useEffect(() => {
    setSearchQuery(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    api.get('categories/').then((res) => {
      setCategories(res.data.results || res.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery) params.search = searchQuery;
    if (ordering) params.ordering = ordering;

    api.get('products/', { params })
      .then((res) => {
        setProducts(res.data.results || res.data);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, ordering]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setOrdering('');
    setSearchParams({});
  };

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 24px 60px' }}>
      {/* Show Hero Banner when no search query or category is actively selected */}
      {!searchFromUrl && !selectedCategory && (
        <HeroBanner onExplore={scrollToCatalog} />
      )}

      {/* Catalog Header & Filters Toolbar */}
      <div ref={catalogRef} style={styles.catalogHeader}>
        <div>
          <h2 style={styles.catalogTitle}>
            {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory ? 'Filtered Products' : 'Featured Products'}
          </h2>
          <p style={styles.catalogSub}>
            Showing {products.length} {products.length === 1 ? 'product' : 'products'} available in store
          </p>
        </div>

        {/* Sort & Search Controls */}
        <div style={styles.controlsRow}>
          <div style={styles.sortSelectWrap}>
            <ArrowUpDown size={15} color="#64748b" />
            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              style={styles.sortSelect}
            >
              <option value="">Sort by: Featured</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-created_at">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div style={styles.categoryPillsBar}>
        <button
          onClick={() => setSelectedCategory('')}
          style={{
            ...styles.pillBtn,
            ...(!selectedCategory ? styles.pillBtnActive : {}),
          }}
        >
          <Layers size={14} /> All Categories
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id.toString())}
            style={{
              ...styles.pillBtn,
              ...(selectedCategory === c.id.toString() ? styles.pillBtnActive : {}),
            }}
          >
            {c.name}
          </button>
        ))}

        {(selectedCategory || searchQuery || ordering) && (
          <button onClick={handleClearFilters} style={styles.clearFiltersBtn}>
            <X size={14} /> Reset Filters
          </button>
        )}
      </div>

      {/* Product Grid / Loading State */}
      {loading ? (
        <div style={styles.grid}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} style={styles.skeletonCard}>
              <div className="skeleton" style={{ height: 180, borderRadius: 12, marginBottom: 14 }} />
              <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 20, width: '90%', marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 36, width: '100%', marginTop: 'auto', borderRadius: 8 }} />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIconWrap}>
            <Search size={40} color="#94a3b8" />
          </div>
          <h3 style={{ margin: '16px 0 6px', fontSize: 18, color: '#0f172a' }}>No products found</h3>
          <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 20px', maxWidth: 400, textAlign: 'center' }}>
            We couldn't find any items matching your criteria. Try adjusting your search query or filters.
          </p>
          <button className="btn-primary" onClick={handleClearFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  catalogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
    paddingTop: 10,
  },
  catalogTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  catalogSub: {
    fontSize: 13,
    color: '#64748b',
    margin: '4px 0 0',
  },
  controlsRow: {
    display: 'flex',
    gap: 12,
  },
  sortSelectWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: 10,
    padding: '6px 12px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
  },
  sortSelect: {
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 13,
    fontWeight: 600,
    color: '#0f172a',
    outline: 'none',
    cursor: 'pointer',
  },
  categoryPillsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    overflowX: 'auto',
    paddingBottom: 12,
    marginBottom: 24,
  },
  pillBtn: {
    backgroundColor: '#ffffff',
    color: '#475569',
    border: '1px solid #e2e8f0',
    borderRadius: 9999,
    padding: '8px 18px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.2s ease',
  },
  pillBtnActive: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    borderColor: '#4f46e5',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },
  clearFiltersBtn: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    border: '1px solid #fee2e2',
    borderRadius: 9999,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 24,
  },
  skeletonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    padding: 16,
    height: 340,
    display: 'flex',
    flexDirection: 'column',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    border: '1px solid #e2e8f0',
    padding: '60px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
