
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
          email: '', contactNumber: '', barangay: '', municipality: '', zipcode: '', houseNumber: ''
        });
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
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>&times;</button>
        {/* Tab Switcher */}
        <div className="auth-modal-tabs">
          <button
            className={`auth-modal-tab${isSignIn ? ' active' : ''}`}
            onClick={() => setIsSignIn(true)}
          >Login</button>
          <button
            className={`auth-modal-tab${!isSignIn ? ' active' : ''}`}
            onClick={() => setIsSignIn(false)}
          >Register</button>
        </div>
        {isSignIn ? (
            <form className="auth-modal-content" onSubmit={handleLogin}>
              <h2 className="auth-modal-title" style={{paddingBottom: '3.5rem'}}>Login</h2>
              <input type="email" name="email" value={loginForm.email} onChange={handleLoginChange} placeholder="Email" className="auth-input" required disabled={loadingLogin} />
              <input type="password" name="password" value={loginForm.password} onChange={handleLoginChange} placeholder="Password" className="auth-input" required disabled={loadingLogin} />
              <p className="auth-forgot-password">Forgot your password?</p>
              <div className="auth-modal-actions" style={{marginTop: '3.2rem'}}>
                <button className="auth-button" type="submit" disabled={loadingLogin}>{loadingLogin ? 'Logging in...' : 'Login'}</button>
                <p style={{marginTop: '0.7rem', textAlign: 'center'}}>New to NegoGen T.? <button className="auth-switch-link" type="button" onClick={() => setIsSignIn(false)} style={{color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer'}} disabled={loadingLogin}>Register</button></p>
                {loginError && <div style={{color: 'red', marginTop: '0.5rem'}}>{loginError}</div>}
              </div>
            </form>
        ) : (
          <form className="auth-modal-content" onSubmit={handleRegister}>
            <h2 className="auth-modal-title">Register</h2>
            {/* Account Section */}
            <div className="auth-section">
              <h3 className="auth-section-title">Account</h3>
              <input type="text" name="firstName" value={regForm.firstName} onChange={handleRegChange} placeholder="First Name" className="auth-input" required disabled={loadingRegister} />
              <input type="text" name="lastName" value={regForm.lastName} onChange={handleRegChange} placeholder="Last Name" className="auth-input" required disabled={loadingRegister} />
              <input type="password" name="password" value={regForm.password} onChange={handleRegChange} placeholder="Password" className="auth-input" required disabled={loadingRegister} />
              <input type="password" name="confirmPassword" value={regForm.confirmPassword} onChange={handleRegChange} placeholder="Confirm Password" className="auth-input" required disabled={loadingRegister} />
            </div>
            {/* Contact Section */}
            <div className="auth-section">
              <h3 className="auth-section-title">Contact</h3>
              <input type="email" name="email" value={regForm.email} onChange={handleRegChange} placeholder="Email" className="auth-input" required disabled={loadingRegister} />
              <input type="text" name="contactNumber" value={regForm.contactNumber} onChange={handleRegChange} placeholder="Contact Number" className="auth-input" required disabled={loadingRegister} />
            </div>
            {/* Address Section */}
            <div className="auth-section">
              <h3 className="auth-section-title">Address</h3>
              <input type="text" name="barangay" value={regForm.barangay} onChange={handleRegChange} placeholder="Barangay" className="auth-input" required disabled={loadingRegister} />
              <input type="text" name="municipality" value={regForm.municipality} onChange={handleRegChange} placeholder="Municipality" className="auth-input" required disabled={loadingRegister} />
              <input type="text" name="zipcode" value={regForm.zipcode} onChange={handleRegChange} placeholder="Zipcode" className="auth-input" required disabled={loadingRegister} />
              <input type="text" name="houseNumber" value={regForm.houseNumber} onChange={handleRegChange} placeholder="House Number" className="auth-input" required disabled={loadingRegister} />
            </div>
            {/* Sign Up button and switch link below all sections */}
            <div className="auth-modal-actions">
              <button className="auth-button" type="submit" disabled={loadingRegister}>{loadingRegister ? 'Registering...' : 'Register'}</button>
              <p style={{marginTop: '0.7rem', textAlign: 'center'}}>Already have an account? <button className="auth-switch-link" type="button" onClick={() => setIsSignIn(true)} style={{color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer'}} disabled={loadingRegister}>Login</button></p>
              {regError && <div style={{color: 'red', marginTop: '0.5rem'}}>{regError}</div>}
              {regSuccess && <div style={{color: 'green', marginTop: '0.5rem'}}>{regSuccess}</div>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
