import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import FloatingChatButton from "../Components/FloatingChatButton";

const BrowseShop = () => {
    const [shops, setShops] = React.useState([]);
    const [nameSearch, setNameSearch] = React.useState('');
    const [hoveredIdx, setHoveredIdx] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);
    const [sortField, setSortField] = React.useState('newest');
    const [categoryFilter, setCategoryFilter] = React.useState('all');
    const [categories, setCategories] = React.useState([]);
    const [verifiedFilter, setVerifiedFilter] = React.useState('all'); // 'all', 'verified', 'unverified'
    const [loading, setLoading] = React.useState(true);
    const [scrollLoading, setScrollLoading] = React.useState(false);
    const PAGE_SIZE = 20;

    // Fetch shops paginated and resolve addresses
    const fetchShops = async (pageNum = 1, sort = sortField, isScroll = false, verified = verifiedFilter, category = categoryFilter) => {
        if (isScroll) setScrollLoading(true);
        else setLoading(true);
        // Always fetch all shops for category filtering (client-side)
        const res = await fetch(`/api/shops?page=${pageNum}&limit=${PAGE_SIZE}`);
        let data = await res.json();
    // Filter by verification status
    data = data.filter(shop => shop.Verification !== 'Rejected');
    if (verified === 'verified') data = data.filter(shop => shop.Verification === 'Verified');
    if (verified === 'unverified') data = data.filter(shop => shop.Verification === 'Pending');

        // Category filter: fetch all products and filter shops that have at least one product in the selected category
        if (category !== 'all') {
            try {
                const productsRes = await fetch('/api/products?limit=9999');
                const products = await productsRes.json();
                const shopIdsWithCategory = new Set(products.filter(p => String(p.CategoryID) === String(category)).map(p => p.ShopID));
                data = data.filter(shop => shopIdsWithCategory.has(shop.ShopID));
            } catch (e) { /* ignore */ }
        }

        // Sort client-side (can be moved to backend if needed)
        if (sort === 'name-asc') data.sort((a, b) => (a.ShopName || '').localeCompare(b.ShopName || ''));
        if (sort === 'name-desc') data.sort((a, b) => (b.ShopName || '').localeCompare(a.ShopName || ''));
        if (sort === 'newest') data.sort((b, a) => (a.ShopID || 0) - (b.ShopID || 0));
        // Fetch addresses for each shop
        const shopsWithAddress = await Promise.all(data.map(async shop => {
            let address = null;
            if (shop.AddressID) {
                try {
                    const addrRes = await fetch(`/api/addresses/${shop.AddressID}`);
                    if (addrRes.ok) {
                        address = await addrRes.json();
                        // Log the fetched address object
                        console.log('Fetched address for shop', shop.ShopID || shop.ShopName, address);
                    }
                } catch (e) { /* ignore */ }
            }
            // Compose address string: house number and street only
            let addressStr = 'Location Unknown';
            if (address) {
                const parts = [address.HouseNumber, address.Street].filter(Boolean);
                if (parts.length > 0) addressStr = parts.join(', ');
            }
            return { ...shop, Address: addressStr };
        }));
        if (data.length < PAGE_SIZE) setHasMore(false);
        if (pageNum === 1) {
            setShops(shopsWithAddress);
        } else {
            setShops(prev => [...prev, ...shopsWithAddress]);
        }
        if (isScroll) setScrollLoading(false);
        else setLoading(false);
    };

    React.useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchShops(1, sortField, false, verifiedFilter, categoryFilter);
    }, [sortField, verifiedFilter, categoryFilter]);

    // Fetch categories for filter dropdown
    React.useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(() => setCategories([]));
    }, []);

    const handleSortChange = (field) => {
        setSortField(field);
        setPage(1);
        setHasMore(true);
    };

    const handleVerifiedFilterChange = (e) => {
        setVerifiedFilter(e.target.value);
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
                    fetchShops(nextPage, sortField, true, verifiedFilter, categoryFilter);
                    return nextPage;
                });
            }
        };
        card.addEventListener('scroll', onScroll);
        return () => {
            card.removeEventListener('scroll', onScroll);
        };
    }, [hasMore, sortField, page, scrollLoading, verifiedFilter, categoryFilter]);

    return (
        <>
            <Header />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '32px', maxWidth: '1400px', width: '95%', marginLeft: 'auto', marginRight: 'auto' }}>
                {/* Filter Sidebar */}
                <aside style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '32px 24px', minWidth: '260px', maxWidth: '420px', marginRight: '32px', height: '835px' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '24px' }}>Filters</h3>
                    {/* Shop Name Search */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Search by Name</label>
                        <input
                            type="text"
                            placeholder="Shop name..."
                            value={nameSearch}
                            onChange={e => setNameSearch(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }}
                        />
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
                            <option value="name-asc">Name: A-Z</option>
                            <option value="name-desc">Name: Z-A</option>
                        </select>
                    </div>
                    {/* Category Filter */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Category</label>
                        <select
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }}
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            {categories.map(cat => (
                                <option key={cat.CategoryID} value={cat.CategoryID}>{cat.CategoryName}</option>
                            ))}
                        </select>
                    </div>
                    {/* Verified Filter */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Verified Status</label>
                        <select
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }}
                            value={verifiedFilter}
                            onChange={handleVerifiedFilterChange}
                        >
                            <option value="all">All</option>
                            <option value="verified">Verified</option>
                            <option value="unverified">Unverified</option>
                        </select>
                    </div>
                    {/* Apply Button */}
                    {/* <button
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
                    </button> */}
                </aside>
                {/* Main Card */}
                <div ref={cardRef} style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '40px 32px 32px 32px', minHeight: '120px', width: '100%', maxHeight: '845px', overflowY: 'auto' }}>
                    <h1 style={{ textAlign: 'left', fontSize: '2rem', fontWeight: 600, margin: 0, color: '#222' }}> Browse Shops</h1>
                    <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', minHeight: '120px' }}>
                        {loading ? (
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '220px' }}>
                                <div className="spinner" style={{ width: 48, height: 48, border: '6px solid #eee', borderTop: '6px solid #2ECC71', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
                            </div>
                        ) : (
                            shops.length === 0 ? (
                                <div style={{ width: '100%', textAlign: 'center', color: '#888', fontSize: '1.2rem', marginTop: '48px' }}>No shops found.</div>
                            ) : (
                                shops
                                    .filter(shop => nameSearch.trim() === '' || (shop.ShopName || '').toLowerCase().includes(nameSearch.trim().toLowerCase()))
                                    .map((shop, idx) => {
                                    const isHovered = hoveredIdx === idx;
                                    let bannerUrl = 'https://svgshare.com/i/13uA.svg';
                                    if (shop.BackgroundImage && typeof shop.BackgroundImage === 'string' && shop.BackgroundImage.trim() !== '') {
                                        bannerUrl = `/storage/${shop.BackgroundImage.replace(/^storage[\\/]+/, '')}`;
                                    }
                                    const logoUrl = shop.LogoImage ? `/storage/${(shop.LogoImage||'').replace(/^storage\//, '')}` : 'https://via.placeholder.com/120x120?text=Shop';
                                    return (
                                        <div
                                            key={shop.ShopID || shop.ShopName}
                                            className={`shop-card${isHovered ? ' shop-card--hovered' : ''}`}
                                            onMouseEnter={() => setHoveredIdx(idx)}
                                            onMouseLeave={() => setHoveredIdx(null)}
                                            onClick={() => window.location.href = `/shop/${shop.ShopID || ''}`}
                                            style={{
                                                width: '320px',
                                                minHeight: '260px',
                                                background: '#fff',
                                                borderRadius: '20px',
                                                boxShadow: isHovered ? '0 6px 32px rgba(46,204,113,0.18)' : '0 4px 24px rgba(0,0,0,0.10)',
                                                border: isHovered ? '2px solid #2ECC71' : '2px solid transparent',
                                                margin: 0,
                                                padding: 0,
                                                position: 'relative',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                transition: 'box-shadow 0.2s, border 0.2s, transform 0.2s',
                                                transform: isHovered ? 'scale(1.045)' : 'scale(1)',
                                                cursor: 'pointer',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {/* Verified/Unverified badge */}
                                            <div style={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 16,
                                                zIndex: 2,
                                                background: shop.Verification === 'Verified' ? '#eafff3' : '#fff3f3',
                                                color: shop.Verification === 'Verified' ? '#27ae60' : '#e74c3c',
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                padding: '4px 14px',
                                                borderRadius: '16px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                letterSpacing: '0.5px',
                                                userSelect: 'none',
                                                border: shop.Verification === 'Verified' ? '1.5px solid #2ecc71' : '1.5px solid #e74c3c',
                                                transition: 'background 0.2s, color 0.2s',
                                            }}>
                                                {shop.Verification === 'Verified' ? 'Verified' : 'Unverified'}
                                            </div>
                                            {/* Banner background */}
                                            <div style={{
                                                width: '100%',
                                                height: '100px',
                                                backgroundImage: `url(${bannerUrl})`,
                                                backgroundPosition: 'center',
                                                backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat',
                                                borderTopLeftRadius: '20px',
                                                borderTopRightRadius: '20px',
                                                position: 'relative',
                                            }}>
                                                {/* Logo - overlaps banner */}
                                                <div style={{
                                                    position: 'absolute',
                                                    left: '50%',
                                                    bottom: '-38px',
                                                    transform: 'translateX(-50%)',
                                                    width: '76px',
                                                    height: '76px',
                                                    borderRadius: '50%',
                                                    background: '#fff',
                                                    boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '4px solid #fff',
                                                }}>
                                                    <img
                                                        src={logoUrl}
                                                        alt={shop.ShopName}
                                                        style={{width:'68px',height:'68px',borderRadius:'50%',objectFit:'cover',background:'#eee'}}
                                                    />
                                                </div>
                                            </div>
                                            {/* Shop info below banner/logo */}
                                            <div style={{
                                                marginTop: '44px',
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                padding: '8px 0 4px 0',
                                            }}>
                                                <div className="shop-name" style={{fontWeight:700,fontSize:'1.2rem',marginBottom:'4px',textAlign:'center',textShadow:'0 2px 6px #fff'}}>{shop.ShopName}</div>
                                                <div className="shop-info" style={{marginBottom:'4px',color:'#555',fontSize:'1rem',textAlign:'center'}}>
                                                    {shop.Address || "Location Unknown"}
                                                </div>
                                                <div style={{fontSize:'0.98rem',color:'#888',marginBottom:'4px',textAlign:'center'}}>{shop.ShopDescription}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            )
                        )}
                        {scrollLoading && (
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80px' }}>
                                <div className="spinner" style={{ width: 32, height: 32, border: '5px solid #eee', borderTop: '5px solid #2ECC71', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <FloatingChatButton />
            <Footer />
        </>
    );
};

export default BrowseShop;
