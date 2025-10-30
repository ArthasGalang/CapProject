import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import ReportProductButton from "@/Components/ReportProductButton";
import Footer from '../Components/Footer';
import ShopSidebar from '../Components/ShopSidebar';

const placeholderLogo = 'https://via.placeholder.com/80x80?text=Logo';
const placeholderBanner = 'https://via.placeholder.com/1200x240?text=Banner';

const ShopDetails = ({ shopId }) => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPermitExpanded, setIsPermitExpanded] = useState(false);
  const [address, setAddress] = useState(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState({
    HouseNumber: '',
    Street: '',
    Barangay: '',
    Municipality: '',
    ZipCode: ''
  });
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [newBannerFile, setNewBannerFile] = useState(null);
  const [newLogoFile, setNewLogoFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (!shopId && typeof window !== 'undefined') {
      // Try to get shopId from URL
      const match = window.location.pathname.match(/\/eshop\/(\d+)\//);
      if (match) shopId = match[1];
    }
    if (!shopId) return;
    setLoading(true);
    fetch(`/api/shops/${shopId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch shop details');
        return res.json();
      })
      .then(data => {
        console.log('=== SHOP DETAILS ===');
        console.log('Shop ID:', data.ShopID || shopId);
        console.log('Banner Image:', data.BackgroundImage || data.BannerImage);
        console.log('Logo Image:', data.LogoImage || data.Logo);
        console.log('Description:', data.ShopDescription || data.Description);
        console.log('Business Permit:', data.BusinessPermit);
        console.log('Address ID:', data.AddressID);
        console.log('Full Shop Data:', data);
        console.log('===================');
        setShop(data);
        setLoading(false);
        setEditedDescription(data.ShopDescription || '');
        
        // Fetch address details if AddressID exists
        if (data.AddressID) {
          fetch(`/api/addresses/${data.AddressID}`)
            .then(res => res.json())
            .then(addressData => {
              setAddress(addressData);
              setEditedAddress({
                HouseNumber: addressData.HouseNumber || addressData.houseNumber || '',
                Street: addressData.Street || addressData.street || '',
                Barangay: addressData.Barangay || addressData.barangay || '',
                Municipality: addressData.Municipality || addressData.municipality || '',
                ZipCode: addressData.ZipCode || addressData.zipcode || ''
              });
              console.log('Address Data:', addressData);
            })
            .catch(err => console.error('Error fetching address:', err));
        }
      })
      .catch(err => {
        console.error('Error fetching shop:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [shopId]);

  const handleSaveDescription = async () => {
    try {
      const response = await fetch(`/api/shops/${shopId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ShopDescription: editedDescription })
      });
      if (response.ok) {
        setShop(prev => ({ ...prev, ShopDescription: editedDescription }));
        setIsEditingDescription(false);
        alert('Description updated successfully!');
      } else {
        alert('Failed to update description');
      }
    } catch (err) {
      alert('Error updating description');
    }
  };

  const handleSaveAddress = async () => {
    try {
      const response = await fetch(`/api/addresses/${shop.AddressID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedAddress)
      });
      if (response.ok) {
        setAddress(editedAddress);
        setIsEditingAddress(false);
        alert('Address updated successfully!');
      } else {
        alert('Failed to update address');
      }
    } catch (err) {
      alert('Error updating address');
    }
  };

  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBanner = async () => {
    if (!newBannerFile) return;
    const formData = new FormData();
    formData.append('BackgroundImage', newBannerFile);
    try {
      const response = await fetch(`/api/shops/${shopId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-HTTP-Method-Override': 'PATCH'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setShop(prev => ({ ...prev, BackgroundImage: data.BackgroundImage }));
        setIsEditingBanner(false);
        setNewBannerFile(null);
        setBannerPreview(null);
        alert('Banner updated successfully!');
      } else {
        alert('Failed to update banner');
      }
    } catch (err) {
      alert('Error updating banner');
    }
  };

  const handleSaveLogo = async () => {
    if (!newLogoFile) return;
    const formData = new FormData();
    formData.append('LogoImage', newLogoFile);
    try {
      const response = await fetch(`/api/shops/${shopId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-HTTP-Method-Override': 'PATCH'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setShop(prev => ({ ...prev, LogoImage: data.LogoImage }));
        setIsEditingLogo(false);
        setNewLogoFile(null);
        setLogoPreview(null);
        alert('Logo updated successfully!');
      } else {
        alert('Failed to update logo');
      }
    } catch (err) {
      alert('Error updating logo');
    }
  };

  if (loading) return (
    <>
      <Header />
      <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', gap: '2.5rem' }}>
          <ShopSidebar active="details" shopId={shopId} />
          <div style={{ flex: 1 }}>
            <div style={{ padding: 32, textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, border: '4px solid #e0f7ef', borderTop: '4px solid #22c55e', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
              <span style={{ color: '#1b8a44', marginTop: 12, fontWeight: 500, fontSize: 15, display: 'block' }}>Loading...</span>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
  if (error) return (
    <>
      <Header />
      <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', gap: '2.5rem' }}>
          <ShopSidebar active="details" shopId={shopId} />
          <div style={{ flex: 1 }}>
            <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>Error: {error}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
  if (!shop) return null;

  return (
    <>
      <Header />
      <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', gap: '2.5rem' }}>
          <ShopSidebar active="details" shopId={shopId} />
          <div style={{ flex: 1 }}>
            <div style={{ 
              background: '#fff', 
              borderRadius: 16, 
              boxShadow: '0 2px 16px rgba(44,204,113,0.07)', 
              padding: '2.5rem 2rem',
              width: '100%',
              minHeight: '600px'
            }}>
              {/* Banner Image with Shop Name Overlay */}
              <div style={{ 
                position: 'relative',
                width: '100%', 
                height: '250px', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                marginBottom: '2rem',
                background: shop?.BackgroundImage ? 'none' : 'linear-gradient(135deg, #2ECC71 0%, #1b5e20 100%)'
              }}
              className="banner-container">
                {(bannerPreview || shop?.BackgroundImage) && (
                  <img 
                    src={bannerPreview || `/storage/${shop.BackgroundImage.replace(/^storage\//, '')}`}
                    alt="Shop Banner" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                  />
                )}
                {/* Banner Edit Button */}
                {!isEditingBanner ? (
                  <button
                    onClick={() => setIsEditingBanner(true)}
                    className="banner-edit-button"
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease',
                      opacity: 0,
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(46, 204, 113, 0.9)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.9)'}
                    title="Edit banner"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                ) : (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    display: 'flex',
                    gap: '0.5rem',
                    zIndex: 10
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileChange}
                      style={{ display: 'none' }}
                      id="banner-upload"
                    />
                    <label
                      htmlFor="banner-upload"
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#333',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 0.8rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      Choose File
                    </label>
                    {newBannerFile && (
                      <button
                        onClick={handleSaveBanner}
                        style={{
                          background: 'rgba(46, 204, 113, 0.9)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 0.8rem',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        Save
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsEditingBanner(false);
                        setNewBannerFile(null);
                        setBannerPreview(null);
                      }}
                      style={{
                        background: 'rgba(204, 204, 204, 0.9)',
                        color: '#333',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 0.8rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                  padding: '3rem 2rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end'
                }}>
                  <h1 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 700, 
                    color: '#fff', 
                    margin: 0,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    {shop?.ShopName || 'Shop Details'}
                  </h1>
                  {shop?.LogoImage && (
                    <div style={{ position: 'relative' }} className="logo-container">
                      <div style={{ 
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '12px', 
                        overflow: 'hidden', 
                        border: '3px solid #fff',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        flexShrink: 0
                      }}>
                        <img 
                          src={logoPreview || `/storage/${shop.LogoImage.replace(/^storage\//, '')}`}
                          alt="Shop Logo" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      {/* Logo Edit Button */}
                      {!isEditingLogo ? (
                        <button
                          onClick={() => setIsEditingLogo(true)}
                          className="logo-edit-button"
                          style={{
                            position: 'absolute',
                            bottom: '0.5rem',
                            right: '0.5rem',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            padding: '0.4rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease',
                            opacity: 0
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(46, 204, 113, 0.9)'}
                          onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.9)'}
                          title="Edit logo"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      ) : (
                        <div style={{
                          position: 'absolute',
                          bottom: '-3rem',
                          right: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.3rem',
                          background: 'rgba(0, 0, 0, 0.8)',
                          padding: '0.5rem',
                          borderRadius: '8px'
                        }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoFileChange}
                            style={{ display: 'none' }}
                            id="logo-upload"
                          />
                          <label
                            htmlFor="logo-upload"
                            style={{
                              background: '#fff',
                              color: '#333',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '0.4rem 0.6rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              textAlign: 'center'
                            }}
                          >
                            Choose
                          </label>
                          {newLogoFile && (
                            <button
                              onClick={handleSaveLogo}
                              style={{
                                background: '#2ECC71',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0.4rem 0.6rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: 600
                              }}
                            >
                              Save
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setIsEditingLogo(false);
                              setNewLogoFile(null);
                              setLogoPreview(null);
                            }}
                            style={{
                              background: '#ccc',
                              color: '#333',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '0.4rem 0.6rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 600
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2ECC71', margin: 0 }}>
                    Description
                  </h3>
                  {!isEditingDescription ? (
                    <button
                      onClick={() => setIsEditingDescription(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        color: '#888',
                        padding: '0.25rem',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#2ECC71'}
                      onMouseLeave={(e) => e.target.style.color = '#888'}
                      title="Edit description"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={handleSaveDescription}
                        style={{
                          background: '#2ECC71',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.4rem 0.8rem',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditedDescription(shop?.ShopDescription || '');
                          setIsEditingDescription(false);
                        }}
                        style={{
                          background: '#ccc',
                          color: '#333',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.4rem 0.8rem',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                {isEditingDescription ? (
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    style={{ 
                      width: '100%',
                      minHeight: '100px',
                      fontSize: '1rem', 
                      color: '#555', 
                      lineHeight: '1.6',
                      padding: '1.5rem',
                      background: '#fff',
                      borderRadius: '12px',
                      border: '2px solid #2ECC71',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                ) : (
                  <div style={{ 
                    fontSize: '1rem', 
                    color: '#555', 
                    lineHeight: '1.6',
                    padding: '1.5rem',
                    background: '#f9f9f9',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0'
                  }}>
                    {shop?.ShopDescription || 'No description provided'}
                  </div>
                )}
              </div>

              {/* Address ID */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2ECC71', margin: 0 }}>
                    Address
                  </h3>
                  {!isEditingAddress ? (
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        color: '#888',
                        padding: '0.25rem',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#2ECC71'}
                      onMouseLeave={(e) => e.target.style.color = '#888'}
                      title="Edit address"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={handleSaveAddress}
                        style={{
                          background: '#2ECC71',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.4rem 0.8rem',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditedAddress({
                            HouseNumber: address?.HouseNumber || address?.houseNumber || '',
                            Street: address?.Street || address?.street || '',
                            Barangay: address?.Barangay || address?.barangay || '',
                            Municipality: address?.Municipality || address?.municipality || '',
                            ZipCode: address?.ZipCode || address?.zipcode || ''
                          });
                          setIsEditingAddress(false);
                        }}
                        style={{
                          background: '#ccc',
                          color: '#333',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.4rem 0.8rem',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                {isEditingAddress ? (
                  <div style={{ 
                    padding: '1.5rem',
                    background: '#fff',
                    borderRadius: '12px',
                    border: '2px solid #2ECC71',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                  }}>
                    {['HouseNumber', 'Street', 'Barangay', 'Municipality', 'ZipCode'].map(field => (
                      <div key={field} style={{ gridColumn: field === 'Street' ? '1 / -1' : 'auto' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#555', marginBottom: '0.3rem' }}>
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <input
                          type="text"
                          value={editedAddress[field]}
                          onChange={(e) => setEditedAddress(prev => ({ ...prev, [field]: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.6rem',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    fontSize: '1rem', 
                    color: '#555', 
                    lineHeight: '1.6',
                    padding: '1.5rem',
                    background: '#f9f9f9',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0'
                  }}>
                    {address ? (
                      <>
                        {[
                          address.HouseNumber || address.houseNumber,
                          address.Street || address.street,
                          address.Barangay || address.barangay,
                          address.Municipality || address.municipality,
                          address.ZipCode || address.zipcode
                        ].filter(Boolean).join(', ')}
                      </>
                    ) : shop?.AddressID ? (
                      'Loading address...'
                    ) : (
                      'No address available'
                    )}
                  </div>
                )}
              </div>

              {/* Business Permit */}
              <div style={{ marginBottom: '2rem' }}>
                <div 
                  onClick={() => setIsPermitExpanded(!isPermitExpanded)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    padding: '0.75rem 1rem',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    marginBottom: '0.5rem'
                  }}
                >
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2ECC71', margin: 0 }}>
                    Business Permit
                  </h3>
                  <span style={{ 
                    fontSize: '1.5rem', 
                    color: '#2ECC71',
                    transform: isPermitExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}>
                    ▼
                  </span>
                </div>
                {isPermitExpanded && (
                  <div style={{ 
                    marginTop: '1rem',
                    animation: 'slideDown 0.3s ease-out'
                  }}>
                    {shop?.BusinessPermit ? (
                      <div style={{ width: '300px', height: '400px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e0e0e0' }}>
                        <img 
                          src={`/storage/${shop.BusinessPermit.replace(/^storage\//, '')}`}
                          alt="Business Permit" 
                          style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#f5f5f5' }}
                        />
                      </div>
                    ) : (
                      <p style={{ color: '#888' }}>No business permit uploaded</p>
                    )}
                  </div>
                )}
              </div>
              <style>{`
                @keyframes slideDown {
                  from {
                    opacity: 0;
                    transform: translateY(-10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                .banner-container:hover .banner-edit-button {
                  opacity: 1 !important;
                }
                .logo-container:hover .logo-edit-button {
                  opacity: 1 !important;
                }
              `}</style>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ShopDetails;
