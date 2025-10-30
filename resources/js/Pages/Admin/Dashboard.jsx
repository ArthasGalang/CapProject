import React, { useState, useEffect } from "react";
import { FaUser, FaCheck, FaClipboardList, FaEnvelope } from "react-icons/fa";
import AdminLayout from "@/Components/Admin/AdminLayout";
import axios from "axios";
import UserAvatar from "@/Components/Admin/UserAvatar";





function Dashboard() {
  const [invalidUserIDs, setInvalidUserIDs] = useState([]);
  const [specifyUsers, setSpecifyUsers] = useState(false);
  const [receiverIDsInput, setReceiverIDsInput] = useState("");
  const [receiverIDsList, setReceiverIDsList] = useState([]);
  const [showAnnConfirm, setShowAnnConfirm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);
  const handlePostAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
    setShowAnnConfirm(true);
  };

  const confirmPostAnnouncement = async () => {
    if (specifyUsers && invalidUserIDs.length > 0) {
      alert("Please remove all invalid users before posting.");
      return;
    }
    setPostingAnnouncement(true);
    try {
      let receiverIDs = [];
      if (specifyUsers && receiverIDsList.length > 0) {
        receiverIDs = receiverIDsList;
      }
      await axios.post("http://127.0.0.1:8000/api/announcements", {
        Content: newAnnouncement,
        ReceiverIDs: JSON.stringify(receiverIDs)
      });
      setNewAnnouncement("");
      setReceiverIDsInput("");
      setReceiverIDsList([]);
      setInvalidUserIDs([]);
      setSpecifyUsers(false);
      const resp = await axios.get("http://127.0.0.1:8000/api/announcements");
      setAnnouncements(resp.data);
    } catch (err) {
      alert("Failed to post announcement.");
    }
    setPostingAnnouncement(false);
    setShowAnnConfirm(false);
  };
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/announcements")
      .then(response => {
        setAnnouncements(response.data);
        console.log("Fetched announcements:", response.data);
      })
      .catch(error => setAnnouncements([]));
  }, []);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDetails, setReportDetails] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  // Handle status update or delete
  const handleAction = async () => {
    if (!shopDetails || !confirmAction) return;
    setLoadingAction(true);
    try {
      if (confirmAction === 'delete') {
        await axios.delete(`http://127.0.0.1:8000/api/shops/${shopDetails.ShopID}`);
        setShowShopModal(false);
        setShopDetails(null);
        // Optionally refresh shops list
        axios.get("http://127.0.0.1:8000/api/shops").then(response => setShops(response.data.slice(0, 5)));
      } else if (['verify', 'reject', 'revert'].includes(confirmAction)) {
        let newStatus = shopDetails.Verification;
        if (confirmAction === 'verify') newStatus = 'Verified';
        if (confirmAction === 'reject') newStatus = 'Rejected';
        if (confirmAction === 'revert') newStatus = 'Pending';
        await axios.patch(`http://127.0.0.1:8000/api/shops/${shopDetails.ShopID}`, { Verification: newStatus });
        // Refetch shop details
        const resp = await axios.get(`http://127.0.0.1:8000/api/shops/${shopDetails.ShopID}`);
        setShopDetails(resp.data);
        // Optionally refresh shops list
        axios.get("http://127.0.0.1:8000/api/shops").then(response => setShops(response.data.slice(0, 5)));
      }
    } catch (err) {
      alert('Action failed.');
    }
    setLoadingAction(false);
    setShowConfirm(false);
    setConfirmAction(null);
    setConfirmText('');
  };
  const [addressString, setAddressString] = useState('');
  const [showPermit, setShowPermit] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopDetails, setShopDetails] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [shops, setShops] = useState([]);
  useEffect(() => {
    // Fetch address when shopDetails changes
    if (showShopModal && shopDetails && shopDetails.AddressID) {
      axios.get(`http://127.0.0.1:8000/api/addresses/${shopDetails.AddressID}`)
        .then(response => {
          const addr = response.data;
          console.log('Fetched address:', addr); // Show address object in console
          if (addr && !addr.error) {
            const parts = [addr.HouseNumber, addr.Street, addr.Barangay, addr.Municipality, addr.ZipCode].filter(Boolean);
            setAddressString(parts.join(', '));
          } else {
            setAddressString('-');
          }
        })
        .catch(() => setAddressString('-'));
    } else {
      setAddressString('');
    }
    axios.get("http://127.0.0.1:8000/api/reports/view")
      .then(response => {
        setRecentReports(response.data.slice(0, 5));
        console.log("Fetched reports view:", response.data);
      })
      .catch(error => console.error("Error fetching reports view:", error));

    axios.get("http://127.0.0.1:8000/api/shops")
      .then(response => {
        setShops(response.data.slice(0, 5));
        console.log("Fetched shops:", response.data);
      })
      .catch(error => console.error("Error fetching shops:", error));
  }, []);
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/reports")
      .then(response => {
        console.log("Fetched reports:", response.data);
      })
      .catch(error => console.error("Error fetching reports:", error));
  }, []);

  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState(0);
  const [openReports, setOpenReports] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/users")
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));

    axios.get("http://127.0.0.1:8000/api/shops")
      .then(response => {
        const pendingCount = Array.isArray(response.data)
          ? response.data.filter(shop => shop.Verification === 'Pending').length
          : 0;
        setPendingVerifications(pendingCount);
      })
      .catch(error => setPendingVerifications(0));

    axios.get("http://127.0.0.1:8000/api/reports/open-count")
      .then(response => setOpenReports(response.data.open_reports))
      .catch(error => setOpenReports(0));

    axios.get("http://127.0.0.1:8000/api/adminmessages/unread-count")
      .then(response => setUnreadMessages(response.data.unread_messages))
      .catch(error => setUnreadMessages(0));
  }, []);

  return (
    <AdminLayout>
      {/* Shop Registration Modal */}
      {showShopModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.38)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 22, padding: '48px 56px 40px 56px', minWidth: 600, maxWidth: 720, boxShadow: '0 8px 48px rgba(0,0,0,0.22)', position: 'relative', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
            <button onClick={() => { setShowShopModal(false); setShopDetails(null); setShowPermit(false); }} style={{ position: 'absolute', top: 18, right: 18, background: '#f3f4f6', border: 'none', fontSize: 22, cursor: 'pointer', color: '#374151', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>&times;</button>
            {shopDetails ? (
              <React.Fragment>
                {/* Social Media Links */}
                {(shopDetails.Facebook || shopDetails.Instagram || shopDetails.X || shopDetails.TikTok) ? (
                  <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 18, marginTop: 8 }}>
                    {shopDetails.Facebook ? (
                      <a href={shopDetails.Facebook.startsWith('http') ? shopDetails.Facebook : `https://facebook.com/${shopDetails.Facebook}`} target="_blank" rel="noopener noreferrer" title="Facebook">
                        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" style={{ width: 32, height: 32, filter: 'grayscale(0.2)', borderRadius: 6, background: '#f3f4f6', padding: 3 }} />
                      </a>
                    ) : null}
                    {shopDetails.Instagram ? (
                      <a href={shopDetails.Instagram.startsWith('http') ? shopDetails.Instagram : `https://instagram.com/${shopDetails.Instagram}`} target="_blank" rel="noopener noreferrer" title="Instagram">
                        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" style={{ width: 32, height: 32, filter: 'grayscale(0.2)', borderRadius: 6, background: '#f3f4f6', padding: 3 }} />
                      </a>
                    ) : null}
                    {shopDetails.X ? (
                      <a href={shopDetails.X.startsWith('http') ? shopDetails.X : `https://x.com/${shopDetails.X}`} target="_blank" rel="noopener noreferrer" title="X">
                        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" alt="X" style={{ width: 32, height: 32, filter: 'grayscale(0.2)', borderRadius: 6, background: '#f3f4f6', padding: 3 }} />
                      </a>
                    ) : null}
                    {shopDetails.TikTok ? (
                      <a href={shopDetails.TikTok.startsWith('http') ? shopDetails.TikTok : `https://tiktok.com/@${shopDetails.TikTok}`} target="_blank" rel="noopener noreferrer" title="TikTok">
                        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg" alt="TikTok" style={{ width: 32, height: 32, filter: 'grayscale(0.2)', borderRadius: 6, background: '#f3f4f6', padding: 3 }} />
                      </a>
                    ) : null}
                  </div>
                ) : null}
                <div style={{ marginBottom: 24 }}>
                  {/* Background Image Above Logo/Name */}
                  {shopDetails.BackgroundImage ? (
                    <img
                      src={shopDetails.BackgroundImage.startsWith('http') ? shopDetails.BackgroundImage : `/storage/${shopDetails.BackgroundImage}`}
                      alt="Background"
                      style={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderTopLeftRadius: 18,
                        borderTopRightRadius: 18,
                        borderRadius: '18px 18px 0 0',
                        marginBottom: 18,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                      }}
                    />
                  ) : null}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 28, paddingLeft: 18 }}>
                    {shopDetails.LogoImage ? (
                      <img src={shopDetails.LogoImage.startsWith('http') ? shopDetails.LogoImage : `/storage/${shopDetails.LogoImage}`} alt="Logo" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 12, border: '1.5px solid #e5e7eb', background: '#f9fafb', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
                    ) : (
                      <div style={{ width: 56, height: 56, borderRadius: 12, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 28 }}>🏬</div>
                    )}
                    <div>
                      <h2 style={{ fontWeight: 800, fontSize: 28, margin: 0, color: '#2563eb', letterSpacing: '-1px' }}>{shopDetails.ShopName || shopDetails.name}</h2>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 17, color: '#374151', marginBottom: 22, background: '#f9fafb', borderRadius: 10, padding: '16px 18px', border: '1.5px solid #e5e7eb', fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <strong style={{ color: '#2563eb', fontWeight: 700 }}>Description:</strong> {shopDetails.ShopDescription || '-'}
                </div>
                {/* Removed extra background image section below logo/name */}
                <div style={{ marginBottom: 14, fontSize: 16 }}><strong style={{ color: '#374151' }}>Owner UserID:</strong> {shopDetails.UserID || '-'}</div>
                <div style={{ marginBottom: 14, fontSize: 16 }}><strong style={{ color: '#374151' }}>Address:</strong> {addressString || '-'}</div>
                <div style={{ marginBottom: 14, fontSize: 16 }}><strong style={{ color: '#374151' }}>Registered At:</strong> {shopDetails.created_at ? new Date(shopDetails.created_at).toLocaleString() : '-'}</div>
                <div style={{ marginBottom: 14, fontSize: 16 }}><strong style={{ color: '#374151' }}>Status:</strong> {
                  shopDetails.Verification === 'Verified' ? (
                    <span style={{ background: '#d1fae5', color: '#047857', fontWeight: 600, fontSize: 15, borderRadius: 7, padding: '3px 12px', marginLeft: 10 }}>Verified</span>
                  ) : shopDetails.Verification === 'Pending' ? (
                    <span style={{ background: '#fef3c7', color: '#b45309', fontWeight: 600, fontSize: 15, borderRadius: 7, padding: '3px 12px', marginLeft: 10 }}>Pending</span>
                  ) : shopDetails.Verification === 'Rejected' ? (
                    <span style={{ background: '#fee2e2', color: '#b91c1c', fontWeight: 600, fontSize: 15, borderRadius: 7, padding: '3px 12px', marginLeft: 10 }}>Rejected</span>
                  ) : (
                    <span style={{ background: '#f3f4f6', color: '#6b7280', fontWeight: 600, fontSize: 15, borderRadius: 7, padding: '3px 12px', marginLeft: 10 }}>Unknown</span>
                  )
                }
                </div>
                <div style={{ marginBottom: 8, fontSize: 16 }}><strong style={{ color: '#374151' }}>Has Physical Store:</strong> {shopDetails.hasPhysical === 1 || shopDetails.hasPhysical === true ? 'Yes' : 'No'}</div>
                <div style={{ marginBottom: 0, fontSize: 16, marginTop: 10 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6, color: '#374151' }}>Business Permit</div>
                  {shopDetails.BusinessPermit ? (
                    <div>
                      <button
                        style={{ background: showPermit ? '#374151' : '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 14px', fontWeight: 500, cursor: 'pointer', marginTop: 6, marginBottom: 6, fontSize: 14 }}
                        onClick={() => setShowPermit(v => !v)}
                      >{showPermit ? 'Hide Permit' : 'Show Permit'}</button>
                      {showPermit && (
                        <img src={shopDetails.BusinessPermit.startsWith('http') ? shopDetails.BusinessPermit : `/storage/${shopDetails.BusinessPermit}`} alt="Permit" style={{ width: '100%', maxHeight: 180, objectFit: 'contain', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#f9fafb', marginTop: 8 }} />
                      )}
                    </div>
                  ) : <span style={{ color: '#9ca3af' }}>-</span>}
                </div>
                {/* Action Buttons Section */}
                <div style={{ marginTop: 32, display: 'flex', gap: 16, flexDirection: 'row', width: '100%' }}>
                  {shopDetails.Verification === 'Pending' && (
                    <>
                      <button style={{ background: '#b91c1c', color: '#fff', border: 'none', borderRadius: 6, padding: '16px 0', fontWeight: 600, fontSize: 18, cursor: 'pointer', flex: 1, marginLeft: 4, marginRight: 4 }}
                        onClick={() => { setShowConfirm(true); setConfirmAction('reject'); setConfirmText('Are you sure you want to reject this shop?'); }}>
                        Reject
                      </button>
                      <button style={{ background: '#047857', color: '#fff', border: 'none', borderRadius: 6, padding: '16px 0', fontWeight: 600, fontSize: 18, cursor: 'pointer', flex: 1, marginLeft: 4, marginRight: 4 }}
                        onClick={() => { setShowConfirm(true); setConfirmAction('verify'); setConfirmText('Approve this shop?'); }}>
                        Approve
                      </button>
                    </>
                  )}
                  {shopDetails.Verification === 'Rejected' && (
                    <>
                      <button style={{ background: '#b91c1c', color: '#fff', border: 'none', borderRadius: 6, padding: '16px 0', fontWeight: 600, fontSize: 18, cursor: 'pointer', flex: 1, marginLeft: 4, marginRight: 4 }}
                        onClick={() => { setShowConfirm(true); setConfirmAction('delete'); setConfirmText('Delete this shop permanently?'); }}>
                        Delete
                      </button>
                      <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '16px 0', fontWeight: 600, fontSize: 18, cursor: 'pointer', flex: 1, marginLeft: 4, marginRight: 4 }}
                        onClick={() => { setShowConfirm(true); setConfirmAction('revert'); setConfirmText('Revert status to Pending?'); }}>
                        Revert
                      </button>
                    </>
                  )}
                  {shopDetails.Verification === 'Verified' && (
                    <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '16px 0', fontWeight: 600, fontSize: 18, cursor: 'pointer', flex: 1, marginLeft: 4, marginRight: 4 }}
                      onClick={() => { setShowConfirm(true); setConfirmAction('revert'); setConfirmText('Revert status to Pending?'); }}>
                      Revert
                    </button>
                  )}
                </div>
                {/* Confirmation Modal */}
                {showConfirm && (
                  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.32)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: '38px 44px', minWidth: 340, boxShadow: '0 8px 48px rgba(0,0,0,0.18)', position: 'relative', fontFamily: 'Inter, sans-serif', border: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#374151', marginBottom: 18 }}>{confirmText}</div>
                      <div style={{ display: 'flex', gap: 18, justifyContent: 'flex-end', marginTop: 18 }}>
                        <button style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                          onClick={() => { setShowConfirm(false); setConfirmAction(null); setConfirmText(''); }} disabled={loadingAction}>
                          Cancel
                        </button>
                        <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                          onClick={handleAction} disabled={loadingAction}>
                          {loadingAction ? 'Processing...' : 'Confirm'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      )}
      <div className="dbHeader">
        <h1>Dashboard Overview</h1>
      </div>
      <div className="dbCardContainer">


        <div className="dbCard">
          <div className="dbCardIcon">
            <FaUser />
          </div>
          <div>
            <div className="dbCardLabel">Total Users</div>
            <div className="dbCardValue">{users.length}</div>
          </div>
        </div>

        <div className="dbCard">
          <div className="dbCardIcon">
            <FaCheck />
          </div>
          <div>
            <div className="dbCardLabel">Pending Verifications</div>
            <div className="dbCardValue">{pendingVerifications}</div>
          </div>
        </div>

        <div className="dbCard">
          <div className="dbCardIcon">
            <FaClipboardList />
          </div>
          <div>
            <div className="dbCardLabel">Open Reports</div>
            <div className="dbCardValue">{openReports}</div>
          </div>
        </div>
      </div>

      {/* Announcements Card */}
  <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(37,99,235,0.13), 0 1.5px 0 #2563eb', border: '1.5px solid #2563eb', padding: '24px 28px', marginTop: 32, maxWidth: 900, marginLeft:85, marginRight: 24, minWidth: 1630, height: 540, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: '#2563eb', marginBottom: 16 }}>Announcements</h2>
        {/* Create Announcement Interface */}
        <div style={{ marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea
            style={{ width: '100%', minHeight: 48, borderRadius: 8, border: '1.5px solid #e5e7eb', padding: 10, fontSize: 16, resize: 'vertical' }}
            value={newAnnouncement}
            onChange={e => setNewAnnouncement(e.target.value)}
            placeholder="Write a new announcement..."
            disabled={postingAnnouncement}
          />
          <button
            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, fontSize: 16, width: '100%', cursor: 'pointer', marginTop: 2 }}
            onClick={handlePostAnnouncement}
            disabled={postingAnnouncement || !newAnnouncement.trim()}
          >{postingAnnouncement ? 'Posting...' : 'Post Announcement'}</button>
        {/* Announcement Confirmation Modal */}
        {showAnnConfirm && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.32)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '38px 44px', minWidth: 340, boxShadow: '0 8px 48px rgba(37,99,235,0.13)', position: 'relative', fontFamily: 'Inter, sans-serif', border: '1.5px solid #2563eb', width: 420 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#2563eb', marginBottom: 18 }}>Post this announcement?</div>
              <div style={{ color: '#374151', fontSize: 16, marginBottom: 18, background: '#f9fafb', borderRadius: 8, padding: 12 }}>{newAnnouncement}</div>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: 10, fontWeight: 500, color: '#2563eb', fontSize: 15 }}>
                <input type="checkbox" checked={specifyUsers} onChange={e => setSpecifyUsers(e.target.checked)} style={{ marginRight: 8 }} />
                Specific Users
              </label>
              {specifyUsers && (
                <div style={{ marginBottom: 12 }}>
                  {invalidUserIDs.length > 0 && (
                    <div style={{ color: '#b91c1c', fontSize: 13, marginBottom: 8 }}>
                      Invalid user{invalidUserIDs.length > 1 ? 's' : ''}: {invalidUserIDs.join(', ')}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={receiverIDsInput}
                      onChange={e => setReceiverIDsInput(e.target.value)}
                      placeholder="Enter UserID and press Enter"
                      style={{ flex: 1, borderRadius: 6, border: '1.5px solid #e5e7eb', padding: 8, fontSize: 15 }}
                      disabled={postingAnnouncement}
                      onKeyDown={async e => {
                        if (e.key === 'Enter' && receiverIDsInput.trim()) {
                          const id = receiverIDsInput.trim();
                          if (!receiverIDsList.includes(id)) {
                            // Validate userID
                            try {
                              const resp = await axios.get(`http://127.0.0.1:8000/api/user/${id}`);
                              if (resp.data && !resp.data.error) {
                                setReceiverIDsList([...receiverIDsList, id]);
                                setInvalidUserIDs(invalidUserIDs.filter(uid => uid !== id));
                              } else {
                                setInvalidUserIDs([...invalidUserIDs, id]);
                              }
                            } catch {
                              setInvalidUserIDs([...invalidUserIDs, id]);
                            }
                          }
                          setReceiverIDsInput("");
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {receiverIDsList.map((id, idx) => (
                      <span key={id} style={{ background: invalidUserIDs.includes(id) ? '#b91c1c' : '#2563eb', color: '#fff', borderRadius: 16, padding: '4px 12px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {id}
                        {invalidUserIDs.includes(id) && (
                          <span style={{ marginLeft: 6, fontWeight: 700, color: '#fff', fontSize: 13 }}>invalid user</span>
                        )}
                        <button
                          style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 700, marginLeft: 4, cursor: 'pointer', fontSize: 15 }}
                          onClick={() => {
                            setReceiverIDsList(receiverIDsList.filter((uid, i) => i !== idx));
                            setInvalidUserIDs(invalidUserIDs.filter(uid => uid !== id));
                          }}
                          disabled={postingAnnouncement}
                        >×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 18, justifyContent: 'flex-end', marginTop: 18 }}>
                <button style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                  onClick={() => setShowAnnConfirm(false)} disabled={postingAnnouncement}>
                  Cancel
                </button>
                <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 600, fontSize: 16, cursor: postingAnnouncement || (specifyUsers && invalidUserIDs.length > 0) ? 'not-allowed' : 'pointer' }}
                  onClick={confirmPostAnnouncement} disabled={postingAnnouncement || (specifyUsers && invalidUserIDs.length > 0)}>
                  {postingAnnouncement ? 'Posting...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
          <div style={{ fontWeight: 700, fontSize: 18, color: '#2563eb', marginTop: 18, marginBottom: 8 }}>Recent Announcements</div>
        </div>
        {announcements.length === 0 ? (
          <div style={{ color: '#888', fontSize: 16, flex: 1 }}>No announcements found.</div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', marginTop: 2 }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {announcements.slice(0, 5).map(a => (
                <li key={a.AnnouncementID} style={{ marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ fontWeight: 600, color: '#374151', fontSize: 17 }}>{a.Content}</div>
                  <div style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>ID: {a.AnnouncementID} {a.created_at ? `| Posted: ${new Date(a.created_at).toLocaleString()}` : ''}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="dbColumnsContainer">
        <div className="dbColumn">
          <div className="dbTableCard" style={{ minHeight: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div className="dbTableCardHeader">Recent Shop Registrations</div>
              <a href="/admin/shop-management" style={{ color: '#2563eb', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>View All</a>
            </div>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Shop</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Date</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Status</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((shop, idx) => (
                  <tr key={shop.ShopID || shop.id || idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <UserAvatar name={shop.ShopName || shop.name} />
                      <span style={{ fontWeight: 500 }}>{shop.ShopName || shop.name}</span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>{shop.created_at ? new Date(shop.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</td>
                    <td style={{ padding: '14px 12px' }}>
                      {shop.Verification === 'Verified' ? (
                        <span style={{ background: '#d1fae5', color: '#047857', fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>Verified</span>
                      ) : shop.Verification === 'Pending' ? (
                        <span style={{ background: '#fef3c7', color: '#b45309', fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>Pending</span>
                      ) : shop.Verification === 'Rejected' ? (
                        <span style={{ background: '#fee2e2', color: '#b91c1c', fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>Rejected</span>
                      ) : (
                        <span style={{ background: '#f3f4f6', color: '#6b7280', fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>Unknown</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <button
                        style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, cursor: 'pointer' }}
                        onClick={() => {
                          setShowShopModal(true);
                          setSelectedShop(shop.ShopID || shop.id);
                          setShopDetails(null);
                          axios.get(`http://127.0.0.1:8000/api/shops/${shop.ShopID || shop.id}`)
                            .then(response => setShopDetails(response.data))
                            .catch(error => setShopDetails({ error: 'Failed to fetch shop details.' }));
                        }}
                      >View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="dbColumn">
          <div className="dbTableCard" style={{ minHeight: 520 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div className="dbTableCardHeader">Recent Reports</div>
                <a href="/admin/report-management" style={{ color: '#2563eb', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>View All</a>
              </div>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Reporter</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Type</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Subject</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Date</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Status</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 15 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((rep, idx) => {
                  let statusStyle = {};
                  let statusText = rep.Status;
                  switch (statusText) {
                    case 'Pending':
                      statusStyle = { background: '#fef3c7', color: '#b45309' };
                      break;
                    case 'In Review':
                      statusStyle = { background: '#e0e7ff', color: '#3730a3' };
                      break;
                    case 'Resolved':
                      statusStyle = { background: '#d1fae5', color: '#047857' };
                      break;
                    case 'Closed':
                      statusStyle = { background: '#f3f4f6', color: '#6b7280' };
                      break;
                    case 'Open':
                      statusStyle = { background: '#fde68a', color: '#b45309' };
                      break;
                    default:
                      statusStyle = { background: '#e0e7ff', color: '#3730a3' };
                  }
                  return (
                    <tr key={rep.ReportID} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '14px 12px', fontWeight: 500 }}>{rep.Reporter}</td>
                      <td style={{ padding: '14px 12px' }}>{rep.Type}</td>
                      <td style={{ padding: '14px 12px' }}>{rep.Subject}</td>
                      <td style={{ padding: '14px 12px' }}>{rep.Date ? new Date(rep.Date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : ''}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <span style={{ ...statusStyle, fontWeight: 500, fontSize: 14, borderRadius: 6, padding: '4px 14px' }}>{statusText}</span>
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, cursor: 'pointer' }}
                          onClick={() => {
                            setShowReportModal(true);
                            setReportDetails(null);
                            axios.get(`http://127.0.0.1:8000/api/reports/${rep.ReportID}`)
                              .then(response => {
                                console.log('Fetched report details:', response.data);
                                setReportDetails(response.data);
                              })
                              .catch(() => setReportDetails({ error: 'Failed to fetch report details.' }));
                          }}
                        >View</button>
                      </td>
                    </tr>
                  );
                })}
      {/* Report Details Modal */}
      {showReportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.38)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ minWidth: 600, maxWidth: 720, background: '#fff', borderRadius: 22, padding: '48px 56px 40px 56px', boxShadow: '0 8px 48px rgba(0,0,0,0.22)', position: 'relative', fontFamily: 'Inter, sans-serif', border: '1px solid #e5e7eb' }}>
            <button onClick={() => { setShowReportModal(false); setReportDetails(null); }} style={{ position: 'absolute', top: 18, right: 18, background: '#f3f4f6', border: 'none', fontSize: 22, cursor: 'pointer', color: '#374151', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>&times;</button>
            {reportDetails ? (
              reportDetails.error ? (
                <div style={{ color: '#b91c1c', fontWeight: 600, fontSize: 18 }}>Failed to fetch report details.</div>
              ) : (
                <React.Fragment>
                  <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 8, color: '#2563eb', letterSpacing: '-1px' }}>Report Details</h2>
                  <hr style={{ marginBottom: 18, border: 'none', borderTop: '2px solid #e5e7eb' }} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginBottom: 10 }}>
                    <div style={{ minWidth: 180 }}><span style={{ color: '#2563eb', fontWeight: 700 }}>Report ID:</span> <span style={{ color: '#374151', fontWeight: 500 }}>{reportDetails.ReportID ?? '-'}</span></div>
                    <div style={{ minWidth: 180 }}><span style={{ color: '#2563eb', fontWeight: 700 }}>ReportType:</span> <span style={{ color: '#374151', fontWeight: 500 }}>{reportDetails.TargetType ?? reportDetails.ReportType ?? reportDetails.Type ?? '-'}</span></div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginBottom: 10 }}>
                    <div style={{ minWidth: 180 }}><span style={{ color: '#2563eb', fontWeight: 700 }}>Reason:</span> <span style={{ color: '#374151', fontWeight: 500 }}>{reportDetails.Reason ?? '-'}</span></div>
                    <div style={{ minWidth: 180 }}><span style={{ color: '#2563eb', fontWeight: 700 }}>Reported Item:</span> <span style={{ color: '#374151', fontWeight: 500 }}>{reportDetails.ReportedLink ?? reportDetails.ReportedItem ?? '-'}</span></div>
                  </div>
                  <div style={{ color: '#2563eb', fontWeight: 700, marginBottom: 6, marginTop: 18 }}>Content:</div>
                  <div style={{ background: '#f9fafb', borderRadius: 8, border: '1.5px solid #e5e7eb', minHeight: 80, marginBottom: 18, padding: '14px 16px', fontSize: 17, color: '#374151', fontWeight: 500, lineHeight: 1.6 }}>
                    {reportDetails.Content ?? reportDetails.Message ?? '-'}
                  </div>
                  <div style={{ color: '#2563eb', fontWeight: 700, marginBottom: 6 }}>Response:</div>
                  {reportDetails.Status === 'In Review' ? (
                    <textarea
                      style={{ background: '#f9fafb', borderRadius: 8, border: '1.5px solid #e5e7eb', minHeight: 80, marginBottom: 18, width: '100%', fontSize: 17, color: '#374151', fontWeight: 500, padding: 12, resize: 'vertical', lineHeight: 1.6 }}
                      defaultValue={reportDetails.Response ?? ''}
                      placeholder="Enter response..."
                    />
                  ) : (
                    <div style={{ background: '#f9fafb', borderRadius: 8, border: '1.5px solid #e5e7eb', minHeight: 80, marginBottom: 18, padding: '14px 16px', fontSize: 17, color: '#374151', fontWeight: 500, lineHeight: 1.6 }}>
                      {reportDetails.Response ?? '-'}
                    </div>
                  )}
                  <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 0', fontWeight: 700, fontSize: 18, width: '100%', marginTop: 12, cursor: 'pointer' }}>Resolve</button>
                </React.Fragment>
              )
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      )}
              </tbody>
            </table>
          </div>
        </div>
      </div>


    </AdminLayout>
  );
}

export default Dashboard;