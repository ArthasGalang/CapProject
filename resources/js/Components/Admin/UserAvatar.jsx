import React from "react";

export default function UserAvatar({ name }) {
  // Placeholder avatar, could be replaced with real image logic
  return (
    <div style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 18,
      color: '#2563eb',
      marginRight: 12,
      overflow: 'hidden',
    }}>
      <span>{name ? name[0] : '?'}</span>
    </div>
  );
}
