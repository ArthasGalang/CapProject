import React, { useState } from "react";

const ReportProductButton = ({ productId }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    Reason: '',
    Content: '',
    ReportedLink: '',
    TargetType: 'Other',
    TargetID: productId || '',
  });
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');

  const openModal = () => {
    setReportForm(f => ({
      ...f,
      ReportedLink: window.location.href || '',
      TargetID: productId || '',
    }));
    setShowReportModal(true);
  };

  return (
    <>
      <span
        style={{ position: 'absolute', top: 14, right: 14, zIndex: 2, cursor: 'pointer' }}
        onClick={openModal}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="9" r="8" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
          <text x="9" y="13" textAnchor="middle" fontWeight="bold" fontSize="12" fill="#ef4444" fontFamily="Arial, Helvetica, sans-serif">!</text>
        </svg>
      </span>
      {showReportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(44,204,113,0.13)', padding: '2.2rem 2.2rem 1.5rem 2.2rem', minWidth: 500, maxWidth: 650, width: '100%', position: 'relative' }}>
            <button onClick={() => setShowReportModal(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
            <div style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 18, color: '#ef4444', textAlign: 'center' }}>Report Product</div>
            {reportError && <div style={{ color: '#ef4444', marginBottom: 10 }}>{reportError}</div>}
            {reportSuccess && <div style={{ color: '#2ecc71', marginBottom: 10 }}>{reportSuccess}</div>}
            <form onSubmit={async e => {
              e.preventDefault();
              setReportSubmitting(true);
              setReportError('');
              setReportSuccess('');
              try {
                let userId = null;
                try {
                  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
                  userId = user?.UserID || user?.id || null;
                } catch (e) { userId = null; }
                if (!userId) throw new Error('You must be logged in to report.');
                if (!reportForm.Reason.trim()) throw new Error('Please select a reason.');
                if (!reportForm.Content.trim()) throw new Error('Please provide details.');
                if (!['Order', 'User'].includes(reportForm.TargetType) && !reportForm.ReportedLink.trim()) {
                  throw new Error('Please provide a link.');
                }
                
                const payload = {
                  UserID: userId,
                  Reason: reportForm.Reason,
                  Content: reportForm.Content,
                  ReportedLink: ['Order', 'User'].includes(reportForm.TargetType) ? '' : reportForm.ReportedLink,
                  TargetType: reportForm.TargetType,
                  TargetID: reportForm.TargetID,
                };
                console.log('Submitting report with payload:', payload);
                
                const res = await fetch('/api/reports', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });
                console.log('Response status:', res.status);
                const responseData = await res.json();
                console.log('Response data:', responseData);
                if (!res.ok) {
                  const errorMsg = responseData.messages 
                    ? Object.values(responseData.messages).flat().join(', ')
                    : responseData.message || responseData.error || 'Failed to submit report.';
                  throw new Error(errorMsg);
                }
                // Show confirmation modal and close report modal after a short delay
                setShowConfirmationModal(true);
                setTimeout(() => {
                  setShowConfirmationModal(false);
                  setShowReportModal(false);
                  setReportForm(f => ({ ...f, Reason: '', Content: '', ReportedLink: '' }));
                }, 2000);
              } catch (err) {
                setReportError(err.message || 'Error submitting report.');
              } finally {
                setReportSubmitting(false);
              }
            }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, color: '#222', marginBottom: 4, display: 'block' }}>Target Type<span style={{ color: '#ef4444' }}>*</span></label>
                <select value={reportForm.TargetType} onChange={e => setReportForm(f => ({ ...f, TargetType: e.target.value }))} style={{ width: '100%', borderRadius: 8, border: '1px solid #eee', padding: 8, fontSize: '1rem' }} required disabled={reportSubmitting}>
                  <option value="User">User</option>
                  <option value="Shop">Shop</option>
                  <option value="Product">Product</option>
                  <option value="Order">Order</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, color: '#222', marginBottom: 4, display: 'block' }}>Reason<span style={{ color: '#ef4444' }}>*</span></label>
                <select value={reportForm.Reason} onChange={e => setReportForm(f => ({ ...f, Reason: e.target.value }))} style={{ width: '100%', borderRadius: 8, border: '1px solid #eee', padding: 8, fontSize: '1rem' }} required disabled={reportSubmitting}>
                  <option value="">Select a reason</option>
                  <option value="Fraudulent Listing">Fraudulent Listing</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Counterfeit Product">Counterfeit Product</option>
                  <option value="Spam">Spam</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, color: '#222', marginBottom: 4, display: 'block' }}>Reported Item ID<span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" value={reportForm.TargetID} onChange={e => setReportForm(f => ({ ...f, TargetID: e.target.value }))} style={{ width: '100%', borderRadius: 8, border: '1px solid #eee', padding: 8, fontSize: '1rem' }} required disabled={reportSubmitting} placeholder="Enter item ID" />
              </div>
              {!['Order', 'User'].includes(reportForm.TargetType) && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 600, color: '#222', marginBottom: 4, display: 'block' }}>Link<span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" value={reportForm.ReportedLink} onChange={e => setReportForm(f => ({ ...f, ReportedLink: e.target.value }))} style={{ width: '100%', borderRadius: 8, border: '1px solid #eee', padding: 8, fontSize: '1rem' }} required disabled={reportSubmitting} placeholder="Link to reported item" />
                </div>
              )}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, color: '#222', marginBottom: 4, display: 'block' }}>Details<span style={{ color: '#ef4444' }}>*</span></label>
                <textarea value={reportForm.Content} onChange={e => setReportForm(f => ({ ...f, Content: e.target.value }))} style={{ width: '100%', minHeight: 60, borderRadius: 8, border: '1px solid #eee', padding: 8, fontSize: '1rem' }} required disabled={reportSubmitting} placeholder="Describe the issue..." />
              </div>
              <button type="submit" style={{ width: '100%', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: '1.08rem', border: 'none', borderRadius: 8, padding: '0.7rem 0', cursor: reportSubmitting ? 'not-allowed' : 'pointer', opacity: reportSubmitting ? 0.7 : 1, marginBottom: 6 }} disabled={reportSubmitting}>{reportSubmitting ? 'Submitting...' : 'Submit Report'}</button>
            </form>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.2)', padding: '2.5rem 2rem', minWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 48, color: '#2ecc71', marginBottom: 16 }}>✓</div>
            <div style={{ fontWeight: 700, fontSize: '1.4rem', color: '#222', marginBottom: 12 }}>Report Submitted!</div>
            <div style={{ color: '#666', fontSize: '1rem' }}>Your report has been successfully submitted and will be reviewed by our team.</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportProductButton;
