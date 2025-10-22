import React, { useState, useEffect } from "react";

import { usePage } from '@inertiajs/react';

const getShopId = (props) => {
  // Try to get shopId from props, Inertia page, or URL params
  if (props && props.shopId) return props.shopId;
  if (typeof window !== 'undefined') {
    // Try to get from URL
    const match = window.location.pathname.match(/\/eshop\/(\d+)\//);
    if (match) return match[1];
  }
  return '';
};

const ShopSidebar = ({ active = "dashboard", shopId }) => {
  const id = getShopId({ shopId });
  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      href: `/eshop/${id}/dashboard`,
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></svg>
      ),
    },
    {
      key: "details",
      label: "Details",
      href: `/eshop/${id}/details`,
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="3"/><rect x="9" y="2" width="6" height="5" rx="2"/><circle cx="12" cy="14" r="4"/></svg>
      ),
    },
    {
      key: "products",
      label: "Products",
      href: `/eshop/${id}/products`,
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 21h8"/></svg>
      ),
    },
    {
      key: "orders",
      label: "Orders",
      href: `/eshop/${id}/orders`,
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/></svg>
      ),
    },
    {
      key: "settings",
      label: "Settings",
      href: `/eshop/${id}/settings`,
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c0 .66.39 1.26 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.66 0 1.26.39 1.51 1H21a2 2 0 0 1 0 4h-.09c-.25 0-.48.09-.68.26"/></svg>
      ),
    },
  ];

// ...existing code...
  const [minimized, setMinimized] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('shopSidebarMinimized');
      return stored === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shopSidebarMinimized', minimized);
    }
  }, [minimized]);

  return (
    <aside
      className={`shop-sidebar${minimized ? ' shop-sidebar--min' : ''}`}
    >
      {/* Hamburger menu */}
      <div
        className={`shop-sidebar__hamburger${minimized ? ' shop-sidebar__hamburger--min' : ''}`}
      >
        <button
          onClick={() => setMinimized((m) => !m)}
          className={`shop-sidebar__hamburger-btn${minimized ? ' shop-sidebar__hamburger-btn--min' : ''}`}
          aria-label={minimized ? 'Expand sidebar' : 'Minimize sidebar'}
        >
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        {!minimized && (
          <span className="shop-sidebar__menu-label">Menu</span>
        )}
      </div>

      {menuItems.map((item) => (
        <a
          key={item.key}
          href={item.href}
          className={`shop-sidebar__item${active === item.key ? ' shop-sidebar__item--active' : ''}${minimized ? ' shop-sidebar__item--min' : ''}`}
          title={item.label}
        >
          <span className="shop-sidebar__icon">{item.icon}</span>
          {!minimized && <span className="shop-sidebar__label">{item.label}</span>}
        </a>
      ))}
    </aside>
  );
};

export default ShopSidebar;
