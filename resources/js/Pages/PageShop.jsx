// ...existing imports and code...
// Dummy products for shop page
const dummyProducts = [
    {
        ProductID: 1,
        ProductName: "Sample Product 1",
        Price: 299,
        Image: "https://via.placeholder.com/90x90?text=Product+1"
    },
    {
        ProductID: 2,
        ProductName: "Sample Product 2",
        Price: 499,
        Image: "https://via.placeholder.com/90x90?text=Product+2"
    },
    {
        ProductID: 3,
        ProductName: "Sample Product 3",
        Price: 199,
        Image: "https://via.placeholder.com/90x90?text=Product+3"
    }
];
import React from "react";
import ProductCard from "../Components/ProductCard";
let usePage;
try {
    // Only import if available (Inertia context)
    usePage = require('@inertiajs/inertia-react').usePage;
} catch (e) {
    usePage = null;
}
// SVG icons for social media
const FacebookIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#4267B2"/><path d="M20.5 10.5h-2c-1.1 0-2 .9-2 2v2h-2v2.5h2v6h2.5v-6h2l.5-2.5h-2.5v-1.5c0-.3.2-.5.5-.5h2V10.5z" fill="#fff"/></svg>
);
const InstagramIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#E1306C"/><rect x="10" y="10" width="12" height="12" rx="4" fill="#fff"/><circle cx="16" cy="16" r="3" fill="#E1306C"/><circle cx="21" cy="13" r="1" fill="#E1306C"/></svg>
);
const TwitterIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#1DA1F2"/><path d="M22.5 13.1c-.6.3-1.2.5-1.9.6.7-.4 1.2-1 1.5-1.7-.7.4-1.4.7-2.2.9-.7-.7-1.7-1.1-2.7-1.1-2.1 0-3.7 1.7-3.7 3.7 0 .3 0 .6.1.9-3.1-.2-5.8-1.6-7.6-3.8-.3.6-.5 1.2-.5 1.9 0 1.3.7 2.4 1.7 3.1-.6 0-1.2-.2-1.7-.5v.1c0 1.8 1.3 3.3 3.1 3.6-.3.1-.7.2-1 .2-.2 0-.3 0-.5-.1.3 1.1 1.4 2 2.6 2-1 .8-2.2 1.2-3.5 1.2-.2 0-.4 0-.6 0 1.2.8 2.6 1.3 4.1 1.3 4.9 0 7.6-4.1 7.6-7.6v-.3c.5-.4 1-.9 1.3-1.5z" fill="#fff"/></svg>
);
const TikTokIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#000"/><path d="M20.5 12.5c-.7 0-1.5-.6-1.5-1.5V10h-2v8.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5c.1 0 .2 0 .5.1v-2c-.2 0-.3-.1-.5-.1-2 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5v-4.5c.5.4 1.2.7 2 .7v-2.2z" fill="#fff"/></svg>
);
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const placeholderShop = {
    ShopID: 20000001,
    ShopName: "Sample Shop",
    ShopDescription: "This is a sample shop description. It sells a variety of products and is known for great service.",
    LogoImage: "https://via.placeholder.com/120x120?text=Logo",
    BackgroundImage: "https://via.placeholder.com/600x200?text=Shop+Banner",
    Address: "123 Main St, Valenzuela, Manila",
    BusinessPermit: "BP-2025-0001",
    isVerified: true,
    hasPhysical: false,
    UserID: 10000001
};

