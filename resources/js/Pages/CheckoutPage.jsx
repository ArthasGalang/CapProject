
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from "../Components/Header";
import { usePage } from '@inertiajs/react';

const CheckoutPage = () => {
    const { props } = usePage();
    const { userId, selectedCartItemIds, total } = props;
    const [checkoutItems, setCheckoutItems] = useState([]);
    // Fetch cart item details using IDs
    useEffect(() => {
        if (selectedCartItemIds && selectedCartItemIds.length > 0) {
            fetch(`/api/cart-items/checkout?ids=${selectedCartItemIds.join(',')}`)
                .then(res => res.json())
                .then(data => setCheckoutItems(data));
        } else {
            setCheckoutItems([]);
        }
    }, [selectedCartItemIds]);

    // Fetch shop names for each ShopID in checkoutItems
    const [shopNames, setShopNames] = useState({});
    const [shopMap, setShopMap] = useState({});
    useEffect(() => {
        const shopIds = Array.from(new Set((checkoutItems || []).map(item => item.ShopID)));
        if (shopIds.length === 0) return;
        fetch(`/api/shops/many?ids=${shopIds.join(',')}`)
            .then(res => res.json())
            .then(shops => {
                const names = {};
                const map = {};
                shops.forEach(shop => {
                    if (shop && shop.ShopID) {
                        names[shop.ShopID] = shop.ShopName;
                        map[shop.ShopID] = shop;
                    }
                });
                setShopNames(names);
                setShopMap(map);
            });
    }, [checkoutItems]);
    // Log received data
    useEffect(() => {
        console.log('CheckoutPage received:', { userId, selectedCartItemIds, total, checkoutItems });
    }, [userId, selectedCartItemIds, total, checkoutItems]);
    const [useExistingAddress, setUseExistingAddress] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [addressForm, setAddressForm] = useState({
        HouseNumber: '',
        Street: '',
        Barangay: '',
        Municipality: '',
        ZipCode: '',
        name: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('QR');
    const [receiveBy, setReceiveBy] = useState('Delivery');
    // Notes per shop
    const [shopNotes, setShopNotes] = useState({});

    // Sync global payment/receive with per-shop selections
    useEffect(() => {
        const shopIds = Array.from(new Set((checkoutItems || []).map(item => item.ShopID)));
        if (shopIds.length === 0) return;
        // Payment
        const shopPayments = shopIds.map(shopId => shopNotes[`pay-${shopId}`] || 'COD');
        const allSamePayment = shopPayments.every(pm => pm === shopPayments[0]);
        if (allSamePayment) {
            setPaymentMethod(shopPayments[0]);
        } else {
            setPaymentMethod('CUSTOM');
        }
        // Receive
        const shopReceives = shopIds.map(shopId => shopNotes[`receive-${shopId}`] || 'Delivery');
        const allSameReceive = shopReceives.every(rv => rv === shopReceives[0]);
        if (allSameReceive) {
            setReceiveBy(shopReceives[0]);
        } else {
            setReceiveBy('CUSTOM');
        }
    }, [shopNotes, checkoutItems]);
    const [shopItems, setShopItems] = useState([]); // [{shopId, items: []}]
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Calculate total payment from all shops
        const total = checkoutItems.reduce((sum, item) => sum + (parseFloat(item.Subtotal) || 0), 0);
        setTotalPrice(total);
    }, [checkoutItems]);

    useEffect(() => {
        if (userId) {
            fetch(`/api/addresses?user_id=${userId}`)
                .then(res => res.json())
                .then(data => setAddresses(data));
        }
    }, [userId]);

    // Prepare and submit orders per shop
    const handlePlaceOrder = async () => {
        // Validation
        if (!selectedAddressId) {
            console.error('Validation error: No address selected');
            toast.error('Please select a delivery address.');
            return;
        }
        if (!paymentMethod) {
            console.error('Validation error: No payment method selected');
            toast.error('Please select a payment method.');
            return;
        }
        if (!receiveBy) {
            console.error('Validation error: No receive method selected');
            toast.error('Please select a receive method.');
            return;
        }
        if (!checkoutItems.length) {
            console.error('Validation error: No items to checkout');
            toast.error('No items to checkout.');
            return;
        }
        // Group items by shop
        const itemsByShop = checkoutItems.reduce((acc, item) => {
            if (!acc[item.ShopID]) acc[item.ShopID] = [];
            acc[item.ShopID].push(item);
            return acc;
        }, {});
        // Prepare order payloads
        const orders = Object.entries(itemsByShop).map(([shopId, items]) => {
            const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.Subtotal), 0);
            // Determine receive method for this shop
            const shopReceive = shopNotes[`receive-${shopId}`] || 'Delivery';
            // Map frontend payment method to backend value
            const payNote = shopNotes[`pay-${shopId}`] || 'COD';
            const shopPayment = payNote === 'QR' ? 'EWallet' : 'CoD';
            let addressId = '';
            if (shopReceive === 'Pickup') {
                // Use AddressID from the shops table
                addressId = shopMap[shopId]?.AddressID || '';
            } else {
                // Use only the AddressID from the selected address dropdown
                addressId = selectedAddressId;
            }
            // Ensure AddressID is an integer if possible
            addressId = addressId ? parseInt(addressId, 10) : '';
            // Always send a non-empty string for BuyerNote
            let buyerNote = shopNotes[shopId];
            if (typeof buyerNote !== 'string' || buyerNote.trim() === '') {
                buyerNote = 'No note';
            }
            // Always send a non-empty string for PickUpTime
            let pickUpTime = '';
            if (typeof pickUpTime !== 'string' || pickUpTime.trim() === '') {
                pickUpTime = 'N/A';
            }
            const orderItems = items.map(item => ({
                ProductID: item.ProductID,
                Quantity: item.Quantity,
                Subtotal: item.Subtotal
            }));
            const orderPayload = {
                ShopID: shopId ? parseInt(shopId, 10) : '',
                UserID: userId ? parseInt(userId, 10) : '',
                AddressID: addressId,
                TotalAmount: totalAmount,
                Status: 'ToPay',
                OrderDate: new Date().toISOString().slice(0, 10),
                PaymentMethod: shopPayment,
                BuyerNote: buyerNote,
                PaymentStatus: 'Pending',
                IsPickUp: shopReceive === 'Pickup',
                PickUpTime: pickUpTime, /* Lines 134-135 omitted */
                CompletionDate: null,
                items: orderItems
            };
            console.error('Order payload for shop', shopId, orderPayload);
            return orderPayload;
        });
    // Show the orders payload in the console before sending
    console.error('Full orders array to be sent:', orders);
        // Send to backend
        let res;
        try {
            res = await fetch('/api/orders/multi-shop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orders })
            });
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error('Network error.');
            return;
        }
        let result;
        try {
            result = await res.json();
        } catch (e) {
            const text = await res.text();
            console.error('Server error (not JSON):', text);
            toast.error('Server error. Please check logs.');
            return;
        }
        if (result.success) {
            console.error('Order placed successfully!', result);
            toast.success('Order placed successfully!');
            // Optionally redirect or clear cart
        } else {
            // Log fetch response status and text for deeper debugging
            console.error('Order failed response:', result);
            try {
                const errorText = await res.text();
                console.error('Fetch response text:', errorText);
            } catch (err) {
                console.error('Error reading fetch response text:', err);
            }
            toast.error('Order failed. Please try again.');
        }
    };

    return (
        <>
            <Header />
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>

                {/* Checkout Items Section */}
                <div style={{ marginBottom: '2rem', background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 24px rgba(44,204,113,0.15)', padding: '2.5rem 2rem', border: '2px solid #229954' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Checkout Items</h2>
                    {checkoutItems.length === 0 ? (
                        <div style={{ color: '#888', textAlign: 'center' }}>No items to checkout.</div>
                    ) : (
                        Object.entries(
                            checkoutItems.reduce((acc, item) => {
                                if (!acc[item.ShopID]) acc[item.ShopID] = [];
                                acc[item.ShopID].push(item);
                                return acc;
                            }, {})
                        ).map(([shopId, items]) => (
                            <div key={shopId} style={{ marginBottom: '2.5rem', background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px #22995422', padding: '2rem', border: '1.5px solid #229954' }}>
                                <h3 style={{ color: '#229954', fontWeight: 600, fontSize: '1.15rem', marginBottom: '1rem' }}>{shopNames[shopId] ? shopNames[shopId] : `Shop #${shopId}`}</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f3f4f6', color: '#222', fontWeight: 600 }}>
                                            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Product</th>
                                            <th style={{ padding: '0.7rem', textAlign: 'center' }}>Price</th>
                                            <th style={{ padding: '0.7rem', textAlign: 'center' }}>Quantity</th>
                                            <th style={{ padding: '0.7rem', textAlign: 'center' }}>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map(item => (
                                            <tr key={item.CartItemID} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '0.7rem', fontWeight: 500, color: '#222' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <img src={item.Image || 'https://via.placeholder.com/40x40?text=Product'} alt={item.ProductName || 'Product'} style={{ width: 40, height: 40, borderRadius: '0.5rem', objectFit: 'cover', background: '#f3f4f6' }} />
                                                        <span>{item.ProductName}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '0.7rem', textAlign: 'center', color: '#229954', fontWeight: 600 }}>₱{parseFloat(item.Price).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                                                <td style={{ padding: '0.7rem', textAlign: 'center' }}>{item.Quantity}</td>
                                                <td style={{ padding: '0.7rem', textAlign: 'center', color: '#1976d2', fontWeight: 600 }}>₱{parseFloat(item.Subtotal).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Per-shop Payment & Receive */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
                                    <div style={{ fontWeight: 500 }}>Payment Method:</div>
                                    <div style={{ display: 'flex', gap: '0.7rem' }}>
                                        <button
                                            type="button"
                                            style={{
                                                background: (shopNotes[`pay-${shopId}`] || 'COD') === 'COD' ? '#38d87c' : '#fff',
                                                color: (shopNotes[`pay-${shopId}`] || 'COD') === 'COD' ? '#fff' : '#38d87c',
                                                border: (shopNotes[`pay-${shopId}`] || 'COD') === 'COD' ? 'none' : '2px solid #38d87c',
                                                fontWeight: 700,
                                                fontSize: '0.82rem',
                                                borderRadius: '0.7rem',
                                                padding: '0.12rem 0.8rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                            onClick={() => setShopNotes(notes => ({ ...notes, [`pay-${shopId}`]: 'COD' }))}
                                        >
                                            Cash On Delivery
                                        </button>
                                        <button
                                            type="button"
                                            style={{
                                                background: (shopNotes[`pay-${shopId}`] || 'COD') === 'QR' ? '#38d87c' : '#fff',
                                                color: (shopNotes[`pay-${shopId}`] || 'COD') === 'QR' ? '#fff' : '#38d87c',
                                                border: (shopNotes[`pay-${shopId}`] || 'COD') === 'QR' ? 'none' : '2px solid #38d87c',
                                                fontWeight: 700,
                                                fontSize: '0.82rem',
                                                borderRadius: '0.7rem',
                                                padding: '0.12rem 0.8rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                            onClick={() => setShopNotes(notes => ({ ...notes, [`pay-${shopId}`]: 'QR' }))}
                                        >
                                            QR Code
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
                                    <div style={{ fontWeight: 500 }}>Receive By:</div>
                                    <div style={{ display: 'flex', gap: '0.7rem' }}>
                                        <button
                                            type="button"
                                            style={{
                                                background: (shopNotes[`receive-${shopId}`] || 'Delivery') === 'Delivery' ? '#38d87c' : '#fff',
                                                color: (shopNotes[`receive-${shopId}`] || 'Delivery') === 'Delivery' ? '#fff' : '#38d87c',
                                                border: (shopNotes[`receive-${shopId}`] || 'Delivery') === 'Delivery' ? 'none' : '2px solid #38d87c',
                                                fontWeight: 700,
                                                fontSize: '0.82rem',
                                                borderRadius: '0.7rem',
                                                padding: '0.12rem 0.8rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                            onClick={() => setShopNotes(notes => ({ ...notes, [`receive-${shopId}`]: 'Delivery' }))}
                                        >
                                            Delivery
                                        </button>
                                        <button
                                            type="button"
                                            style={{
                                                background: (shopNotes[`receive-${shopId}`] || 'Delivery') === 'Pickup' ? '#38d87c' : '#fff',
                                                color: (shopNotes[`receive-${shopId}`] || 'Delivery') === 'Pickup' ? '#fff' : '#38d87c',
                                                border: (shopNotes[`receive-${shopId}`] || 'Delivery') === 'Pickup' ? 'none' : '2px solid #38d87c',
                                                fontWeight: 700,
                                                fontSize: '0.82rem',
                                                borderRadius: '0.7rem',
                                                padding: '0.12rem 0.8rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                            onClick={() => setShopNotes(notes => ({ ...notes, [`receive-${shopId}`]: 'Pickup' }))}
                                        >
                                            Pickup
                                        </button>
                                    </div>
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <div style={{ fontWeight: 500, fontSize: '1rem', marginBottom: '0.3rem' }}>Note to seller</div>
                                    <textarea
                                        style={{ width: '100%', minHeight: 40, borderRadius: 6, border: '1px solid #ccc', padding: '0.5rem', resize: 'vertical' }}
                                        placeholder="Add a note for this shop (optional)"
                                        value={shopNotes[shopId] || ''}
                                        onChange={e => setShopNotes(notes => ({ ...notes, [shopId]: e.target.value }))}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pay all by & Receive all by */}
                <div style={{ border: '1px solid #eee', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 8px #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div>
                            <h4 style={{ fontWeight: 600, marginBottom: '0.7rem' }}>Pay all by</h4>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', height: '40px'}}>
                            <button
                                type="button"
                                style={{
                                    background: paymentMethod === 'COD' ? '#38d87c' : '#fff',
                                    color: paymentMethod === 'COD' ? '#fff' : '#38d87c',
                                    border: paymentMethod === 'COD' ? 'none' : '2px solid #38d87c',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    borderRadius: '0.7rem',
                                    padding: '0.12rem 0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onClick={() => {
                                    setPaymentMethod('COD');
                                    const shopIds = Array.from(new Set((checkoutItems || []).map(item => item.ShopID)));
                                    setShopNotes(notes => {
                                        const updated = { ...notes };
                                        shopIds.forEach(shopId => { updated[`pay-${shopId}`] = 'COD'; });
                                        return updated;
                                    });
                                }}
                            >
                                Cash On Delivery
                            </button>
                            <button
                                type="button"
                                style={{
                                    background: paymentMethod === 'QR' ? '#38d87c' : '#fff',
                                    color: paymentMethod === 'QR' ? '#fff' : '#38d87c',
                                    border: paymentMethod === 'QR' ? 'none' : '2px solid #38d87c',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    borderRadius: '0.7rem',
                                    padding: '0.12rem 0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onClick={() => {
                                    setPaymentMethod('QR');
                                    const shopIds = Array.from(new Set((checkoutItems || []).map(item => item.ShopID)));
                                    setShopNotes(notes => {
                                        const updated = { ...notes };
                                        shopIds.forEach(shopId => { updated[`pay-${shopId}`] = 'QR'; });
                                        return updated;
                                    });
                                }}
                            >
                                QR Code
                            </button>
                            <button
                                type="button"
                                style={{
                                    background: paymentMethod === 'CUSTOM' ? '#38d87c' : '#fff',
                                    color: paymentMethod === 'CUSTOM' ? '#fff' : '#38d87c',
                                    border: paymentMethod === 'CUSTOM' ? 'none' : '2px solid #38d87c',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    borderRadius: '0.7rem',
                                    padding: '0.12rem 0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onClick={() => setPaymentMethod('CUSTOM')}
                            >
                                Custom
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div>
                            <h4 style={{ fontWeight: 600, marginBottom: '0.7rem' }}>Receive all by</h4>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', height: '40px' }}>
                            <button
                                type="button"
                                style={{
                                    background: receiveBy === 'Delivery' ? '#38d87c' : '#fff',
                                    color: receiveBy === 'Delivery' ? '#fff' : '#38d87c',
                                    border: receiveBy === 'Delivery' ? 'none' : '2px solid #38d87c',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    borderRadius: '0.7rem',
                                    padding: '0.12rem 0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onClick={() => {
                                    setReceiveBy('Delivery');
                                    const shopIds = Array.from(new Set((checkoutItems || []).map(item => item.ShopID)));
                                    setShopNotes(notes => {
                                        const updated = { ...notes };
                                        shopIds.forEach(shopId => { updated[`receive-${shopId}`] = 'Delivery'; });
                                        return updated;
                                    });
                                }}
                            >
                                Delivery
                            </button>
                            <button
                                type="button"
                                style={{
                                    background: receiveBy === 'Pickup' ? '#38d87c' : '#fff',
                                    color: receiveBy === 'Pickup' ? '#fff' : '#38d87c',
                                    border: receiveBy === 'Pickup' ? 'none' : '2px solid #38d87c',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    borderRadius: '0.7rem',
                                    padding: '0.12rem 0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onClick={() => {
                                    setReceiveBy('Pickup');
                                    const shopIds = Array.from(new Set((checkoutItems || []).map(item => item.ShopID)));
                                    setShopNotes(notes => {
                                        const updated = { ...notes };
                                        shopIds.forEach(shopId => { updated[`receive-${shopId}`] = 'Pickup'; });
                                        return updated;
                                    });
                                }}
                            >
                                Pickup
                            </button>
                            <button
                                type="button"
                                style={{
                                    background: receiveBy === 'CUSTOM' ? '#38d87c' : '#fff',
                                    color: receiveBy === 'CUSTOM' ? '#fff' : '#38d87c',
                                    border: receiveBy === 'CUSTOM' ? 'none' : '2px solid #38d87c',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    borderRadius: '0.7rem',
                                    padding: '0.12rem 0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onClick={() => setReceiveBy('CUSTOM')}
                            >
                                Custom
                            </button>
                        </div>
                    </div>
                </div>

                {/* Delivery Address Card (moved) */}
                {(() => {
                    const shopIds = Array.from(new Set((checkoutItems || []).map(item => item.ShopID)));
                    const allPickup = shopIds.length > 0 && shopIds.every(shopId => (shopNotes[`receive-${shopId}`] || 'Delivery') === 'Pickup');
                    if (!allPickup) {
                        return (
                            <div style={{ border: '1px solid #eee', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 8px #eee' }}>
                                <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem' }}>Delivery Address</h2>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ position: 'relative', display: 'inline-block' }}>
                                        <input
                                            type="checkbox"
                                            checked={useExistingAddress}
                                            onChange={e => setUseExistingAddress(e.target.checked)}
                                            style={{
                                                width: 22,
                                                height: 22,
                                                borderRadius: '6px',
                                                border: '2px solid #229954',
                                                background: useExistingAddress ? '#229954' : '#fff',
                                                appearance: 'none',
                                                display: 'inline-block',
                                                position: 'relative',
                                                verticalAlign: 'middle',
                                                cursor: 'pointer',
                                            }}
                                        />
                                        {useExistingAddress && (
                                            <span style={{
                                                position: 'absolute',
                                                left: 6,
                                                top: 2,
                                                width: 10,
                                                height: 10,
                                                background: 'none',
                                                pointerEvents: 'none',
                                                color: '#fff',
                                                fontSize: 16,
                                                fontWeight: 900,
                                                zIndex: 2,
                                            }}>✓</span>
                                        )}
                                    </span>
                                    <span>Use existing address</span>
                                </label>
                                {useExistingAddress ? (
                                    <div style={{ marginTop: '1rem' }}>
                                        <select
                                            value={selectedAddressId}
                                            onChange={e => setSelectedAddressId(e.target.value)}
                                            style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', width: '100%' }}
                                        >
                                            <option value="">Select address</option>
                                            {[...addresses.reduce((map, addr) => {
                                                if (!map.has(addr.id)) map.set(addr.id, addr);
                                                return map;
                                            }, new Map()).values()].map(addr => (
                                                <option key={addr.AddressID} value={addr.AddressID}>
                                                    {addr.HouseNumber} {addr.Street}, {addr.Barangay}, {addr.Municipality}, {addr.ZipCode}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <form style={{ marginTop: '1rem', display: 'grid', gap: '0.7rem' }}>
                                        <input type="text" placeholder="Name" value={addressForm.name || ''} onChange={e => setAddressForm(f => ({ ...f, name: e.target.value }))} style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }} />
                                        <input type="text" placeholder="House Number" value={addressForm.HouseNumber} onChange={e => setAddressForm(f => ({ ...f, HouseNumber: e.target.value }))} style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }} />
                                        <input type="text" placeholder="Street" value={addressForm.Street} onChange={e => setAddressForm(f => ({ ...f, Street: e.target.value }))} style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }} />
                                        <input type="text" placeholder="Barangay" value={addressForm.Barangay} onChange={e => setAddressForm(f => ({ ...f, Barangay: e.target.value }))} style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }} />
                                        <input type="text" placeholder="Municipality" value={addressForm.Municipality} onChange={e => setAddressForm(f => ({ ...f, Municipality: e.target.value }))} style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }} />
                                        <input type="text" placeholder="Zip Code" value={addressForm.ZipCode} onChange={e => setAddressForm(f => ({ ...f, ZipCode: e.target.value }))} style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }} />
                                    </form>
                                )}
                            </div>
                        );
                    }
                    return null;
                })()}
                {/* Total and Place Order */}
                <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem' }}>
                        Total Payment: <span style={{ color: '#229954' }}>₱{totalPrice}</span>
                    </div>
                    <button
                        style={{ background: '#229954', color: '#fff', fontWeight: 600, fontSize: '1.1rem', padding: '0.8rem 2.2rem', borderRadius: 8, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px #eee' }}
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;
