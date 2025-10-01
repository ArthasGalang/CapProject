import React, { useState, useEffect } from "react";
import Header from "@/Components/Header";
import AuthModal from "@/Components/AuthModal";
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



// Mock shop items by category
const shopItems = {
    electronics: [
        { name: 'Smartphone', price: '₱8,000', image: 'https://via.placeholder.com/80?text=Phone' },
        { name: 'Laptop', price: '₱25,000', image: 'https://via.placeholder.com/80?text=Laptop' },
        { name: 'Headphones', price: '₱1,200', image: 'https://via.placeholder.com/80?text=Headphones' },
    ],
    books: [
        { name: 'Novel', price: '₱350', image: 'https://via.placeholder.com/80?text=Novel' },
        { name: 'Textbook', price: '₱500', image: 'https://via.placeholder.com/80?text=Textbook' },
        { name: 'Comics', price: '₱200', image: 'https://via.placeholder.com/80?text=Comics' },
    ],
    clothing: [
        { name: 'T-Shirt', price: '₱150', image: 'https://via.placeholder.com/80?text=TShirt' },
        { name: 'Jeans', price: '₱400', image: 'https://via.placeholder.com/80?text=Jeans' },
        { name: 'Jacket', price: '₱800', image: 'https://via.placeholder.com/80?text=Jacket' },
    ],
    home: [
        { name: 'Chair', price: '₱600', image: 'https://via.placeholder.com/80?text=Chair' },
        { name: 'Table', price: '₱1,200', image: 'https://via.placeholder.com/80?text=Table' },
        { name: 'Lamp', price: '₱350', image: 'https://via.placeholder.com/80?text=Lamp' },
    ],
    toys: [
        { name: 'Toy Car', price: '₱120', image: 'https://via.placeholder.com/80?text=ToyCar' },
        { name: 'Doll', price: '₱180', image: 'https://via.placeholder.com/80?text=Doll' },
        { name: 'Puzzle', price: '₱90', image: 'https://via.placeholder.com/80?text=Puzzle' },
    ],
    groceries: [
        { name: 'Rice', price: '₱50/kg', image: 'https://via.placeholder.com/80?text=Rice' },
        { name: 'Eggs', price: '₱80/dozen', image: 'https://via.placeholder.com/80?text=Eggs' },
        { name: 'Milk', price: '₱60', image: 'https://via.placeholder.com/80?text=Milk' },
    ],
    beauty: [
        { name: 'Lipstick', price: '₱250', image: 'https://via.placeholder.com/80?text=Lipstick' },
        { name: 'Shampoo', price: '₱120', image: 'https://via.placeholder.com/80?text=Shampoo' },
        { name: 'Soap', price: '₱40', image: 'https://via.placeholder.com/80?text=Soap' },
    ],
    sports: [
        { name: 'Basketball', price: '₱500', image: 'https://via.placeholder.com/80?text=Basketball' },
        { name: 'Shoes', price: '₱1,200', image: 'https://via.placeholder.com/80?text=Shoes' },
        { name: 'Jersey', price: '₱350', image: 'https://via.placeholder.com/80?text=Jersey' },
    ],
    automotive: [
        { name: 'Car Wax', price: '₱180', image: 'https://via.placeholder.com/80?text=CarWax' },
        { name: 'Motor Oil', price: '₱350', image: 'https://via.placeholder.com/80?text=MotorOil' },
        { name: 'Air Freshener', price: '₱60', image: 'https://via.placeholder.com/80?text=AirFreshener' },
    ],
    pets: [
        { name: 'Dog Food', price: '₱300', image: 'https://via.placeholder.com/80?text=DogFood' },
        { name: 'Cat Toy', price: '₱90', image: 'https://via.placeholder.com/80?text=CatToy' },
        { name: 'Leash', price: '₱120', image: 'https://via.placeholder.com/80?text=Leash' },
    ],
};

const Landing = () => {
    const [activeIdx, setActiveIdx] = useState(0);
    const activeCategory = categories[activeIdx];
    const [showModal, setShowModal] = useState(false);
    const [modalTab, setModalTab] = useState('login'); // 'login' or 'register'
    const [hoveredIdx, setHoveredIdx] = useState(null);

    // Auto-move carousel every 2.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIdx(idx => (idx + 1) % categories.length);
        }, 2500);
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

    return (
        <>
            <Header />
            {/* Hero Section */}
            <section className="heroSection">
                <h1 className="heroTitle">Experience Community Commerce at its Finest</h1>
                <h3 className="heroSubtitle">Your gateway to local treasures in Barangay Gen T. De Leon</h3>
                <div className="authButtons">
                    <button className="registerBtn" onClick={() => { setShowModal(true); setModalTab('register'); }}>Register</button>
                    <button className="loginBtn" onClick={() => { setShowModal(true); setModalTab('login'); }}>Login</button>
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
                <div className="shopItemsGrid">
                    {(shopItems[activeCategory.slug] || []).map((item, idx) => {
                        const isHovered = hoveredIdx === idx;
                        // Use fixed rating and sold count for all products
                        const rating = 4.7;
                        const sold = 320;
                        // Extract price number
                        const priceNum = parseInt(item.price.replace('₱', '').replace(',', '').split('/')[0]);
                        return (
                            <div
                                key={item.name}
                                className={`product-card ${isHovered ? 'product-card--hovered' : ''}`}
                                onMouseEnter={() => setHoveredIdx(idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                                onClick={() => window.location.href = '/product'}
                            >
                                <img src={item.image} alt={item.name} className="product-image" />
                                <div className="product-name">{item.name}</div>
                                {/* Slide container for info/buttons */}
                                <div className={`product-info ${isHovered ? 'product-info--hidden' : ''}`}>
                                    <div className="product-price">₱{priceNum.toLocaleString()}</div>
                                    <div className="product-rating">
                                        <span className="product-rating-stars">
                                            {'★'.repeat(4)}<span style={{ opacity: 0.5 }}>★</span>
                                            <span className="product-rating-number">{rating}</span>
                                        </span>
                                        <span className="product-sold">{sold} sold</span>
                                    </div>
                                </div>
                                {/* Slide up buttons on hover */}
                                <div className={`product-buttons ${isHovered ? 'product-buttons--visible' : ''}`}>
                                    <button className="add-to-cart-btn" onClick={e => e.stopPropagation()}>Add to Cart</button>
                                    <button className="buy-now-btn" onClick={e => e.stopPropagation()}>Buy Now</button>
                                </div>
                            </div>
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
        </>
    );
};

export default Landing;
