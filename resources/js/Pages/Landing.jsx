import React, { useState, useEffect } from "react";
import Header from "@/Components/Header";
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

            {/* Auth Modal */}
            {showModal && (
                <div className="modalOverlay">
                    <div className="authModal">
                        <button className="authModalClose" onClick={() => setShowModal(false)}>&times;</button>
                        <div className="authModalContent">
                            <div className="authModalLeft">
                                <h2>{modalTab === 'login' ? 'Welcome Back!' : 'Join the Community!'}</h2>
                                <p>{modalTab === 'login' ? 'Log in to discover and shop local treasures.' : 'Register to start buying and selling in your barangay.'}</p>
                            </div>
                            <div className="authModalRight">
                                <div className="authModalTabs">
                                    <button className={modalTab === 'login' ? 'active' : ''} onClick={() => setModalTab('login')}>Login</button>
                                    <button className={modalTab === 'register' ? 'active' : ''} onClick={() => setModalTab('register')}>Register</button>
                                </div>
                                {modalTab === 'login' ? (
                                    <form className="authModalForm">
                                        <input type="email" placeholder="Email" />
                                        <input type="password" placeholder="Password" />
                                        <button type="submit">Login</button>
                                    </form>
                                ) : (
                                    <>
                                      <div style={{ maxHeight: 320, overflowY: 'auto', width: '100%' }}>
                                        <form className="authModalForm" style={{
                                            display: 'grid',
                                            gridTemplateColumns: '180px 180px',
                                            gap: '1.1rem 1.2rem',
                                            marginBottom: '1.2rem',
                                            justifyContent: 'center',
                                            alignItems: 'start',
                                            width: '100%',
                                            minWidth: 0,
                                            marginLeft: 'auto',
                                            marginRight: 'auto'
                                        }}>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>First Name</label>
                                              <input type="text" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Last Name</label>
                                              <input type="text" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Age</label>
                                              <input type="number" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Mobile Number</label>
                                              <input type="text" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Email</label>
                                              <input type="email" placeholder="name@example.com" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Password</label>
                                              <input type="password" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Confirm Password</label>
                                              <input type="password" placeholder="" />
                                          </div>
                                          <div></div>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Barangay</label>
                                              <input type="text" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Municipality</label>
                                              <input type="text" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Street</label>
                                              <input type="text" placeholder="" />
                                          </div>
                                          <div></div>
                                        </form>
                                      </div>
                                      <div style={{ marginTop: '0.7rem', width: '100%' }}>
                                        <button type="submit" style={{ width: '100%' }} class="registerBtn">Register</button>
                                      </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories Carousel Section */}
            <section className="categoryListSection">
                <h3 className="categoryListTitle">Shop by Category</h3>
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
                <h3 className="shopItemsTitle">{activeCategory.name} Items</h3>
                <div className="shopItemsGrid">
                    {(shopItems[activeCategory.slug] || []).map(item => (
                        <div
                            key={item.name}
                            className="shopItemCard"
                            style={{ boxShadow: '0 2px 8px rgba(44,204,113,0.07)', border: '1.5px solid #eee', borderRadius: '1rem', padding: '1rem', minWidth: '180px', maxWidth: '220px', width: '100%', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                            onClick={() => window.location.href = '/product'}
                        >
                            <img src={item.image} alt={item.name} className="shopItemImage" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '0.7rem', marginBottom: '0.8rem' }} />
                            <div className="shopItemName" style={{ fontSize: '1.08rem', fontWeight: '600', marginBottom: '0.18rem', color: '#222' }}>{item.name}</div>
                            <div className="shopItemPrice" style={{ fontWeight: '700', fontSize: '1rem', color: '#222', marginBottom: '0.18rem' }}>{item.price}</div>
                            <div style={{ color: 'var(--color-primary)', fontSize: '0.92rem', marginBottom: '0.8rem' }}>{activeCategory.name}</div>
                            <button className="registerBtn" style={{ width: '100%', marginBottom: '0.35rem', fontWeight: '600', fontSize: '1rem', height: '36px' }} onClick={e => e.stopPropagation()}>Add to Cart</button>
                            <button className="loginBtn" style={{ width: '100%', fontWeight: '600', fontSize: '1rem', height: '36px' }} onClick={e => e.stopPropagation()}>Buy Now</button>
                        </div>
                    ))}
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
