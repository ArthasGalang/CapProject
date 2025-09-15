import React, { useState } from "react";

export default function Header({ onToggleSidebar }) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  return (
    <header className="admin-header">
      <button
        onClick={handleClick}
        className={`hamburger ${isActive ? "active" : ""}`}
        aria-label="Toggle sidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className="flex-spacer"></div>
      <div className="admin-text">Admin</div>
    </header>
  );
}
