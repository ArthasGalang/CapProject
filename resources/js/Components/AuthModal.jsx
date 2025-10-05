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

        <div className="auth-modal-right">
          <h2>Hey, new friend!</h2>
          <p>New to the Village? Sign up and start your journey</p>
          <button className="auth-button signup-button" onClick={() => setIsSignIn(false)}>Sign Up</button>
        </div>
                <div className="auth-modal-left">
          <h2>Sign in</h2>
          <div className="auth-social-icons">
            <span className="social-icon">●</span>
            <span className="social-icon">●</span>
            <span className="social-icon">●</span>
          </div>
          <p className="auth-or-text">or use your account</p>
          <input type="email" placeholder="Email" className="auth-input" />
          <input type="password" placeholder="Password" className="auth-input" />
          <p className="auth-forgot-password">Forgot your password?</p>
          <button className="auth-button" onClick={() => setIsSignIn(true)}>Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