const ShopPage = () => {
    let shopId = null;
    if (usePage) {
        try {
            const { props } = usePage();
            shopId = props.shopId;
        } catch (e) {
            shopId = null;
        }
    }
    // Fallback: parse from URL if not in Inertia context
    if (!shopId && typeof window !== 'undefined') {
        const match = window.location.pathname.match(/\/shop\/(\d+)/);
        if (match) shopId = match[1];
    }
    const [shop, setShop] = React.useState(null);
    React.useEffect(() => {
        if (!shopId) return;
        fetch(`/api/shops?id=${shopId}`)
            .then(res => res.json())
            .then(data => {
                // If backend returns array, find the correct shop
                let s = Array.isArray(data) ? data.find(x => x.ShopID == shopId || x.id == shopId) : data;
                setShop(s || null);
            })
            .catch(() => setShop(null));
    }, [shopId]);
    // Use placeholder for missing fields
    const shopData = shop || placeholderShop;
    // Products for this shop
    const [products, setProducts] = React.useState(null); // null = not loaded yet, [] = loaded empty
    const [loadingProducts, setLoadingProducts] = React.useState(false);
    const [hoveredIdx, setHoveredIdx] = React.useState(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const PRODUCTS_PER_PAGE = 8;

    React.useEffect(() => {
        // If no shopId, don't fetch and keep placeholder products
        if (!shopId) {
            setProducts(null);
            setLoadingProducts(false);
            return;
        }
        setLoadingProducts(true);
        fetch(`/api/products?shopId=${shopId}`)
            .then(res => res.json())
            .then(async data => {
                // Normalize response to array
                let arr = [];
                if (Array.isArray(data)) arr = data;
                else if (Array.isArray(data.data)) arr = data.data;
                else if (Array.isArray(data.products)) arr = data.products;
                // Ensure only products for this shop are used (API may ignore shopId param)
                // Log for debugging
                console.log('Fetched products:', arr, 'Current shopId:', shopId);
                // Compare as numbers for ShopID
                const shopIdNum = Number(shopId);
                const filtered = arr.filter(p => {
                    const candidate = p.ShopID || p.shopId || p.shop_id || p.Shop || p.shop || p.UserShopID || p.seller_id;
                    if (candidate === undefined || candidate === null) return false;
                    // Compare as number if possible
                    return Number(candidate) === shopIdNum;
                });
                // Fetch average ratings for these products
                const ids = filtered.map(p => p.ProductID).join(',');
                let ratingsMap = {};
                if (ids) {
                    try {
                        const ratingsRes = await fetch(`/api/reviews/average-ratings?productIds=${ids}`);
                        ratingsMap = await ratingsRes.json();
                    } catch (e) { ratingsMap = {}; }
                }
                // Attach avgRating to each product
                filtered.forEach(p => {
                    p.avgRating = ratingsMap[p.ProductID]?.avg || null;
                });
                setProducts(filtered);
                setLoadingProducts(false);
            })
            .catch(() => {
                setProducts([]);
                setLoadingProducts(false);
            });
    }, [shopId]);
    // Fix logo and background image paths
    let logoUrl = shopData.LogoImage;
    if (logoUrl && typeof logoUrl === 'string' && !logoUrl.startsWith('http')) {
        logoUrl = `/storage/${logoUrl.replace(/^storage[\\/]+/, '')}`;
    }
    if (!logoUrl) logoUrl = 'https://via.placeholder.com/120x120?text=Logo';
    let bgUrl = shopData.BackgroundImage;
    if (bgUrl && typeof bgUrl === 'string' && !bgUrl.startsWith('http')) {
        bgUrl = `/storage/${bgUrl.replace(/^storage[\\/]+/, '')}`;
    }
    if (!bgUrl) bgUrl = 'https://via.placeholder.com/600x200?text=Shop+Banner';
    return (
        <>
            <Header />
            <div style={{ maxWidth: '1400px', margin: '40px auto', background: '#fff', borderRadius: '18px', boxShadow: '0 10px 48px rgba(0,0,0,0.13)', overflow: 'hidden' }}>
                {/* Banner */}
                <div style={{ width: '100%', height: '200px', background: `url(${bgUrl}) center/cover`, position: 'relative' }}>
                    <img src={logoUrl} alt="Shop Logo" style={{ position: 'absolute', left: '32px', bottom: '-60px', width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
                </div>
                <div style={{ padding: '80px 40px 32px 40px' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '8px', color: '#222' }}>{shopData.ShopName}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '18px' }}>
                        <span style={{ fontWeight: 500, color: '#2ECC71', fontSize: '1.1rem' }}>{shopData.isVerified ? 'Verified' : 'Unverified'}</span>
                        <span style={{ fontWeight: 500, color: '#888', fontSize: '1rem' }}>{shopData.hasPhysical ? 'Physical Store Available' : 'Online Only'}</span>
                        <span style={{ fontWeight: 500, color: '#888', fontSize: '1rem' }}>Business Permit: {shopData.BusinessPermit}</span>
                    </div>
                    <div style={{ marginBottom: '18px', color: '#555', fontSize: '1.08rem' }}>{shopData.ShopDescription}</div>
                    <div style={{ marginBottom: '8px', color: '#444', fontWeight: 500 }}>
                        <span>Address: {shopData.Address}</span>
                    </div>
                    <div style={{ marginBottom: '8px', color: '#444', fontWeight: 500 }}>
                        <span>Owner UserID: {shopData.UserID}</span>
                    </div>
                    <div style={{ marginBottom: '8px', display: 'flex', gap: '18px', alignItems: 'center' }}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook"><FacebookIcon /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram"><InstagramIcon /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter"><TwitterIcon /></a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" title="TikTok"><TikTokIcon /></a>
                    </div>
                </div>
            </div>
            {/* Recent Reviews Card */}
            <div style={{ maxWidth: '1400px', margin: '32px auto 0 auto', background: '#fff', borderRadius: '18px', boxShadow: '0 6px 32px rgba(0,0,0,0.10)', overflow: 'hidden', padding: '32px 40px', position: 'relative', minHeight: '180px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '18px', color: '#222' }}>Recent Reviews</h2>
                {/* Carousel for reviews */}
                {(() => {
                    // Aggregate all reviews from all products
                    let allReviews = [];
                    dummyProducts.forEach(product => {
                        if (product.reviews && Array.isArray(product.reviews)) {
                            product.reviews.forEach(r => {
                                allReviews.push({
                                    ...r,
                                    productName: product.ProductName || product.name || 'Product'
                                });
                            });
                        }
                    });
                    // Sort by date if available, else as is (most recent first)
                    allReviews = allReviews.sort((a, b) => {
                        if (a.date && b.date) return new Date(b.date) - new Date(a.date);
                        return 0;
                    });
                    const reviewsToShow = allReviews.slice(0, 5);
                    const [current, setCurrent] = React.useState(0);
                    React.useEffect(() => {
                        if (reviewsToShow.length <= 1) return;
                        const timer = setInterval(() => {
                            setCurrent(prev => (prev + 1) % reviewsToShow.length);
                        }, 3000);
                        return () => clearInterval(timer);
                    }, [reviewsToShow.length]);
                    if (reviewsToShow.length === 0) {
                        return (
                            <div style={{ textAlign: 'center', color: '#888', fontSize: '1.1rem', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                No recent reviews
                            </div>
                        );
                    }
                    const review = reviewsToShow[current] || reviewsToShow[0];
                    return (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '120px', transition: 'all 0.5s' }}>
                            <div style={{ background: '#f8f8f8', borderRadius: '12px', padding: '24px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minWidth: '340px', maxWidth: '600px', width: '100%', textAlign: 'left' }}>
                                <div style={{ fontWeight: 600, fontSize: '1.08rem', marginBottom: '6px' }}>{review.name}</div>
                                <div style={{ color: '#2ECC71', fontWeight: 500, marginBottom: '4px' }}>{review.rating}</div>
                                <div style={{ color: '#444' }}>{review.text}</div>
                                <div style={{ color: '#888', fontSize: '0.95rem', marginTop: '8px' }}>Product: {review.productName}</div>
                            </div>
                        </div>
                    );
                })()}
            </div>
            {/* Product List Section */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '32px', maxWidth: '1400px', width: '95%', marginLeft: 'auto', marginRight: 'auto' }}>
                {/* Filter Sidebar */}
                <aside style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '32px 24px', minWidth: '260px', maxWidth: '320px', marginRight: '32px', height: '750px' }}>
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
                        <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }}>
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
                    {/* Tags */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Tags</label>
                        <input type="text" placeholder="e.g. sale, new, popular" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }} />
                    </div>
                    {/* Apply Button */}
                    <button style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#2ECC71', color: '#fff', fontWeight: 600, fontSize: '1rem', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer', marginTop: '8px', transition: 'background 0.2s' }}>Apply</button>
                </aside>
                {/* Main Card */}
                <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '40px 32px 32px 32px', minHeight: '120px', width: '100%', maxHeight: '845px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                        <h1 style={{ textAlign: 'left', fontSize: '2rem', fontWeight: 600, margin: 0, color: '#222' }}>Shop Products</h1>
                        <span style={{ fontSize: '1.08rem', color: '#888', fontWeight: 400, marginLeft: '4px' }}>
                            {loadingProducts ? '' : ((products ? products.length : dummyProducts.length) + ' product' + ((products ? products.length : dummyProducts.length) === 1 ? '' : 's'))}
                        </span>
                    </div>
                    <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center' }}>
                        {loadingProducts ? (
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '220px' }}>
                                <div className="spinner" style={{ width: 48, height: 48, border: '6px solid #eee', borderTop: '6px solid #2ECC71', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
                            </div>
                        ) : (products && products.length === 0) ? (
                            <div style={{ width: '100%', textAlign: 'center', padding: '40px 0', color: '#888' }}>No products found.</div>
                        ) : (() => {
                            const allProducts = products || dummyProducts;
                            const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
                            const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
                            const pageProducts = allProducts.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);
                            return <>
                                {pageProducts.map((product, idx) => {
                                    const globalIdx = startIdx + idx;
                                    return (
                                        <ProductCard
                                            key={product.ProductID || product.name}
                                            product={product}
                                            isHovered={hoveredIdx === globalIdx}
                                            onMouseEnter={() => setHoveredIdx(globalIdx)}
                                            onMouseLeave={() => setHoveredIdx(null)}
                                            onClick={() => window.location.href = `/product/${product.ProductID || ''}`}
                                            style={{textAlign: 'center', width: '100%', cursor: 'pointer'}}
                                            buttonProps={{
                                                onAddToCart: (e, product) => {},
                                                onBuyNow: (e, product) => {},
                                            }}
                                        />
                                    );
                                })}
                                {/* Paginator UI */}
                                {totalPages > 1 && (
                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                style={{ background: 'none', border: 'none', color: '#2ECC71', fontSize: 24, cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}
                                                aria-label="Previous page"
                                            >&#x2039;</button>
                                            {/* Dots */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                {Array.from({ length: totalPages }).map((_, i) => (
                                                    <span key={i} style={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: '50%',
                                                        background: i + 1 === currentPage ? '#2ECC71' : '#ddd',
                                                        display: 'inline-block',
                                                        transition: 'background 0.2s'
                                                    }} />
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                style={{ background: 'none', border: 'none', color: '#2ECC71', fontSize: 24, cursor: currentPage === totalPages ? 'default' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}
                                                aria-label="Next page"
                                            >&#x203A;</button>
                                        </div>
                                        <div style={{ color: '#2ECC71', fontWeight: 600, marginTop: 8, fontSize: '1.1rem' }}>
                                            Page {currentPage} of {totalPages}
                                        </div>
                                    </div>
                                )}
                            </>;
                        })()}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ShopPage;
