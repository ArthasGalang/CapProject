
import Header from "../Components/Header";
import { User } from "lucide-react";
import Footer from "../Components/Footer";
import AccountSidebar from "../Components/AccountSidebar";
import FloatingChatButton from "../Components/FloatingChatButton";

import React, { useState, useEffect } from 'react';

const Account = () => {
  let user = null;
  try {
    user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  } catch (e) {
    user = null;
  }

  return (
    <>
      <Header />
      <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', minHeight: 'calc(100vh - 70px)', width: '100%', maxWidth: 1400, margin: '0 auto', paddingTop: '2.5rem', position: 'relative'}}>
        <div style={{minWidth: 240, maxWidth: 280, marginRight: '2.5rem'}}>
          <AccountSidebar active="profile" />
        </div>
            <section className="account-section" style={{flex: 1, maxWidth: 1200, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '2.2rem', position: 'relative'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <h2 className="account-title" style={{marginBottom: '0.7rem', fontSize: '2.1rem', fontWeight: 700, color: 'var(--color-primary)'}}>Account Details</h2>
              </div>

              <AccountDetailsCard />
            </section>
        {/* Floating Chat Button */}
        <FloatingChatButton onClick={() => alert('Open chat window')} />
      </div>
      <Footer />
    </>
  );
};

export default Account;

/* ---------------- AccountDetailsCard component (inline) ---------------- */
function AccountDetailsCard() {
  const [user, setUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [form, setForm] = useState({
    FirstName: '', LastName: '', Email: '', ContactNumber: '', HouseNumber: '', Barangay: '', Municipality: '', Zipcode: '', SelectedAddress: '', Active: true, Status: 'Active'
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        setUser(u);
        setForm(prev => ({...prev, ...u}));
        // Ensure Status exists (backwards-compatibility with boolean Active)
        if (!u.Status) {
          setForm(prev => ({...prev, Status: u.Active ? 'Active' : 'Offline'}));
        }
        if (u.Avatar) setAvatarPreview(u.Avatar);
        // load saved addresses from localStorage
        const aRaw = localStorage.getItem('addresses');
        if (aRaw) {
          try {
            const arr = JSON.parse(aRaw);
            if (Array.isArray(arr)) setSavedAddresses(arr);
          } catch (e) {}
        } else {
          // if no addresses array, but user has address components, add one
          const addr = `${u.HouseNumber || ''}${u.Barangay ? ', ' + u.Barangay : ''}${u.Municipality ? ', ' + u.Municipality : ''}${u.Zipcode ? ', ' + u.Zipcode : ''}`.trim();
          if (addr) setSavedAddresses([addr]);
        }
      }
    } catch (e) {}
  }, []);

  const update = (key, val) => setForm(f => ({...f, [key]: val}));

  const handleAvatar = e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
      update('Avatar', reader.result);
    };
    reader.readAsDataURL(file);
  }

  const save = () => {
    try {
      localStorage.setItem('user', JSON.stringify(form));
      alert('Saved to localStorage');
    } catch (e) {
      alert('Save failed');
    }
  }

  const reset = () => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setForm(JSON.parse(raw));
      else setForm({FirstName:'',LastName:'',Email:'',ContactNumber:'',HouseNumber:'',Barangay:'',Municipality:'',Zipcode:'',Active:true,DefaultAddress:false});
    } catch (e) {}
  }
  const getDefaultAddressText = () => {
    if (form.SelectedAddress) return form.SelectedAddress;
    const parts = [];
    if (form.HouseNumber) parts.push(form.HouseNumber);
    if (form.Barangay) parts.push(form.Barangay);
    if (form.Municipality) parts.push(form.Municipality);
    if (form.Zipcode) parts.push(form.Zipcode);
    return parts.length ? parts.join(', ') : 'Not set';
  }

  // When form is hidden, show the formatted info with avatar and label/value table
  if (!showForm) {
    const defaultAddressText = getDefaultAddressText();
    return (
      <div style={{display:'flex', justifyContent:'center', marginTop:24, marginBottom:24}}>
        <div style={{width:560}}>
          <div style={{background:'#fbfffb', borderRadius:12}}>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:20}}>
              {/* Avatar + status (clickable) */}
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginBottom: 22}}>
                <div style={{position:'relative'}}>
                  <div
                    onClick={() => setStatusMenuOpen(s => !s)}
                    title="Click to change status"
                    style={{width:110, height:110, borderRadius:999, overflow:'hidden', border:'4px solid var(--color-primary)', display:'flex', alignItems:'center', justifyContent:'center', background:'#fff', cursor:'pointer'}}
                  >
                    {avatarPreview ? <img src={avatarPreview} alt="avatar" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <User size={48} color={'var(--color-primary)'} />}
                  </div>
                  <div style={{position:'absolute', right:6, bottom:6, width:14, height:14, borderRadius:999, border:'2px solid #fff', background: form.Status === 'Active' ? '#2ecc71' : form.Status === 'Busy' ? '#f3c623' : '#9aa0a6'}} />

                  {statusMenuOpen && (
                    <div style={{position:'absolute', top:100, right:0, background:'#fff', border:'1px solid #e6e6e6', borderRadius:8, boxShadow:'0 6px 18px rgba(0,0,0,0.08)', padding:8, zIndex:40}}>
                      {['Active','Busy','Offline'].map(s => (
                        <div key={s} onClick={() => {
                          setStatusMenuOpen(false);
                          const status = s;
                          setForm(prev => {
                            const updated = {...prev, Status: status, Active: status === 'Active'};
                            try { localStorage.setItem('user', JSON.stringify(updated)); } catch (err) {}
                            setUser && typeof setUser === 'function' && setUser(updated);
                            return updated;
                          });
                        }} style={{padding:'8px 12px', cursor:'pointer', borderRadius:6, display:'flex', alignItems:'center', gap:8}}>
                          <span style={{width:10, height:10, borderRadius:999, background: s === 'Active' ? '#2ecc71' : s === 'Busy' ? '#f3c623' : '#9aa0a6'}} />
                          <span style={{fontSize:13}}>{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Info table: labels | divider | values - stacked under avatar */}
              <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <div style={{display:'flex', alignItems:'stretch', width:'100%', maxWidth:420}}>
                  <div style={{flex:'0 0 40%', display:'flex', flexDirection:'column', justifyContent:'center', gap:14, paddingRight:12}}>
                    <div style={{color:'#222', fontSize:14}}>Name:</div>
                    <div style={{color:'#222', fontSize:14}}>Email:</div>
                    <div style={{color:'#222', fontSize:14}}>Contact Number:</div>
                    <div style={{color:'#222', fontSize:14}}>Default Address:</div>
                  </div>

                  <div style={{width:1, background:'#e6e6e6', marginRight:12}} />

                  <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:14}}>
                    <div style={{fontWeight:700}}>{form.FirstName ? `${form.FirstName} ${form.LastName}` : '—'}</div>
                    <div style={{color:'#666'}}>{form.Email || '—'}</div>
                    <div style={{color:'#666'}}>{form.ContactNumber || '—'}</div>
                    <div style={{fontWeight:700}}>{defaultAddressText}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{height:1, background:'#eefaf0', margin:'12px 0'}} />

            <div style={{marginTop:8, display:'flex', justifyContent:'center'}}>
              <button onClick={() => setShowForm(true)} style={{background:'var(--color-primary)', color:'#fff', padding:'10px 14px', borderRadius:8, border:'none', fontWeight:700, marginTop: 22}}>Edit Details</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Form visible: show single-column card — avatar on top, form below (replaces uneditable info)
  return (
    <div style={{maxWidth:520, margin:'0 auto'}}>
      <div style={{background:'#fbfffb', padding:18, borderRadius:12, display:'flex', flexDirection:'column', gap:12, alignItems:'center'}}>
        <div style={{width:110, height:110, borderRadius:999, overflow:'hidden', border:'4px solid var(--color-primary)', display:'flex', alignItems:'center', justifyContent:'center', background:'#fff'}}>
          {avatarPreview ? <img src={avatarPreview} alt="avatar" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <User size={48} color={'var(--color-primary)'} />}
        </div>
        <label style={{cursor:'pointer', color:'var(--color-primary)', fontWeight:700, fontSize:13}}>
          Change avatar
          <input type="file" accept="image/*" onChange={handleAvatar} style={{display:'none'}} />
        </label>

        {/* Editable form appears directly under avatar while editing */}
        <div style={{width:'100%'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div>
              <label style={{display:'block', fontSize:13, color:'#444', marginBottom:6}}>First name</label>
              <input value={form.FirstName} onChange={e => update('FirstName', e.target.value)} style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #e6e6e6'}} />
            </div>
            <div>
              <label style={{display:'block', fontSize:13, color:'#444', marginBottom:6}}>Last name</label>
              <input value={form.LastName} onChange={e => update('LastName', e.target.value)} style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #e6e6e6'}} />
            </div>
          </div>

          <div style={{marginTop:12}}>
            <label style={{display:'block', fontSize:13, color:'#444', marginBottom:6}}>Email</label>
            <input value={form.Email} onChange={e => update('Email', e.target.value)} style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #e6e6e6'}} />
          </div>

          <div style={{marginTop:12}}>
            <label style={{display:'block', fontSize:13, color:'#444', marginBottom:6}}>Contact number</label>
            <input value={form.ContactNumber} onChange={e => update('ContactNumber', e.target.value)} style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #e6e6e6'}} />
          </div>

          {/* Removed House / Unit and Barangay fields as requested */}

          <div style={{marginTop:12}}>
            <label style={{display:'block', fontSize:13, color:'#444', marginBottom:6}}>Select saved address</label>
            <select value={form.SelectedAddress} onChange={e => update('SelectedAddress', e.target.value)} style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #e6e6e6'}}>
              <option value="">-- Select address --</option>
              {savedAddresses.map((a, i) => (
                <option key={i} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div style={{marginTop:18, display:'flex', gap:10, justifyContent:'center'}}>
            <button onClick={save} style={{background:'var(--color-primary)', color:'#fff', padding:'10px 14px', borderRadius:8, border:'none', fontWeight:700}}>Save</button>
            <button onClick={reset} style={{background:'#fff', color:'#444', padding:'10px 14px', borderRadius:8, border:'1px solid #e6e6e6'}}>Reset</button>
            <button onClick={() => setShowForm(false)} style={{background:'#fff', color:'#666', padding:'10px 14px', borderRadius:8, border:'1px solid #eee'}}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
