
import React, { useState, useEffect } from "react";
import FloatingChatButton from "../Components/FloatingChatButton";
import Header from "@/Components/Header";
import ShopListModal from "../Components/ShopListModal";
import CreateShop from "../Components/CreateShop";
import AuthModal from "@/Components/AuthModal";
import ProductCard from "../Components/ProductCard";
import Toast from "../Components/Toast";
import "../../css/app.css";
// import Footer from "@/Components/Footer";
// Icon imports
import { FaLaptop, FaBook, FaTshirt, FaHome, FaPuzzlePiece, FaAppleAlt, FaSpa, FaFootballBall, FaCar, FaDog } from "react-icons/fa";


const categories = [
    { name: 'Electronics', slug: 'electronics', icon: <FaLaptop size={28} /> },
    { name: 'Books', slug: 'books', icon: <FaBook size={28} /> },
    { name: 'Clothing', slug: 'clothing', icon: <FaTshirt size={28} /> },
    { name: 'Home', slug: 'home', icon: <FaHome size={28} /> },
    { name: 'Toys', slug: 'toys', icon: <FaPuzzlePiece size={28} /> },
    { name: 'Groceries', slug: 'groceries', icon: <FaAppleAlt size={28} /> },
    { name: 'Beauty', slug: 'beauty', icon: <FaSpa size={28} /> },
    { name: 'Sports', slug: 'sports', icon: <FaFootballBall size={28} /> },
    { name: 'Automotive', slug: 'automotive', icon: <FaCar size={28} /> },
    { name: 'Pets', slug: 'pets', icon: <FaDog size={28} /> },
];





// ...existing code...

