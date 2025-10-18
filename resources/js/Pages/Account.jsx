
import Header from "../Components/Header";
import { User } from "lucide-react";
import Footer from "../Components/Footer";

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
      <section className="account-section" style={{maxWidth: 520, margin: '2.5rem auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '2.7rem 2.2rem', position: 'relative'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{width: 90, height: 90, borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)'}}>
            <User size={54} color="var(--color-primary)" />
          </div>
          <h2 className="account-title" style={{marginBottom: '0.7rem', fontSize: '2.1rem', fontWeight: 700, color: 'var(--color-primary)'}}>My Account</h2>
          {user ? (
            <>
              <div style={{fontSize: '1.15rem', fontWeight: 600, color: '#222', marginBottom: '0.5rem'}}>{user.FirstName || user.firstName} {user.LastName || user.lastName}</div>
              <div style={{fontSize: '1rem', color: '#666', marginBottom: '1.7rem'}}>{user.Email || user.email}</div>
              <div className="account-info" style={{width: '100%', marginBottom: '1.5rem'}}>
                <div className="account-row" style={{marginBottom: '0.7rem'}}><span className="account-label" style={{fontWeight: 500, color: '#888'}}>User ID:</span> <span style={{fontWeight: 600}}>{user.UserID || user.id}</span></div>
                <div className="account-row" style={{marginBottom: '0.7rem'}}><span className="account-label" style={{fontWeight: 500, color: '#888'}}>Contact:</span> <span style={{fontWeight: 600}}>{user.ContactNumber || user.contactNumber}</span></div>
                <div className="account-row" style={{marginBottom: '0.7rem'}}><span className="account-label" style={{fontWeight: 500, color: '#888'}}>Address:</span> <span style={{fontWeight: 600}}>{user.HouseNumber || user.houseNumber}, {user.Barangay || user.barangay}, {user.Municipality || user.municipality}, {user.Zipcode || user.zipcode}</span></div>
              </div>
              <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
                <button className="loginBtn" style={{padding: '0.7rem 2.2rem', fontSize: '1.1rem', borderRadius: 8, boxShadow: '0 2px 8px rgba(40,184,100,0.08)'}} onClick={() => window.location.href = '/browse'}>Shop Now</button>
              </div>
            </>
          ) : (
            <div style={{color: 'red', fontWeight: 500, marginTop: '1.5rem'}}>You are not logged in.</div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Account;
