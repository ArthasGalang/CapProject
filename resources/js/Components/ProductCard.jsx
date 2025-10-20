import React, { useState } from "react";
import Toast from "./Toast";

const ProductCard = ({
    product,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    onClick,
    style = {},
    showButtons = true,
    buttonProps = {},
    setToast,
}) => {
    // Local toast fallback when parent doesn't supply setToast
    const [localToast, setLocalToast] = useState({ show: false, message: '', type: 'success' });
    const rating = product.avgRating != null ? product.avgRating : 0;
    let sold = 0;
    if (product.BoughtBy) {
        try {
            const arr = typeof product.BoughtBy === 'string' ? JSON.parse(product.BoughtBy) : product.BoughtBy;
            if (Array.isArray(arr)) sold = arr.length;
        } catch (e) { sold = 0; }
    }

    // --- Image normalization logic from ShopProducts ---
    const placeholderProductImage = 'https://via.placeholder.com/90x90?text=Product';
    // Robust normalization logic from ShopProducts
    const normalizeImageUrl = (val) => {
        if (!val) return null;
        if (typeof val !== 'string') return null;
        let s = val.trim();
        // If looks like a JSON array string, try to parse and use first element
        if (s.startsWith('[')) {
            try {
                const parsed = JSON.parse(s);
                if (Array.isArray(parsed) && parsed.length) {
                    for (const item of parsed) {
                        const nu = normalizeImageUrl(item);
                        if (nu) return nu;
                    }
                }
            } catch (e) {}
        }
        // If the string contains encoded JSON-like content (e.g. %22...), decode it first
        try {
            if (/%22|%5B|%5D/.test(s)) {
                const decoded = decodeURIComponent(s);
                if (decoded && decoded !== s) s = decoded;
            }
        } catch (e) {}
        // If it's a blob or data URL (local preview), return as-is
        if (s.startsWith('blob:') || s.startsWith('data:') || s.startsWith('file:')) return s;
        // Strip surrounding quotes or brackets
        if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
            s = s.slice(1, -1);
        }
        s = s.replace(/^[\[\]\s\"]+|[\[\]\s\"]+$/g, '');
        if (!s) return null;
        // Normalize repeated slashes (but keep protocol if present)
        if (s.startsWith('http://') || s.startsWith('https://')) {
            // Collapse duplicate slashes after protocol
            return s.replace(/([^:])\/\/+/, '$1/');
        }
        s = s.replace(/^\/+/, '');
        s = s.replace(/^storage[\/]+/, '');
        s = s.replace(/\\/g, '/');
        // Collapse duplicate slashes in the path
        s = s.replace(/\/\/+/, '/');
        return `/storage/${s}`;
    };

    // Get all possible product images, deduplicated
    const getProductImages = (product) => {
        if (!product) return [];
        const collected = [];
        const pushParsed = (val) => {
            if (!val && val !== 0) return;
            if (Array.isArray(val)) {
                for (const it of val) collected.push(it);
            } else if (typeof val === 'string') {
                const s = val.trim();
                if (s.startsWith('[')) {
                    try {
                        const parsed = JSON.parse(s);
                        if (Array.isArray(parsed)) {
                            for (const it of parsed) collected.push(it);
                            return;
                        }
                    } catch (e) {}
                }
                collected.push(s);
            } else {
                collected.push(val);
            }
        };
        if (product.Image) pushParsed(product.Image);
        if (product.Images) pushParsed(product.Images);
        if (product.ImageUrl) pushParsed(product.ImageUrl);
        if (product.AdditionalImages) pushParsed(product.AdditionalImages);
        if (product.ImagesJson) pushParsed(product.ImagesJson);
        const urls = collected
            .map((v) => (typeof v === 'string' ? normalizeImageUrl(v) : null))
            .filter(Boolean);
        const seen = new Set();
        const out = [];
        for (const u of urls) {
            if (!seen.has(u)) {
                seen.add(u);
                out.push(u);
            }
        }
        return out;
    };

    // Get the main product image
    const getProductImage = (product, index = 0) => {
        const imgs = getProductImages(product);
        if (imgs.length === 0) return placeholderProductImage;
        return imgs[Math.min(index, imgs.length - 1)];
    };

    // Add to Cart handler
    const handleAddToCart = async (e) => {
        e.stopPropagation();
        let userId = null;
        try {
            // Try to get user from localStorage (adjust as needed for your auth)
            const user = JSON.parse(localStorage.getItem('user'));
            userId = user?.UserID || user?.id || null;
        } catch (err) { userId = null; }
        if (!userId) {
            if (setToast) setToast({ show: true, message: 'You must be logged in to add to cart.', type: 'error' });
            else setLocalToast({ show: true, message: 'You must be logged in to add to cart.', type: 'error' });
            return;
        }
        const payload = {
            UserID: userId,
            ProductID: product.ProductID,
            ShopID: product.ShopID,
            Quantity: 1,
            Price: product.Price,
            Subtotal: product.Price * 1,
            Options: product.Options || null,
        };
        try {
            const res = await fetch('/api/cart-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                if (setToast) setToast({ show: true, message: 'Added to cart!', type: 'success' });
                else setLocalToast({ show: true, message: 'Added to cart!', type: 'success' });
                // Notify other parts of the app (Header) to refresh cart count
                try {
                    window.dispatchEvent(new Event('cart-updated'));
                } catch (e) { /* ignore */ }
            } else {
                if (setToast) setToast({ show: true, message: 'Failed to add to cart.', type: 'error' });
                else setLocalToast({ show: true, message: 'Failed to add to cart.', type: 'error' });
            }
        } catch (err) {
            if (setToast) setToast({ show: true, message: 'Error adding to cart.', type: 'error' });
            else setLocalToast({ show: true, message: 'Error adding to cart.', type: 'error' });
        }
    };
    return (
        <>
            {localToast.show && (
                <Toast
                    message={localToast.message}
                    type={localToast.type}
                    onClose={() => setLocalToast({ show: false, message: '', type: 'success' })}
                />
            )}
            <div
            className={`product-card${isHovered ? ' product-card--hovered' : ''}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
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
                ...style,
            }}
        >
            <img
                src={getProductImage(product)}
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
            {showButtons && (
                <div className={`product-buttons${isHovered ? ' product-buttons--visible' : ''}`}> 
                    <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
                    <button className="buy-now-btn" onClick={e => {e.stopPropagation(); buttonProps.onBuyNow && buttonProps.onBuyNow(e, product);}}>Buy Now</button>
                </div>
            )}
        </div>
        </>
    );
};

export default ProductCard;
