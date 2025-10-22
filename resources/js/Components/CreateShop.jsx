
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CreateShop = ({ onClose, onShopCreated }) => {
  const [form, setForm] = useState({
    ShopName: '',
    ShopDescription: '',
    LogoImage: null,
    BackgroundImage: null,
    AddressID: localStorage.getItem('lastAddressID') || '',
    BusinessPermit: null,
    hasPhysical: false,
    addressExisting: true,
    Barangay: '',
    Municipality: '',
    ZipCode: '',
    HouseNumber: '',
    Street: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [permitPreview, setPermitPreview] = useState(null);

  useEffect(() => {
    // Fetch user's addresses
    const userData = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('user')) : null;
    if (userData?.UserID) {
      axios.get(`/api/user/${userData.UserID}/addresses`)
        .then(res => setAddresses(res.data))
        .catch(() => setAddresses([]));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (files && files[0]) {
      setForm(prev => ({ ...prev, [name]: files[0] }));
      const url = URL.createObjectURL(files[0]);
      if (name === 'LogoImage') setLogoPreview(url);
      if (name === 'BackgroundImage') setBannerPreview(url);
      if (name === 'BusinessPermit') setPermitPreview(url);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('user')) : null;
    if (!userData?.UserID) {
      alert('User not found. Please login.');
      return;
    }
    let addressId = form.AddressID;
    if (form.addressExisting) {
      const selected = addresses.find(a => (a.AddressID || a.id) == form.AddressID);
      if (!selected) {
        alert('Please select an address.');
        return;
      }
      addressId = selected.AddressID || selected.id;
    } else {
      try {
        const res = await axios.post(`/api/user/${userData.UserID}/addresses`, {
          Street: form.Street,
          Barangay: form.Barangay,
          Municipality: form.Municipality,
          HouseNumber: form.HouseNumber,
          ZipCode: form.ZipCode
        });
        addressId = res.data.AddressID || res.data.id;
      } catch {
        alert('Failed to create address.');
        return;
      }
    }
    const fd = new FormData();
    fd.append('UserID', userData.UserID);
    fd.append('ShopName', form.ShopName);
    fd.append('ShopDescription', form.ShopDescription);
    fd.append('AddressID', String(addressId));
    fd.append('hasPhysical', form.hasPhysical ? 1 : 0);
    if (form.LogoImage instanceof File) fd.append('LogoImage', form.LogoImage);
    if (form.BackgroundImage instanceof File) fd.append('BackgroundImage', form.BackgroundImage);
    if (form.BusinessPermit instanceof File) fd.append('BusinessPermit', form.BusinessPermit);
    try {
      await axios.post('/api/shops', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Shop registered!');
      if (onShopCreated) onShopCreated();
      else if (onClose) onClose();
    } catch {
      alert('Failed to register shop.');
    }
  };

  // Helper for file upload UI
  const FileUpload = ({ id, name, label, preview, onChange, width = 120, height = 64 }) => (
    <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
      <div style={{ width, height, background: '#f3f4f6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid #eee' }}>
        {preview ? (
          <img src={preview} alt={label + ' Preview'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 36, color: '#2ECC71', fontWeight: 'bold' }}>+</span>
        )}
      </div>
      <span style={{ fontWeight: 500, color: '#229954' }}>{label}</span>
      <input id={id} type="file" name={name} accept="image/*" onChange={onChange} style={{ display: 'none' }} />
    </label>
  );

  // Helper for address fields
  const AddressFields = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {['Street', 'Barangay', 'Municipality', 'ZipCode', 'HouseNumber'].map(field => (
        <div key={field}>
          <div style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem' }}>{field.replace(/([A-Z])/g, ' $1').trim()}</div>
          <input
            type="text"
            name={field}
            value={form[field] || ''}
            onChange={handleChange}
            className="auth-input"
            placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
            required
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal" style={{ width: '500px', maxWidth: '95vw' }}>
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
            <FileUpload id="logo-upload" name="LogoImage" label="Upload Logo" preview={logoPreview} onChange={handleChange} width={64} height={64} />
          </div>
          <div className="auth-section">
            <div className="auth-section-title">Shop Banner</div>
            <FileUpload id="banner-upload" name="BackgroundImage" label="Upload Banner" preview={bannerPreview} onChange={handleChange} />
          </div>
          <div className="auth-section">
            <div className="auth-section-title">Address</div>
            <div className="shop-modal-checkbox-wrapper" style={{ marginBottom: '0.7rem' }}>
              <input
                type="checkbox"
                id="addressExisting"
                name="addressExisting"
                checked={form.addressExisting}
                onChange={handleChange}
              />
              <label htmlFor="addressExisting" className="shop-modal-checkbox-label">Existing?</label>
            </div>
            {form.addressExisting ? (
              <div>
                
                <select name="AddressID" value={form.AddressID} onChange={handleChange} required className="auth-input">
                  <option value="">Select address</option>
                  {Array.from(
                    new Map(
                      addresses.map(addr => [
                        `${addr.HouseNumber || addr.houseNumber},${addr.Street || addr.street},${addr.Barangay || addr.barangay},${addr.Municipality || addr.municipality},${addr.ZipCode || addr.zipcode}`,
                        addr
                      ])
                    ).values()
                  ).map(addr => (
                    <option key={addr.AddressID || addr.id} value={addr.AddressID || addr.id}>
                      {addr.HouseNumber || addr.houseNumber}, {addr.Street || addr.street}, {addr.Barangay || addr.barangay}, {addr.Municipality || addr.municipality}, {addr.ZipCode || addr.zipcode}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <AddressFields />
            )}
          </div>
          <div className="auth-section">
            <div className="auth-section-title">Business Permit</div>
            <FileUpload id="permit-upload" name="BusinessPermit" label="Upload Permit" preview={permitPreview} onChange={handleChange} />
          </div>
          <div className="auth-section" style={{ marginTop: '0.5rem' }}>
            <div className="shop-modal-checkbox-wrapper">
              <input
                type="checkbox"
                id="hasPhysical"
                name="hasPhysical"
                checked={form.hasPhysical}
                onChange={handleChange}
              />
              <label htmlFor="hasPhysical" className="shop-modal-checkbox-label">
                Do you have a physical store?
              </label>
            </div>
          </div>
          <div className="auth-modal-actions" style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <button type="button" onClick={onClose} className="auth-button" style={{ background: 'var(--color-gray)', color: '#fff', marginRight: '0.7rem' }}>Cancel</button>
            <button type="submit" className="auth-button">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShop;
