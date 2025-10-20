import React, { useState, useEffect } from "react";
import FloatingChatButton from "../Components/FloatingChatButton";
import Header from "@/Components/Header";
import AuthModal from "@/Components/AuthModal";
import ProductCard from "../Components/ProductCard";
import Toast from "../Components/Toast";
import "../../css/app.css";
// import Footer from "@/Components/Footer";


const categories = [
    { name: 'Electronics', slug: 'electronics', icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 21h8"/></svg> },
    { name: 'Books', slug: 'books', icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 7H20v13H6.5A2.5 2.5 0 0 1 4 17.5V4.5z"/></svg> },
    { name: 'Clothing', slug: 'clothing', icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 3l5 6-5 2-4-2-4 2-5-2 5-6"/><path d="M12 7v14"/></svg> },
    { name: 'Home', slug: 'home', icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9"/><rect x="6" y="12" width="12" height="8"/></svg> },
    { name: 'Toys', slug: 'toys', icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M2 12h2m16 0h2M12 2v2m0 16v2"/></svg> },
    { name: 'Groceries', slug: 'groceries', icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="13" rx="2"/><path d="M8 7V4a4 4 0 0 1 8 0v3"/></svg> },
    { name: 'Beauty', slug: 'beauty', icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="6" ry="8"/><path d="M12 2v20"/></svg> },
    { name: 'Sports', slug: 'sports', icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M4 12h16"/></svg> },
    { name: 'Automotive', slug: 'automotive', icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="7" rx="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg> },
    { name: 'Pets', slug: 'pets', icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="8" cy="8" r="2"/><circle cx="16" cy="8" r="2"/><ellipse cx="12" cy="16" rx="6" ry="4"/></svg> }
];





// ...existing code...

const Landing = () => {
    const [activeIdx, setActiveIdx] = useState(0);
    const activeCategory = categories[activeIdx];
    const [showModal, setShowModal] = useState(false);
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
    try {
        isLoggedIn = !!localStorage.getItem('user');
    } catch (e) {
        isLoggedIn = false;
    }

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
                <div className="authButtons">
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
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                initialTab={modalTab}
            />


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
