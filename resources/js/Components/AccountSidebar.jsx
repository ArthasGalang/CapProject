import React from 'react';

const AccountSidebar = ({ active }) => {
  const menu = [
    { label: 'Profile', icon: 'user', activeKey: 'profile' },
    { label: 'Orders', icon: 'list', activeKey: 'orders' },
    { label: 'Addresses', icon: 'location', activeKey: 'addresses' },
    { label: 'Settings', icon: 'settings', activeKey: 'settings' },
  ];

  const getIcon = (icon, isActive) => {
    const color = isActive ? '#22c55e' : '#222';
    switch (icon) {
      case 'user':
        return <svg width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>;
      case 'list':
        return <svg width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></svg>;
      case 'location':
        return <svg width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg>;
      case 'settings':
        return <svg width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
      default:
        return null;
    }
  };

  return (
    <aside style={{
      background: '#fff',
      borderRadius: '20px',
      boxShadow: '0 2px 16px #0001',
      padding: '2.2rem 0 2.2rem 0',
      width: '240px',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '0',
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: '1.1rem', marginBottom: '2.2rem', paddingLeft: '2.2rem'}}>
        {/* Hamburger icon */}
        <svg width="32" height="32" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.2rem'}}>
          <line x1="7" y1="10" x2="25" y2="10" />
          <line x1="7" y1="16" x2="25" y2="16" />
          <line x1="7" y1="22" x2="25" y2="22" />
        </svg>
        <span style={{fontWeight: 600, fontSize: '1.25rem', color: '#222', letterSpacing: '0.01em'}}>Account</span>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', paddingLeft: '1.7rem', paddingRight: '1.7rem' }}>
        {menu.map((item) => {
          const isActive = active === item.activeKey;
          let href = '/account';
          if (item.activeKey === 'orders') href = '/account/orders';
          if (item.activeKey === 'addresses') href = '/account/addresses';
          if (item.activeKey === 'settings') href = '/account/settings';
          return (
            <button
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.1rem',
                background: isActive ? '#f3fdf7' : 'none',
                color: isActive ? '#22c55e' : '#222',
                border: 'none',
                borderRadius: '12px',
                padding: '1.1rem 1.2rem',
                fontWeight: isActive ? 600 : 500,
                fontSize: '1.13rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
                boxShadow: isActive ? '0 2px 8px #22c55e11' : 'none',
                outline: 'none',
              }}
              onClick={() => window.location.href = href}
            >
              <span style={{ color: isActive ? '#22c55e' : '#222', display: 'flex', alignItems: 'center' }}>
                {getIcon(item.icon, isActive)}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default AccountSidebar;
