import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import AccountSidebar from "../Components/AccountSidebar";

const AccountAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({
    HouseNumber: '',
    Street: '',
    Barangay: '',
    Municipality: '',
    ZipCode: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const user = (() => {
    try {
      return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!user || !user.UserID) {
      setLoading(false);
      return;
    }
    fetch(`/api/addresses?user_id=${user.UserID}`)
      .then(res => res.json())
      .then(data => {
        setAddresses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  return (
    <>
      <Header />
      <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', minHeight: 'calc(100vh - 70px)', width: '100%', maxWidth: 1400, margin: '0 auto', paddingTop: '2.5rem'}}>
        <div style={{minWidth: 240, maxWidth: 280, marginRight: '2.5rem'}}>
          <AccountSidebar active="addresses" />
        </div>
  <section className="account-section" style={{flex: 1, maxWidth: 1200, minHeight: '700px', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '2.7rem 2.2rem', position: 'relative'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
            <h2 className="account-title" style={{marginBottom: '0.7rem', fontSize: '2.1rem', fontWeight: 700, color: 'var(--color-primary)'}}>Addresses</h2>
            <div style={{width: '100%', marginTop: '2.2rem'}}>
              {loading ? (
                <div style={{textAlign: 'center', color: '#888'}}>Loading...</div>
              ) : (
                <>
                  <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '1.05rem', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px #0001'}}>
                    <thead>
                      <tr style={{background: '#f8f8f8', color: '#22c55e', fontWeight: 700}}>
                        <th style={{padding: '1rem 0.7rem', borderBottom: '2px solid #eaeaea', textAlign: 'center'}}>AddressID</th>
                        <th style={{padding: '1rem 0.7rem', borderBottom: '2px solid #eaeaea', textAlign: 'center'}}>HouseNumber</th>
                        <th style={{padding: '1rem 0.7rem', borderBottom: '2px solid #eaeaea', textAlign: 'center'}}>Street</th>
                        <th style={{padding: '1rem 0.7rem', borderBottom: '2px solid #eaeaea', textAlign: 'center'}}>Barangay</th>
                        <th style={{padding: '1rem 0.7rem', borderBottom: '2px solid #eaeaea', textAlign: 'center'}}>Municipality</th>
                        <th style={{padding: '1rem 0.7rem', borderBottom: '2px solid #eaeaea', textAlign: 'center'}}>ZipCode</th>
                        <th style={{padding: '1rem 0.7rem', borderBottom: '2px solid #eaeaea', textAlign: 'center'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addresses.length === 0 && !adding ? (
                        <tr><td colSpan={7} style={{textAlign: 'center', padding: '2rem', color: '#888'}}>No addresses found.</td></tr>
                      ) : (
                        <>
                          {addresses.map(addr => (
                            <tr key={addr.AddressID} style={{borderBottom: '1px solid #f0f0f0'}}>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>{addr.AddressID}</td>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>{addr.HouseNumber}</td>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>{addr.Street}</td>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>{addr.Barangay}</td>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>{addr.Municipality}</td>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>{addr.ZipCode}</td>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>
                                <button
                                  style={{
                                    background: '#e8fff2',
                                    color: '#22c55e',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.4rem 1.1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    marginRight: '0.5rem',
                                    transition: 'background 0.2s, color 0.2s',
                                  }}
                                  onMouseOver={e => {
                                    e.currentTarget.style.background = '#22c55e';
                                    e.currentTarget.style.color = '#fff';
                                  }}
                                  onMouseOut={e => {
                                    e.currentTarget.style.background = '#e8fff2';
                                    e.currentTarget.style.color = '#22c55e';
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  style={{
                                    background: '#ffeded',
                                    color: '#e53935',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.4rem 1.1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s, color 0.2s',
                                  }}
                                  onMouseOver={e => {
                                    e.currentTarget.style.background = '#e53935';
                                    e.currentTarget.style.color = '#fff';
                                  }}
                                  onMouseOut={e => {
                                    e.currentTarget.style.background = '#ffeded';
                                    e.currentTarget.style.color = '#e53935';
                                  }}
                                  onClick={() => {
                                    setDeleteTarget(addr);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  Delete
                                </button>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.18)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            padding: '2.2rem 2.5rem',
            minWidth: '340px',
            textAlign: 'center',
          }}>
            <div style={{fontWeight: 700, fontSize: '1.18rem', marginBottom: '0.7rem', color: '#e53935'}}>Delete Address</div>
            <div style={{marginBottom: '1.2rem', color: '#444'}}>Are you sure you want to delete this address?</div>
            <div style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}>
              <button
                style={{
                  background: '#ffeded',
                  color: '#e53935',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1.5rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#e53935';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#ffeded';
                  e.currentTarget.style.color = '#e53935';
                }}
                onClick={async () => {
                  if (!deleteTarget) return;
                  try {
                    const res = await fetch(`/api/addresses/${deleteTarget.AddressID}`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    });
                    if (res.ok) {
                      // Refresh addresses
                      const refreshed = await fetch(`/api/addresses?user_id=${user.UserID}`);
                      const data = await refreshed.json();
                      setAddresses(Array.isArray(data) ? data : []);
                      setShowDeleteModal(false);
                      setDeleteTarget(null);
                    } else {
                      setShowDeleteModal(false);
                      setDeleteTarget(null);
                      alert('Failed to delete address.');
                    }
                  } catch {
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                    alert('Failed to delete address.');
                  }
                }}
              >
                Delete
              </button>
              <button
                style={{
                  background: '#e3edff',
                  color: '#2563eb',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1.5rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#2563eb';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#e3edff';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
                              </td>
                            </tr>
                          ))}
                          {adding && (
                            <tr style={{borderBottom: '1px solid #f0f0f0', background: '#f8f8f8'}}>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>—</td>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>
                                <input
                                  type="text"
                                  value={newAddress.HouseNumber}
                                  onChange={e => setNewAddress({...newAddress, HouseNumber: e.target.value})}
                                  style={{width: '100px', padding: '0.3rem', borderRadius: '5px', border: '1px solid #eaeaea', textAlign: 'center'}}
                                  placeholder="House #"
                                />
                              </td>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>
                                <input
                                  type="text"
                                  value={newAddress.Street}
                                  onChange={e => setNewAddress({...newAddress, Street: e.target.value})}
                                  style={{width: '120px', padding: '0.3rem', borderRadius: '5px', border: '1px solid #eaeaea', textAlign: 'center'}}
                                  placeholder="Street"
                                />
                              </td>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>
                                <input
                                  type="text"
                                  value={newAddress.Barangay}
                                  onChange={e => setNewAddress({...newAddress, Barangay: e.target.value})}
                                  style={{width: '100px', padding: '0.3rem', borderRadius: '5px', border: '1px solid #eaeaea', textAlign: 'center'}}
                                  placeholder="Barangay"
                                />
                              </td>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>
                                <input
                                  type="text"
                                  value={newAddress.Municipality}
                                  onChange={e => setNewAddress({...newAddress, Municipality: e.target.value})}
                                  style={{width: '120px', padding: '0.3rem', borderRadius: '5px', border: '1px solid #eaeaea', textAlign: 'center'}}
                                  placeholder="Municipality"
                                />
                              </td>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>
                                <input
                                  type="text"
                                  value={newAddress.ZipCode}
                                  onChange={e => setNewAddress({...newAddress, ZipCode: e.target.value})}
                                  style={{width: '80px', padding: '0.3rem', borderRadius: '5px', border: '1px solid #eaeaea', textAlign: 'center'}}
                                  placeholder="ZipCode"
                                />
                              </td>
                              <td style={{padding: '0.8rem 0.7rem', textAlign: 'center'}}>
                                <button
                                  style={{
                                    background: '#e3edff',
                                    color: '#2563eb',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.4rem 1.1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s, color 0.2s',
                                    marginRight: '0.5rem',
                                  }}
                                  onMouseOver={e => {
                                    e.currentTarget.style.background = '#2563eb';
                                    e.currentTarget.style.color = '#fff';
                                  }}
                                  onMouseOut={e => {
                                    e.currentTarget.style.background = '#e3edff';
                                    e.currentTarget.style.color = '#2563eb';
                                  }}
                                  onClick={async () => {
                                    if (!user || !user.UserID) return;
                                    const payload = {
                                      UserID: user.UserID,
                                      HouseNumber: newAddress.HouseNumber,
                                      Street: newAddress.Street,
                                      Barangay: newAddress.Barangay,
                                      Municipality: newAddress.Municipality,
                                      ZipCode: newAddress.ZipCode
                                    };
                                    try {
                                      const res = await fetch('/api/addresses', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(payload)
                                      });
                                      if (res.ok) {
                                        // Refresh addresses
                                        const refreshed = await fetch(`/api/addresses?user_id=${user.UserID}`);
                                        const data = await refreshed.json();
                                        setAddresses(Array.isArray(data) ? data : []);
                                        setAdding(false);
                                        setNewAddress({HouseNumber: '', Street: '', Barangay: '', Municipality: '', ZipCode: ''});
                                      } else {
                                        setAdding(false);
                                        setNewAddress({HouseNumber: '', Street: '', Barangay: '', Municipality: '', ZipCode: ''});
                                        alert('Failed to save address.');
                                      }
                                    } catch {
                                      alert('Failed to save address.');
                                    }
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  style={{
                                    background: '#ffeded',
                                    color: '#e53935',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.4rem 1.1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s, color 0.2s',  
                                  }}
                                  onMouseOver={e => {
                                    e.currentTarget.style.background = '#e53935';
                                    e.currentTarget.style.color = '#fff';
                                  }}
                                  onMouseOut={e => {
                                    e.currentTarget.style.background = '#ffeded';
                                    e.currentTarget.style.color = '#e53935';
                                  }}
                                  onClick={() => {
                                    setAdding(false);
                                    setNewAddress({HouseNumber: '', Street: '', Barangay: '', Municipality: '', ZipCode: ''});
                                  }}
                                >
                                  Close
                                </button>
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                    </tbody>
                  </table>
                  <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '2.2rem'}}>
                    <button
                      style={{
                        background: '#fff',
                        color: '#22c55e',
                        border: '2px solid #22c55e',
                        borderRadius: '8px',
                        padding: '0.8rem 2.2rem',
                        fontWeight: 700,
                        fontSize: '1.08rem',
                        boxShadow: '0 2px 8px #22c55e11',
                        cursor: 'pointer',
                        transition: 'background 0.2s, color 0.2s',
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = '#22c55e';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.color = '#22c55e';
                      }}
                      onClick={() => setAdding(true)}
                      disabled={adding}
                    >
                      Add Address
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AccountAddresses;
