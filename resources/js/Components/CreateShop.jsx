import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CreateShop = ({ onClose }) => {
  const [form, setForm] = useState({
    ShopName: '',
    ShopDescription: '',
    LogoImage: null,
    BackgroundImage: null,
    AddressID: '',
    BusinessPermit: null
  });
  const [addresses, setAddresses] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [permitPreview, setPermitPreview] = useState(null);

  useEffect(() => {
    // Fetch user's addresses
    const userData = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('user')) : null;
    if (userData && userData.UserID) {
      axios.get(`/api/addresses?user_id=${userData.UserID}`)
        .then(res => setAddresses(res.data))
        .catch(() => setAddresses([]));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setForm({ ...form, [name]: files[0] });
      if (name === 'LogoImage') setLogoPreview(URL.createObjectURL(files[0]));
      if (name === 'BackgroundImage') setBannerPreview(URL.createObjectURL(files[0]));
      if (name === 'BusinessPermit') setPermitPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend API to register shop
    alert('Shop registered!');
    if (onClose) onClose();
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal" style={{width: '500px', maxWidth: '95vw'}}>
        <button className="auth-modal-close" onClick={onClose}>&times;</button>
        <h2 className="auth-modal-title">Register Shop</h2>
        <form className="auth-modal-content" onSubmit={handleSubmit}>
          <div className="auth-section">
            <div className="auth-section-title">Shop Name</div>
            <input type="text" name="ShopName" value={form.ShopName} onChange={handleChange} required className="auth-input" placeholder="Enter shop name" />
          </div>
          <div className="auth-section">
            <div className="auth-section-title">Description</div>
            <textarea name="ShopDescription" value={form.ShopDescription} onChange={handleChange} required className="auth-input" placeholder="Describe your shop" />
          </div>
          <div className="auth-section">
            <div className="auth-section-title">Logo Image</div>
            <label htmlFor="logo-upload" style={{display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer'}}>
              <div style={{width: 64, height: 64, background: '#f3f4f6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid #eee'}}>
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                  <span style={{fontSize: 36, color: '#2ECC71', fontWeight: 'bold'}}>+</span>
                )}
              </div>
              <span style={{fontWeight: 500, color: '#229954'}}>Upload Logo</span>
              <input id="logo-upload" type="file" name="LogoImage" accept="image/*" onChange={handleChange} style={{display: 'none'}} />
            </label>
          </div>
          <div className="auth-section">
            <div className="auth-section-title">Shop Banner</div>
            <label htmlFor="banner-upload" style={{display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer'}}>
              <div style={{width: 120, height: 64, background: '#f3f4f6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid #eee'}}>
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Banner Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                  <span style={{fontSize: 36, color: '#2ECC71', fontWeight: 'bold'}}>+</span>
                )}
              </div>
              <span style={{fontWeight: 500, color: '#229954'}}>Upload Banner</span>
              <input id="banner-upload" type="file" name="BackgroundImage" accept="image/*" onChange={handleChange} style={{display: 'none'}} />
            </label>
          </div>
          <div className="auth-section">
            <div className="auth-section-title">Address</div>
            <select name="AddressID" value={form.AddressID} onChange={handleChange} required className="auth-input">
              <option value="">Select address</option>
              {addresses.map(addr => (
                <option key={addr.AddressID} value={addr.AddressID}>
                  {addr.Street}, {addr.Barangay}, {addr.Municipality}, {addr.Province}, {addr.ZipCode}
                </option>
              ))}
            </select>
          </div>
          <div className="auth-section">
            <div className="auth-section-title">Business Permit</div>
            <label htmlFor="permit-upload" style={{display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer'}}>
              <div style={{width: 120, height: 64, background: '#f3f4f6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid #eee'}}>
                {permitPreview ? (
                  <img src={permitPreview} alt="Permit Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                  <span style={{fontSize: 36, color: '#2ECC71', fontWeight: 'bold'}}>+</span>
                )}
              </div>
              <span style={{fontWeight: 500, color: '#229954'}}>Upload Permit</span>
              <input id="permit-upload" type="file" name="BusinessPermit" accept="image/*" onChange={handleChange} style={{display: 'none'}} />
            </label>
          </div>
          <div className="auth-modal-actions" style={{flexDirection: 'row', justifyContent: 'center'}}>
            <button type="button" onClick={onClose} className="auth-button" style={{background: 'var(--color-gray)', color: '#fff', marginRight: '0.7rem'}}>Cancel</button>
            <button type="submit" className="auth-button">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShop;
