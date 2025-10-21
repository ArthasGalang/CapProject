
import React, { useState, useEffect } from 'react';

// Add onLoginSuccess prop to notify parent
const AuthModal = ({ isOpen, onClose, initialTab = 'login', onLoginSuccess }) => {
  const [isSignIn, setIsSignIn] = useState(initialTab === 'login');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  useEffect(() => {
    setIsSignIn(initialTab === 'login');
  }, [initialTab]);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');

  const handleLoginChange = e => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async e => {
    e.preventDefault();
    setLoginError('');
    if (!loginForm.email || !loginForm.password) {
      setLoginError('Please enter both email and password.');
      return;
    }
    setLoadingLogin(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess({ token: data.token, user: data.user });
        }
        onClose();
      } else {
        setLoginError(data.message || 'Login failed.');
      }
    } catch (err) {
      setLoginError('Server error.');
    }
    setLoadingLogin(false);
  };

  // Registration form state
  const [regForm, setRegForm] = useState({
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  email: '',
  contactNumber: '',
  barangay: '',
  municipality: '',
  zipcode: '',
  houseNumber: '',
  street: '',
  });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  const handleRegChange = e => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
  };

  const handleRegister = async e => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    if (!regForm.firstName || !regForm.lastName || !regForm.email || !regForm.password || !regForm.confirmPassword) {
      setRegError('Please fill out all required fields.');
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    setLoadingRegister(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(regForm),
      });
      const data = await res.json();
      if (res.ok) {
        setRegSuccess('Registration successful!');
        setRegForm({
          firstName: '', lastName: '', password: '', confirmPassword: '',
          email: '', contactNumber: '', barangay: '', municipality: '', zipcode: '', houseNumber: '', street: ''
        });
        // Store AddressID in localStorage if present
        if (data.address && (data.address.AddressID || data.address.id)) {
          localStorage.setItem('lastAddressID', data.address.AddressID || data.address.id);
        }
      } else {
        setRegError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setRegError('Server error.');
    }
    setLoadingRegister(false);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay-better" onClick={onClose}>
      <div className="auth-modal-better" onClick={e => e.stopPropagation()}>
  {/* Close button removed as requested */}
        {/* Tab Switcher */}
        <div className="auth-modal-tabs-better">
          <button
            className={`auth-modal-tab-better${isSignIn ? ' active' : ''}`}
            onClick={() => setIsSignIn(true)}
          >Login</button>
          <button
            className={`auth-modal-tab-better${!isSignIn ? ' active' : ''}`}
            onClick={() => setIsSignIn(false)}
          >Register</button>
        </div>
        <div className={isSignIn ? "auth-modal-content-better" : "auth-modal-scrollable-content-better"}>
          {isSignIn ? (
              <form className="auth-modal-content-better" onSubmit={handleLogin}>
                <h2 className="auth-modal-title-better">Login</h2>
                <input type="email" name="email" value={loginForm.email} onChange={handleLoginChange} placeholder="Email" className="auth-input-better" required disabled={loadingLogin} />
                <input type="password" name="password" value={loginForm.password} onChange={handleLoginChange} placeholder="Password" className="auth-input-better" required disabled={loadingLogin} />
                <p className="auth-forgot-password-better">Forgot your password?</p>
                <div className="auth-modal-actions-better">
                  <button className="auth-button-better" type="submit" disabled={loadingLogin}>{loadingLogin ? 'Logging in...' : 'Login'}</button>
                  <p className="terms-text" style={{textAlign: 'center', fontSize: '0.98rem', marginTop: '0.7rem'}}>
                    <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 500 }}>
                      Terms and Conditions
                    </a>
                  </p>
                  {loginError && <div className="auth-error-better">{loginError}</div>}
                </div>
              </form>
          ) : (
            <form className="auth-modal-content-better" onSubmit={handleRegister}>
              <h2 className="auth-modal-title-better">Register</h2>
              {/* Account Section */}
              <div className="auth-section-better">
                <h3 className="auth-section-title-better">Account</h3>
                <input type="text" name="firstName" value={regForm.firstName} onChange={handleRegChange} placeholder="First Name" className="auth-input-better" required disabled={loadingRegister} />
                <input type="text" name="lastName" value={regForm.lastName} onChange={handleRegChange} placeholder="Last Name" className="auth-input-better" required disabled={loadingRegister} />
                <input type="password" name="password" value={regForm.password} onChange={handleRegChange} placeholder="Password" className="auth-input-better" required disabled={loadingRegister} />
                <input type="password" name="confirmPassword" value={regForm.confirmPassword} onChange={handleRegChange} placeholder="Confirm Password" className="auth-input-better" required disabled={loadingRegister} />
              </div>
              {/* Contact Section */}
              <div className="auth-section-better">
                <h3 className="auth-section-title-better">Contact</h3>
                <input type="email" name="email" value={regForm.email} onChange={handleRegChange} placeholder="Email" className="auth-input-better" required disabled={loadingRegister} />
                <input type="text" name="contactNumber" value={regForm.contactNumber} onChange={handleRegChange} placeholder="Contact Number" className="auth-input-better" required disabled={loadingRegister} />
              </div>
              {/* Address Section */}
              <div className="auth-section-better">
                <h3 className="auth-section-title-better">Address</h3>
                <input type="text" name="street" value={regForm.street} onChange={handleRegChange} placeholder="Street" className="auth-input-better" required disabled={loadingRegister} />
                <input type="text" name="barangay" value={regForm.barangay} onChange={handleRegChange} placeholder="Barangay" className="auth-input-better" required disabled={loadingRegister} />
                <input type="text" name="municipality" value={regForm.municipality} onChange={handleRegChange} placeholder="Municipality" className="auth-input-better" required disabled={loadingRegister} />
                <input type="text" name="zipcode" value={regForm.zipcode} onChange={handleRegChange} placeholder="Zipcode" className="auth-input-better" required disabled={loadingRegister} />
                <input type="text" name="houseNumber" value={regForm.houseNumber} onChange={handleRegChange} placeholder="House Number" className="auth-input-better" required disabled={loadingRegister} />
              </div>
              {/* Sign Up button and switch link below all sections */}
              <div className="auth-modal-actions-better">
                <button className="auth-button-better" type="submit" disabled={loadingRegister}>{loadingRegister ? 'Registering...' : 'Register'}</button>
                <p className="terms-text" style={{textAlign: 'center', fontSize: '0.98rem', marginTop: '0.7rem'}}>
                  <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 500 }}>
                    Terms and Conditions
                  </a>
                </p>
                {regError && <div className="auth-error-better">{regError}</div>}
                {regSuccess && <div className="auth-success-better">{regSuccess}</div>}
              </div>
            </form>
          )}
        </div>
      </div>
      {/* Scoped styles for the modal */}
      <style>{`
        .auth-modal-overlay-better {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(30, 34, 45, 0.45);
          backdrop-filter: blur(3px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-modal-better {
          background: var(--white, #fff);
          border-radius: var(--border-radius-large, 1.2rem);
          box-shadow: 0 8px 32px rgba(44,204,113,0.15);
          padding: 2.5rem 2.2rem 2.2rem 2.2rem;
          min-width: 350px;
          max-width: 95vw;
          width: 410px;
          height: 600px;
          max-height: 90vh;
          position: relative;
          animation: fadeInModal 0.25s cubic-bezier(.4,0,.2,1);
          display: flex;
          flex-direction: column;
          border: 2px solid var(--color-primary, #2ECC71);
        }
        @keyframes fadeInModal {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: none; }
        }
        .auth-modal-close-better {
          position: absolute;
          top: 1.1rem;
          right: 1.1rem;
          background: none;
          border: none;
          font-size: 2.1rem;
          color: #888;
          cursor: pointer;
          transition: color 0.18s;
        }
        .auth-modal-close-better:hover {
          color: #222;
        }
        .auth-modal-tabs-better {
          display: flex;
          margin-bottom: 2.2rem;
          border-top-left-radius: 13px;
          border-top-right-radius: 13px;
          overflow: hidden;
          background: #f3f4f8;
        }
        .auth-modal-tab-better {
          flex: 1;
          padding: 0.95rem 0;
          font-size: 1.13rem;
          font-weight: 600;
          background: none;
          border: none;
          color: var(--color-gray-dark, #555);
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
        }
        .auth-modal-tab-better.active {
          background: var(--color-primary, #2ECC71);
          color: #fff;
          box-shadow: 0 2px 8px rgba(44,204,113,0.08);
        }
        .auth-modal-scrollable-content-better {
          flex: 1 1 auto;
          overflow-y: scroll;
          min-height: 0;
          display: flex;
          flex-direction: column;
          padding-top: 1.5rem;
          padding-right: 0.7rem;
          scrollbar-width: thin;
          scrollbar-color: var(--color-primary, #2ECC71) #f3f4f8;
          width: 360px;
        }
        .auth-modal-scrollable-content-better::-webkit-scrollbar {
          width: 8px;
          background: #f3f4f8;
          border-radius: 8px;
        }
        .auth-modal-scrollable-content-better::-webkit-scrollbar-thumb {
          background: var(--color-primary, #2ECC71);
          border-radius: 8px;
        }
        .auth-modal-scrollable-content-better::-webkit-scrollbar-thumb:hover {
          background: var(--color-secondary, #229954);
        }
        .auth-modal-tabs-better {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 2;
        }
        .auth-modal-close-better {
          z-index: 3;
        }
        .auth-modal-better {
          position: relative;
        }
        .auth-modal-content-better {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          margin-top: 40px
        }
        .auth-modal-title-better {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-primary, #2ECC71);
          margin-bottom: 0.7rem;
          text-align: center;
        }
        .auth-section-better {
          margin-bottom: 0.7rem;
        }
        .auth-section-title-better {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-primary, #2ECC71);
          margin-bottom: 0.3rem;
        }
        .auth-input-better {
          width: 100%;
          padding: 0.85rem 1rem;
          border: 1.5px solid var(--color-primary, #2ECC71);
          border-radius: 7px;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          background: #fff;
          transition: border 0.18s;
        }
        .auth-input-better:focus {
          border-color: var(--color-secondary, #229954);
          outline: none;
          background: #f8fafc;
        }
        .auth-modal-actions-better {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.7rem;
          margin-top: 1.2rem;
        }
        .auth-button-better {
          background: var(--color-primary, #2ECC71);
          color: #fff;
          border: none;
          border-radius: 7px;
          padding: 0.95rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(44,204,113,0.08);
          transition: background 0.18s;
        }
        .auth-button-better:disabled {
          background: var(--color-gray, #BDC3C7);
          cursor: not-allowed;
        }
        .auth-switch-text-better {
          margin-top: 0.2rem;
          text-align: center;
          font-size: 0.98rem;
        }
        .auth-switch-link-better {
          color: var(--color-primary, #2ECC71);
          background: none;
          border: none;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          font-size: 1rem;
          margin-left: 0.2rem;
        }
        .auth-switch-link-better:disabled {
          color: var(--color-gray, #BDC3C7);
          cursor: not-allowed;
        }
        .auth-error-better {
          color: #d32f2f;
          font-size: 0.98rem;
          text-align: center;
        }
        .auth-success-better {
          color: #388e3c;
          font-size: 0.98rem;
          text-align: center;
        }
        .auth-forgot-password-better {
          color: var(--color-secondary, #229954);
          font-size: 0.97rem;
          text-align: right;
          margin-bottom: 0.2rem;
          cursor: pointer;
        }
        .auth-forgot-password-better:hover {
          color: var(--color-primary, #2ECC71);
        }
        @media (max-width: 500px) {
          .auth-modal-better {
            width: 98vw;
            min-width: unset;
            padding: 1.2rem 0.5rem 1.5rem 0.5rem;
            height: 98vh;
            max-height: 98vh;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
