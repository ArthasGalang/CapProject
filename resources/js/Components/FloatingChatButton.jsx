import React from 'react';

const FloatingChatButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
  backgroundColor: 'var(--color-primary)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      cursor: 'pointer',
      zIndex: 1000,
    }}
    aria-label="Open chat"
  >
    {/* Simple chat icon (SVG) */}
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);

export default FloatingChatButton;
