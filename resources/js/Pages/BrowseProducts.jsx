

import React from "react";
import Header from "../Components/Header";



const BrowseProducts = () => {

    const [products, setProducts] = React.useState([]);
    const [hoveredIdx, setHoveredIdx] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);
    const [sortField, setSortField] = React.useState('newest');
    const [loading, setLoading] = React.useState(true);
    const [scrollLoading, setScrollLoading] = React.useState(false);
    const PAGE_SIZE = 20;

    // Fetch products paginated
    const fetchProducts = async (pageNum = 1, sort = sortField, isScroll = false) => {
        if (isScroll) setScrollLoading(true);
        else setLoading(true);
        const res = await fetch(`/api/products?page=${pageNum}&limit=${PAGE_SIZE}`);
        let data = await res.json();
        // Fetch average ratings for these products
        const ids = data.map(p => p.ProductID).join(',');
        let ratingsMap = {};
        if (ids) {
            try {
                const ratingsRes = await fetch(`/api/reviews/average-ratings?productIds=${ids}`);
                ratingsMap = await ratingsRes.json();
            } catch (e) { ratingsMap = {}; }
        }
        // Attach avgRating to each product
        data.forEach(p => {
            p.avgRating = ratingsMap[p.ProductID]?.avg || null;
        });
        // Sort client-side (can be moved to backend if needed)
        if (sort === 'price-asc') data.sort((a, b) => (a.Price || 0) - (b.Price || 0));
        if (sort === 'price-desc') data.sort((a, b) => (b.Price || 0) - (a.Price || 0));
        if (sort === 'name-asc') data.sort((a, b) => (a.ProductName || '').localeCompare(b.ProductName || ''));
        if (sort === 'name-desc') data.sort((a, b) => (b.ProductName || '').localeCompare(a.ProductName || ''));
        // Newest: assume ProductID is incrementing
        if (sort === 'newest') data.sort((a, b) => (b.ProductID || 0) - (a.ProductID || 0));
        if (data.length < PAGE_SIZE) setHasMore(false);
        if (pageNum === 1) {
            setProducts(data);
        } else {
            setProducts(prev => [...prev, ...data]);
        }
        if (isScroll) setScrollLoading(false);
        else setLoading(false);
    };

    React.useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchProducts(1, sortField);
    }, [sortField]);

    const handleSortChange = (field) => {
        setSortField(field);
        setPage(1);
        setHasMore(true);
    };

    // Infinite scroll logic
    const cardRef = React.useRef(null);
    React.useEffect(() => {
        if (!hasMore) return;
        const card = cardRef.current;
        if (!card) return;
        const onScroll = () => {
            if (!hasMore || scrollLoading) return;
            const { scrollTop, scrollHeight, clientHeight } = card;
            if (scrollHeight - scrollTop - clientHeight < 120) {
                setPage(prev => {
                    const nextPage = prev + 1;
                    fetchProducts(nextPage, sortField, true);
                    return nextPage;
                });
            }
        };
        card.addEventListener('scroll', onScroll);
        return () => {
            card.removeEventListener('scroll', onScroll);
        };
    }, [hasMore, sortField, page, scrollLoading]);

    return (
        <>
            <Header />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '32px', maxWidth: '1400px', width: '95%', marginLeft: 'auto', marginRight: 'auto' }}>
                {/* Filter Sidebar */}
                <aside style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '32px 24px', minWidth: '260px', maxWidth: '320px', marginRight: '32px', height: '835px' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '24px' }}>Filters</h3>
                    {/* Category */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Category</label>
                        <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }}>
                            <option>All</option>
                            <option>Electronics</option>
                            <option>Books</option>
                            <option>Clothing</option>
                            <option>Home</option>
                            <option>Toys</option>
                            <option>Groceries</option>
                            <option>Beauty</option>
                            <option>Sports</option>
                            <option>Automotive</option>
                            <option>Pets</option>
                        </select>
                    </div>

                    {/* Sort Section */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Sort By</label>
                        <select
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }}
                            value={sortField}
                            onChange={e => handleSortChange(e.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A-Z</option>
                            <option value="name-desc">Name: Z-A</option>
                        </select>
                    </div>
                    {/* Product Name Search */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Search</label>
                        <input type="text" placeholder="Product name..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }} />
                    </div>
                    {/* Price Range */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Min Price</label>
                            <input type="number" placeholder="₱0" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Max Price</label>
                            <input type="number" placeholder="₱99999" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }} />
                        </div>
                    </div>
                    {/* Rating */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Rating</label>
                        <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }}>
                            <option value="">Any</option>
                            <option value="5">5 ★</option>
                            <option value="4">4 ★ & up</option>
                            <option value="3">3 ★ & up</option>
                            <option value="2">2 ★ & up</option>
                            <option value="1">1 ★ & up</option>
                        </select>
                    </div>
                    {/* Shop Location */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Shop Location</label>
                        <input type="text" placeholder="e.g. Valenzuela, Manila" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }} />
                    </div>
                    {/* Tags */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Tags</label>
                        <input type="text" placeholder="e.g. sale, new, popular" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }} />
                    </div>
                    {/* Apply Button */}
                    <button
                        onMouseEnter={e => e.currentTarget.style.background = '#229954'}
                        onMouseLeave={e => e.currentTarget.style.background = '#2ECC71'}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            background: '#2ECC71',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '1rem',
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            cursor: 'pointer',
                            marginTop: '8px',
                            transition: 'background 0.2s'
                        }}
                    >
                        Apply
                    </button>
                </aside>
                {/* Main Card */}
                <div ref={cardRef} style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '40px 32px 32px 32px', minHeight: '120px', width: '100%', maxHeight: '845px', overflowY: 'auto' }}>
                    <h1 style={{ textAlign: 'left', fontSize: '2rem', fontWeight: 600, margin: 0, color: '#222' }}> Browse Products</h1>
                    <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', minHeight: '120px' }}>
                        {loading ? (
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '220px' }}>
                                <div className="spinner" style={{ width: 48, height: 48, border: '6px solid #eee', borderTop: '6px solid #2ECC71', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
                            </div>
                        ) : (
                            products.length === 0 ? (
                                <div style={{ width: '100%', textAlign: 'center', color: '#888', fontSize: '1.2rem', marginTop: '48px' }}>No products found.</div>
                            ) : (
                                products.map((product, idx) => {
                                    const isHovered = hoveredIdx === idx;
                                    const rating = product.avgRating != null ? product.avgRating : 0;
                                    let sold = 0;
                                    if (product.BoughtBy) {
                                        try {
                                            const arr = typeof product.BoughtBy === 'string' ? JSON.parse(product.BoughtBy) : product.BoughtBy;
                                            if (Array.isArray(arr)) sold = arr.length;
                                        } catch (e) { sold = 0; }
                                    }
                                    return (
                                        <div
                                            key={product.ProductID || product.name}
                                            className={`product-card${isHovered ? ' product-card--hovered' : ''}`}
                                            onMouseEnter={() => setHoveredIdx(idx)}
                                            onMouseLeave={() => setHoveredIdx(null)}
                                            onClick={() => window.location.href = `/product/${product.ProductID || ''}`}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                                height: '100%',
                                                boxSizing: 'border-box',
                                                margin: 0,
                                                position: 'relative',
                                            }}
                                        >
                                            <img
                                                src={product.Image || product.image || "https://via.placeholder.com/90x90?text=Product"}
                                                alt={product.ProductName || product.name}
                                                className="product-image"
                                            />
                                            <div className="product-name">{product.ProductName || product.name}</div>
                                            <div className={`product-info${isHovered ? ' product-info--hidden' : ''}`}> 
                                                <div className="product-price">₱{(product.Price || product.price || 0).toLocaleString()}</div>
                                                <div className="product-rating">
                                                    <span className="product-rating-stars" style={{fontWeight:600}}>
                                                        ★{rating} <span style={{color:'#888',margin:'0 6px'}}>|</span> <span className="product-sold">{sold} Sold</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`product-buttons${isHovered ? ' product-buttons--visible' : ''}`}> 
                                                <button className="add-to-cart-btn" onClick={e => e.stopPropagation()}>Add to Cart</button>
                                                <button className="buy-now-btn" onClick={e => e.stopPropagation()}>Buy Now</button>
                                            </div>
                                        </div>
                                    );
                                })
                            )
                        )}
                        {scrollLoading && (
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80px' }}>
                                <div className="spinner" style={{ width: 32, height: 32, border: '5px solid #eee', borderTop: '5px solid #2ECC71', borderRadius: '50%', animation: 'spin-scroll 0.7s linear infinite' }} />
                                <style>{`@keyframes spin-scroll { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BrowseProducts;
