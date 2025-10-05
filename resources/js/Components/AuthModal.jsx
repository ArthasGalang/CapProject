
import React, { useState, useEffect } from 'react';

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [isSignIn, setIsSignIn] = useState(initialTab === 'login');

  useEffect(() => {
    setIsSignIn(initialTab === 'login');
  }, [initialTab]);

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
          <div className="auth-modal-content">
            <h2 className="auth-modal-title" style={{paddingBottom: '3.5rem'}}>Login</h2>
            <input type="email" placeholder="Email" className="auth-input" />
            <input type="password" placeholder="Password" className="auth-input" />
            <p className="auth-forgot-password">Forgot your password?</p>
            <div className="auth-modal-actions" style={{marginTop: '3.2rem'}}>
              <button className="auth-button">Login</button>
              <p style={{marginTop: '0.7rem', textAlign: 'center'}}>New to NegoGen T.? <button className="auth-switch-link" onClick={() => setIsSignIn(false)} style={{color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer'}}>Register</button></p>
            </div>
          </div>
        ) : (
          <div className="auth-modal-content">
            <h2 className="auth-modal-title">Register</h2>
            {/* Account Section */}
            <div className="auth-section">
              <h3 className="auth-section-title">Account</h3>
              <input type="text" placeholder="First Name" className="auth-input" />
              <input type="text" placeholder="Last Name" className="auth-input" />
              <input type="password" placeholder="Password" className="auth-input" />
              <input type="password" placeholder="Confirm Password" className="auth-input" />
            </div>
            {/* Contact Section */}
            <div className="auth-section">
              <h3 className="auth-section-title">Contact</h3>
              <input type="email" placeholder="Email" className="auth-input" />
              <input type="text" placeholder="Contact Number" className="auth-input" />
            </div>
            {/* Address Section */}
            <div className="auth-section">
              <h3 className="auth-section-title">Address</h3>
              <input type="text" placeholder="Barangay" className="auth-input" />
              <input type="text" placeholder="Municipality" className="auth-input" />
              <input type="text" placeholder="Zipcode" className="auth-input" />
              <input type="text" placeholder="House Number" className="auth-input" />
            </div>
            {/* Sign Up button and switch link below all sections */}
            <div className="auth-modal-actions">
              <button className="auth-button">Register</button>
              <p style={{marginTop: '0.7rem', textAlign: 'center'}}>Already have an account? <button className="auth-switch-link" onClick={() => setIsSignIn(true)} style={{color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer'}}>Login</button></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
