import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CreateShop = ({ onClose }) => {
  const [form, setForm] = useState({
    ShopName: '',
    ShopDescription: '',
    LogoImage: null,
    BackgroundImage: null,
    AddressID: '',
    BusinessPermit: null,
    hasPhysical: false,
    addressExisting: true,
    Barangay: '',
    Municipality: '',
    ZipCode: '',
    HouseNumber: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [permitPreview, setPermitPreview] = useState(null);

  useEffect(() => {
    // Fetch user's addresses
    const userData = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('user')) : null;
    if (userData && userData.UserID) {
      axios.get(`/api/user/${userData.UserID}/addresses`)
        .then(res => setAddresses(res.data))
        .catch(() => setAddresses([]));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (files && files[0]) {
      setForm({ ...form, [name]: files[0] });
      if (name === 'LogoImage') setLogoPreview(URL.createObjectURL(files[0]));
      if (name === 'BackgroundImage') setBannerPreview(URL.createObjectURL(files[0]));
      if (name === 'BusinessPermit') setPermitPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('user')) : null;
    if (!userData || !userData.UserID) {
      alert('User not found. Please login.');
      return;
    }
    let addressString = '';
    let addressId = form.AddressID;
    if (form.addressExisting) {
      const selected = addresses.find(a => (a.AddressID || a.id) == form.AddressID);
      if (selected) {
        addressString = `${selected.HouseNumber || selected.houseNumber}, ${selected.Street || selected.street}, ${selected.Barangay || selected.barangay}, ${selected.Municipality || selected.municipality}, ${selected.ZipCode || selected.zipcode}`;
      }
    } else {
      // Create new address in backend
      try {
        const res = await axios.post(`/api/user/${userData.UserID}/addresses`, {
          Street: form.Street,
          Barangay: form.Barangay,
          Municipality: form.Municipality,
          HouseNumber: form.HouseNumber,
          ZipCode: form.ZipCode
        });
        const addr = res.data;
        addressId = addr.AddressID || addr.id;
        addressString = `${addr.HouseNumber}, ${addr.Street}, ${addr.Barangay}, ${addr.Municipality}, ${addr.ZipCode}`;
      } catch (err) {
        alert('Failed to create address.');
        return;
      }
    }
    // Use FormData to send files
    const fd = new FormData();
    fd.append('UserID', userData.UserID);
    fd.append('ShopName', form.ShopName);
    fd.append('ShopDescription', form.ShopDescription);
    fd.append('Address', addressString);
    fd.append('hasPhysical', form.hasPhysical ? 1 : 0);
    if (form.LogoImage instanceof File) {
      fd.append('LogoImage', form.LogoImage);
    }
    if (form.BackgroundImage instanceof File) {
      fd.append('BackgroundImage', form.BackgroundImage);
    }
    if (form.BusinessPermit instanceof File) {
      fd.append('BusinessPermit', form.BusinessPermit);
    }
    try {
      await axios.post('/api/shops', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Shop registered!');
      if (onClose) onClose();
    } catch (err) {
      alert('Failed to register shop.');
    }
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
            <div className="shop-modal-checkbox-wrapper" style={{marginBottom: '0.7rem'}}>
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
                <div style={{fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem'}}>Select from your existing addresses</div>
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
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <div style={{fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem'}}>Street</div>
                  <input
                    type="text"
                    name="Street"
                    value={form.Street}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="Street"
                    required
                  />
                </div>
                <div>
                  <div style={{fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem'}}>Barangay</div>
                  <input
                    type="text"
                    name="Barangay"
                    value={form.Barangay}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="Barangay"
                    required
                  />
                </div>
                <div>
                  <div style={{fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem'}}>Municipality</div>
                  <input
                    type="text"
                    name="Municipality"
                    value={form.Municipality}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="Municipality"
                    required
                  />
                </div>
                <div>
                  <div style={{fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem'}}>Zip Code</div>
                  <input
                    type="text"
                    name="ZipCode"
                    value={form.ZipCode}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="Zip Code"
                    required
                  />
                </div>
                <div>
                  <div style={{fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem'}}>House Number</div>
                  <input
                    type="text"
                    name="HouseNumber"
                    value={form.HouseNumber}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="House Number"
                    required
                  />
                </div>
              </div>
            )}
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
          <div className="auth-section" style={{marginTop: '0.5rem'}}>
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
