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
    const rating = product.avgRating != null ? product.avgRating : 0;
    let sold = 0;
    if (product.BoughtBy) {
        try {
            const arr = typeof product.BoughtBy === 'string' ? JSON.parse(product.BoughtBy) : product.BoughtBy;
            if (Array.isArray(arr)) sold = arr.length;
        } catch (e) { sold = 0; }
    }

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
            } else {
                if (setToast) setToast({ show: true, message: 'Failed to add to cart.', type: 'error' });
            }
        } catch (err) {
            if (setToast) setToast({ show: true, message: 'Error adding to cart.', type: 'error' });
        }
    };
    return (
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
                src={product.Image || product.image || "https://via.placeholder.com/90x90?text=Product"}
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
    );
};

export default ProductCard;
