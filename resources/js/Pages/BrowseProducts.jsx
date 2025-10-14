import React, { useState } from "react";
import '@css/app.css';
import Header from "../Components/Header"; // Corrected import path


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

const [allProducts, setAllProducts] = React.useState([]);

React.useEffect(() => {
    fetch('/api/products')
        .then(res => res.json())
        .then(data => {
            setAllProducts(data);
        });
}, []);

const BrowseProducts = () => {
    const [hoveredIdx, setHoveredIdx] = useState(null);
    // Filter state
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    // Filter logic
    const filteredProducts = allProducts.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.CategoryName === selectedCategory || product.category === selectedCategory;
        const name = product.ProductName || product.name;
        const price = product.Price || product.price;
        const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
        const matchesMin = minPrice === "" || price >= Number(minPrice);
        const matchesMax = maxPrice === "" || price <= Number(maxPrice);
        return matchesCategory && matchesSearch && matchesMin && matchesMax;
    });

    return (
        <>
        <Header />
        <div className="browse-products-page">
            <div className="browse-products-container">

                {/* Products Grid */}
                <main className="products-main">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h2 className="products-title">Browse Products</h2>
                        <button
                            className="filter-toggle-btn"
                            onClick={() => setShowFilter(!showFilter)}
                            aria-label="Toggle filter options"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-3-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        </button>
                    </div>
                    <div className={`filter-container ${showFilter ? 'filter-open' : ''}`}>
                        <div className="filter-group">
                            <label className="filter-label">Category</label>
                            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="filter-select">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">Search</label>
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Product name..." className="filter-input" />
                        </div>
                        <div className="price-inputs">
                            <div className="price-input-group">
                                <label className="filter-label">Min Price</label>
                                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="₱0" className="filter-input" />
                            </div>
                            <div className="price-input-group">
                                <label className="filter-label">Max Price</label>
                                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="₱99999" className="filter-input" />
                            </div>
                        </div>
                    </div>
                    <div className="products-grid">
                        {filteredProducts.length === 0 ? (
                            <div className="no-products">No products found.</div>
                        ) : (
                            filteredProducts.map((product, idx) => {
                                const isHovered = hoveredIdx === idx;
                                // Use fixed rating and sold count for all products
                                const rating = 4.7;
                                const sold = 320;
                                return (
                                    <div
                                        key={product.ProductID || product.name}
                                        className={`product-card ${isHovered ? 'product-card--hovered' : ''}`}
                                        onMouseEnter={() => setHoveredIdx(idx)}
                                        onMouseLeave={() => setHoveredIdx(null)}
                                        onClick={() => window.location.href = `/product/${product.ProductID || ''}`}
                                    >
                                        <img src={product.Image || product.image} alt={product.ProductName || product.name} className="product-image" />
                                        <div className="product-name">{product.ProductName || product.name}</div>
                                        <div className={`product-info ${isHovered ? 'product-info--hidden' : ''}`}>
                                            <div className="product-price">₱{(product.Price || product.price || 0).toLocaleString()}</div>
                                            <div className="product-rating">
                                                <span className="product-rating-stars">
                                                    {'★'.repeat(4)}<span style={{ opacity: 0.5 }}>★</span>
                                                    <span className="product-rating-number">{rating}</span>
                                                </span>
                                                <span className="product-sold">{sold} sold</span>
                                            </div>
                                        </div>
                                        <div className={`product-buttons ${isHovered ? 'product-buttons--visible' : ''}`}>
                                            <button className="add-to-cart-btn">Add to Cart</button>
                                            <button className="buy-now-btn">Buy Now</button>
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