const Landing = () => {
    const [activeIdx, setActiveIdx] = useState(0);
    const activeCategory = categories[activeIdx];
    const [showModal, setShowModal] = useState(false);
    const [showShopModal, setShowShopModal] = useState(false);
    const [showCreateShop, setShowCreateShop] = useState(false);
    const [shops, setShops] = useState([]);
    const [shopsLoading, setShopsLoading] = useState(false);
    const [modalTab, setModalTab] = useState('login'); // 'login' or 'register'
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [productsByCategory, setProductsByCategory] = useState({});
    // Toast state for notifications
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Fetch products from API and organize by category
    useEffect(() => {
    fetch('/api/products?limit=9999')
        .then(res => res.json())
        .then(async data => {
            // Fetch average ratings for all products
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
            // Group products by category slug
            const grouped = {};
            data.forEach(product => {
                // Find category slug by name
                const cat = categories.find(c => c.name.toLowerCase() === (product.CategoryName || product.category)?.toLowerCase());
                if (cat) {
                    if (!grouped[cat.slug]) grouped[cat.slug] = [];
                    grouped[cat.slug].push(product);
                }
            });
            // For each category, randomize and limit to 10 products
            Object.keys(grouped).forEach(slug => {
                grouped[slug] = grouped[slug]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 10);
            });
            setProductsByCategory(grouped);
        })
        .catch(() => setProductsByCategory({}));
    }, []);

    // Auto-move carousel every 2.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIdx(idx => (idx + 1) % categories.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [showModal]);

    // Check if user is logged in
    let isLoggedIn = false;
    let userId = null;
    try {
        isLoggedIn = !!localStorage.getItem('user');
        const userData = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('user')) : null;
        userId = userData && (userData.UserID || userData.id);
    } catch (e) {
        isLoggedIn = false;
        userId = null;
    }

    // Fetch shops for userId when shop modal opens
    useEffect(() => {
        if (showShopModal && userId) {
            setShopsLoading(true);
            fetch(`http://127.0.0.1:8000/api/shops?user_id=${userId}`)
                .then(res => res.json())
                .then(data => {
                    const mapped = Array.isArray(data)
                        ? data.filter(shop => shop.UserID == userId)
                            .map(shop => ({
                                id: shop.ShopID || shop.id,
                                name: shop.ShopName || shop.name,
                                logoUrl: shop.LogoImage ? `/storage/${shop.LogoImage.replace(/^storage\//, '')}` : shop.logoUrl,
                            }))
                        : [];
                    setShops(mapped);
                    setShopsLoading(false);
                })
                .catch(() => {
                    setShops([]);
                    setShopsLoading(false);
                });
        }
        if (!showShopModal) {
            setShops([]);
            setShopsLoading(false);
        }
    }, [showShopModal, userId]);

    return (
        <>
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
            <Header />
            {/* Hero Section */}
            <section className="heroSection">
                <h1 className="heroTitle">Experience Community Commerce at its Finest</h1>
                <h3 className="heroSubtitle">Your gateway to local treasures in Barangay Gen T. De Leon</h3>
                <div className="authButtons" style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
                    {/* Sell Now button only visible when logged in */}
                    {isLoggedIn && (
                        <button
                            className="registerBtn"
                            style={{ marginRight: 0 }}
                            onClick={() => setShowShopModal(true)}
                        >
                            Sell Now
                        </button>
                    )}
                    {!isLoggedIn ? (
                        <>
                            <button className="registerBtn" onClick={() => { setShowModal(true); setModalTab('register'); }}>Register</button>
                            <button className="loginBtn" onClick={() => { setShowModal(true); setModalTab('login'); }}>Login</button>
                        </>
                    ) : (
                        <button className="loginBtn" onClick={() => window.location.href = '/browse'}>Shop Now</button>
                    )}
                </div>
            </section>

            <AuthModal
                isOpen={showModal === true}
                onClose={() => setShowModal(false)}
                initialTab={modalTab}
            />
            {/* Shop List Modal (actual modal, like in Header) */}
            <ShopListModal
                open={showShopModal && !showCreateShop}
                onClose={() => setShowShopModal(false)}
                onOpenCreateShop={() => setShowCreateShop(true)}
                shops={shops}
                shopsLoading={shopsLoading}
            />
            {showCreateShop && (
                <CreateShop
                    onClose={() => setShowCreateShop(false)}
                    onShopCreated={() => {
                        setShowCreateShop(false);
                        setShowShopModal(true);
                    }}
                />
            )}


            {/* Categories Carousel Section */}
            <section className="categoryListSection">
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '1.5rem'}}>
                    <h3 className="categoryListTitle" style={{marginBottom: 0}}>Shop by Category</h3>
                    <div className="section-divider"></div>
                </div>
                <div className="categoryCarousel">
                    {categories.map((category, idx) => (
                        <div
                            key={category.slug}
                            className={`categoryCard${idx === activeIdx ? ' active' : ''}`}
                            onClick={() => setActiveIdx(idx)}
                        >
                            <span className="categoryIcon">{category.icon}</span>
                            {category.name}
                        </div>
                    ))}
                </div>
            </section>

            {/* Shop Items Section */}
            <section className="shopItemsSection">
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '1.2rem'}}>
                    <h3 className="shopItemsTitle" style={{marginBottom: 0}}>{activeCategory.name} Items</h3>
                    <div className="section-divider"></div>
                </div>
                <div className="shopItemsGrid" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2rem',
                    width: '100%',
                    margin: '0 auto',
                    minHeight: '520px',
                    maxWidth: '1200px',
                }}>
                    {(productsByCategory[activeCategory.slug] || []).map((item, idx) => {
                        return (
                            <ProductCard
                                key={item.ProductID || item.name}
                                product={item}
                                isHovered={hoveredIdx === idx}
                                onMouseEnter={() => setHoveredIdx(idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                                onClick={() => window.location.href = `/product/${item.ProductID || ''}`}
                                style={{textAlign: 'center', width: '100%'}}
                                // Do not pass setToast here so landing page won't show 'Added to cart' toast
                            />
                        );
                    })}
                </div>
                <div className="viewMoreWrapper">
                    <button className="viewMoreBtn" onClick={() => window.location.href = '/browse'}>View more</button>
                </div>
            </section>
            

            {/* Footer Section */}
            <footer className="footerSection">
                <div className="footerText">© {new Date().getFullYear()} Barangay Gen T. De Leon Marketplace. All rights reserved.</div>
            </footer>

                {/* Floating Chat Button */}
                <FloatingChatButton onClick={() => alert('Open chat window')} />
        </>
    );
};

export default Landing;
