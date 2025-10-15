import React from "react";
import Header from "../Components/Header";

const BrowseShop = () => {
    const [shops, setShops] = React.useState([]);
    const [hoveredIdx, setHoveredIdx] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);
    const [sortField, setSortField] = React.useState('newest');
    const PAGE_SIZE = 20;

    // Fetch shops paginated
    const fetchShops = async (pageNum = 1, sort = sortField) => {
        const res = await fetch(`/api/shops`);
        let data = await res.json();
        // Sort client-side (can be moved to backend if needed)
        if (sort === 'name-asc') data.sort((a, b) => (a.ShopName || '').localeCompare(b.ShopName || ''));
        if (sort === 'name-desc') data.sort((a, b) => (b.ShopName || '').localeCompare(a.ShopName || ''));
        if (sort === 'newest') data.sort((a, b) => (b.ShopID || 0) - (a.ShopID || 0));
        if (data.length < PAGE_SIZE) setHasMore(false);
        if (pageNum === 1) {
            setShops(data);
        } else {
            setShops(prev => [...prev, ...data]);
        }
    };

    React.useEffect(() => {
        fetchShops(1, sortField);
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
            if (!hasMore) return;
            const { scrollTop, scrollHeight, clientHeight } = card;
            if (scrollHeight - scrollTop - clientHeight < 120) {
                setPage(prev => {
                    const nextPage = prev + 1;
                    fetchShops(nextPage, sortField);
                    return nextPage;
                });
            }
        };
        card.addEventListener('scroll', onScroll);
        return () => {
            card.removeEventListener('scroll', onScroll);
        };
    }, [hasMore, sortField, page]);

    return (
        <>
            <Header />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '32px', maxWidth: '1400px', width: '95%', marginLeft: 'auto', marginRight: 'auto' }}>
                {/* Filter Sidebar */}
                <aside style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '32px 24px', minWidth: '260px', maxWidth: '320px', marginRight: '32px', height: '600px' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '24px' }}>Shop Filters</h3>
                    {/* Shop Name Search */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Search</label>
                        <input type="text" placeholder="Shop name..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }} />
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
                    {/* Location Filter */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Location</label>
                        <input type="text" placeholder="e.g. Valenzuela, Manila" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }} />
                    </div>
                    {/* Tag Filter */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Tags</label>
                        <input type="text" placeholder="e.g. popular, new" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem' }} />
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
                    <h1 style={{ textAlign: 'left', fontSize: '2rem', fontWeight: 600, margin: 0, color: '#222' }}> Browse Shops</h1>
                    <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center' }}>
                        {shops.map((shop, idx) => {
                            const isHovered = hoveredIdx === idx;
                            return (
                                <div
                                    key={shop.ShopID || shop.ShopName}
                                    className={`shop-card${isHovered ? ' shop-card--hovered' : ''}`}
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                    onClick={() => window.location.href = `/shop/${shop.ShopID || ''}`}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '295px', // slightly larger width
                                        minHeight: '220px',
                                        boxSizing: 'border-box',
                                        margin: 0,
                                        position: 'relative',
                                        background: '#fff',
                                        borderRadius: '16px',
                                        boxShadow: isHovered ? '0 6px 32px rgba(46,204,113,0.18)' : '0 4px 24px rgba(0,0,0,0.10)',
                                        border: isHovered ? '2px solid #2ECC71' : '2px solid transparent',
                                        padding: '24px 18px',
                                        transition: 'box-shadow 0.2s, border 0.2s, transform 0.2s',
                                        transform: isHovered ? 'scale(1.045)' : 'scale(1)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <img
                                        src={shop.LogoImage || shop.LogoImage === '' ? shop.LogoImage : "https://via.placeholder.com/90x90?text=Shop"}
                                        alt={shop.ShopName}
                                        className="shop-image"
                                        style={{width:'90px',height:'90px',borderRadius:'50%',objectFit:'cover',marginBottom:'12px'}}
                                    />
                                    <div className="shop-name" style={{fontWeight:600,fontSize:'1.2rem',marginBottom:'6px'}}>{shop.ShopName}</div>
                                    <div className={`shop-info${isHovered ? ' shop-info--hidden' : ''}`} style={{marginBottom:'8px',color:'#555'}}>
                                        <div className="shop-location">{shop.Address || "Location Unknown"}</div>
                                    </div>
                                    <div style={{fontSize:'0.98rem',color:'#888',marginBottom:'8px'}}>{shop.ShopDescription}</div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Infinite scroll loader: can show a spinner here if desired */}
                </div>
            </div>
        </>
    );
};

export default BrowseShop;
