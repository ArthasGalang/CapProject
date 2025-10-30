import Header from "../Components/Header";
import Footer from "../Components/Footer";
import AccountSidebar from "../Components/AccountSidebar";
import FloatingChatButton from "../Components/FloatingChatButton";

const AccountSettings = () => {
  let user = null;
  try {
    user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  } catch (e) {
    user = null;
  }
  React.useEffect(() => {
    if (!user) {
      window.location.href = '/?showLoginModal=1';
    }
  }, [user]);
  if (!user) return null;
  return (
    <>
      <Header />
      <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', minHeight: 'calc(100vh - 70px)', width: '100%', maxWidth: 1400, margin: '0 auto', paddingTop: '2.5rem'}}>
        <div style={{minWidth: 240, maxWidth: 280, marginRight: '2.5rem'}}>
          <AccountSidebar active="settings" />
        </div>
        <section className="account-section" style={{flex: 1, maxWidth: 1200, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '2.7rem 2.2rem', position: 'relative'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h2 className="account-title" style={{marginBottom: '0.7rem', fontSize: '2.1rem', fontWeight: 700, color: 'var(--color-primary)'}}>Settings</h2>
            <div style={{fontSize: '1.15rem', color: '#666', marginBottom: '1.7rem'}}></div>
            <button
              style={{
                marginTop: '2.2rem',
                background: '#ffeded',
                color: '#e53935',
                border: 'none',
                borderRadius: '8px',
                padding: '0.9rem 2.2rem',
                fontWeight: 600,
                fontSize: '1.08rem',
                boxShadow: '0 2px 8px #e5393511',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onClick={() => window.confirm('Are you sure you want to delete your account? This action cannot be undone.')}
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>
  <FloatingChatButton onClick={() => alert('Open chat window')} />
  <Footer />
    </>
  );
};

export default AccountSettings;
