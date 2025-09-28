import React, { useState } from "react";
import '@css/app.css';
import Header from "../Components/Header"; // Corrected import path

// Mock categories and products (reuse from Landing.jsx for now)
const categories = [
    "All",
    "Electronics",
    "Books",
    "Clothing",
    "Home",
    "Toys",
    "Groceries",
    "Beauty",
    "Sports",
    "Automotive",
    "Pets"
];

const allProducts = [
    { name: 'Smartphone', price: 8000, category: 'Electronics', image: 'https://via.placeholder.com/120?text=Phone' },
    { name: 'Laptop', price: 25000, category: 'Electronics', image: 'https://via.placeholder.com/120?text=Laptop' },
    { name: 'Novel', price: 350, category: 'Books', image: 'https://via.placeholder.com/120?text=Novel' },
    { name: 'T-Shirt', price: 150, category: 'Clothing', image: 'https://via.placeholder.com/120?text=TShirt' },
    { name: 'Chair', price: 600, category: 'Home', image: 'https://via.placeholder.com/120?text=Chair' },
    { name: 'Toy Car', price: 120, category: 'Toys', image: 'https://via.placeholder.com/120?text=ToyCar' },
    { name: 'Rice', price: 50, category: 'Groceries', image: 'https://via.placeholder.com/120?text=Rice' },
    { name: 'Lipstick', price: 250, category: 'Beauty', image: 'https://via.placeholder.com/120?text=Lipstick' },
    { name: 'Basketball', price: 500, category: 'Sports', image: 'https://via.placeholder.com/120?text=Basketball' },
    { name: 'Car Wax', price: 180, category: 'Automotive', image: 'https://via.placeholder.com/120?text=CarWax' },
    { name: 'Dog Food', price: 300, category: 'Pets', image: 'https://via.placeholder.com/120?text=DogFood' },
    // ...add more as needed
];

const BrowseProducts = () => {
    const [hoveredIdx, setHoveredIdx] = useState(null);
    // Filter state
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // Filter logic
    const filteredProducts = allProducts.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesMin = minPrice === "" || product.price >= Number(minPrice);
        const matchesMax = maxPrice === "" || product.price <= Number(maxPrice);
        return matchesCategory && matchesSearch && matchesMin && matchesMax;
    });

    return (
        <>
        <Header />
        <div className="browseProductsPage" style={{ padding: '2rem 0', minHeight: '100vh', background: '#f9f9f9' }}>
            <div className="browseProductsContainer" style={{ maxWidth: 1400, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '2.5rem 2rem', display: 'flex', gap: '2.5rem', minHeight: 700 }}>
                {/* Sidebar Filter */}
                <aside style={{ width: 270, minWidth: 220, background: '#f7faf7', borderRadius: 12, boxShadow: '0 1px 6px rgba(44,204,113,0.04)', padding: '2rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '2.2rem', border: '1.5px solid #e6f2e6', height: 'fit-content' }}>
                    <div>
                        <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 18, color: '#2ecc71' }}>Filter Products</h3>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Category</label>
                            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', minWidth: 140, width: '100%' }}>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Search</label>
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Product name..." style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Min Price</label>
                                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="₱0" style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Max Price</label>
                                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="₱99999" style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
                            </div>
                        </div>
                    </div>
                </aside>
                {/* Products Grid */}
                <main style={{ flex: 1 }}>
                    <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem' }}>Browse Products</h2>
                    <div className="productsGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 200px)', gap: '1.5rem', alignItems: 'stretch', justifyItems: 'start', justifyContent: 'start', gridAutoFlow: 'row' }}>
                        {filteredProducts.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', fontSize: '1.2rem' }}>No products found.</div>
                        ) : (
                            filteredProducts.map((product, idx) => {
                                const isHovered = hoveredIdx === idx;
                                // Use fixed rating and sold count for all products
                                const rating = 4.7;
                                const sold = 320;
                                return (
                                    <div
                                        key={product.name}
                                        className="productCard"
                                        style={{
                                            background: '#fff',
                                            borderRadius: 12,
                                            boxShadow: isHovered ? '0 4px 24px rgba(44,204,113,0.18)' : '0 1px 6px rgba(44,204,113,0.07)',
                                            border: isHovered ? '2px solid #2ecc71' : '1.5px solid #eee',
                                            padding: '1.1rem 0.7rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            minWidth: 0,
                                            width: '100%',
                                            maxWidth: 200,
                                            minHeight: 250,
                                            height: 250,
                                            justifySelf: 'start',
                                            boxSizing: 'border-box',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            transition: 'box-shadow 0.18s, border 0.18s',
                                            overflow: 'hidden'
                                        }}
                                        onMouseEnter={() => setHoveredIdx(idx)}
                                        onMouseLeave={() => setHoveredIdx(null)}
                                    >
                                        <img src={product.image} alt={product.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8, marginBottom: 12, marginTop: 6 }} />
                                        <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 4, textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                                        {/* Slide container for info/buttons */}
                                        <div style={{
                                            width: '100%',
                                            transition: 'transform 0.22s cubic-bezier(.4,1.2,.4,1), opacity 0.18s',
                                            transform: isHovered ? 'translateX(-120%)' : 'translateX(0)',
                                            opacity: isHovered ? 0 : 1,
                                            zIndex: 1,
                                        }}>
                                            <div style={{ fontWeight: 700, color: '#2ecc71', fontSize: '1rem', marginBottom: 8, textAlign: 'center', width: '100%' }}>₱{product.price.toLocaleString()}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10, width: '100%' }}>
                                                <span style={{ color: '#f7b731', fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center' }}>
                                                    {'★'.repeat(4)}<span style={{ opacity: 0.5 }}>★</span>
                                                    <span style={{ color: '#888', fontWeight: 500, fontSize: 13, marginLeft: 2 }}>{rating}</span>
                                                </span>
                                                <span style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>{sold} sold</span>
                                            </div>
                                        </div>
                                        {/* Slide up buttons on hover */}
                                        <div style={{
                                            width: '100%',
                                            position: 'absolute',
                                            left: 0,
                                            bottom: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: isHovered ? 1 : 0,
                                            pointerEvents: isHovered ? 'auto' : 'none',
                                            zIndex: 2,
                                            padding: isHovered ? '10px 10px 12px 10px' : '0 10px',
                                            transition: 'opacity 0.18s',
                                        }}>
                                            <button className="registerBtn" style={{ width: '100%', fontWeight: '600', fontSize: '0.98rem', height: '32px', marginBottom: 6, background: '#fff', color: '#2ecc71', border: '2px solid #2ecc71', borderRadius: 5, boxShadow: '0 1px 4px rgba(44,204,113,0.07)', transition: 'background 0.18s, color 0.18s' }}>Add to Cart</button>
                                            <button className="loginBtn" style={{ width: '100%', fontWeight: '600', fontSize: '0.98rem', height: '32px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 5, boxShadow: '0 1px 4px rgba(44,204,113,0.07)', transition: 'background 0.18s, color 0.18s' }}>Buy Now</button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </main>
            </div>
        </div>
    </>   
    );
};

export default BrowseProducts;
