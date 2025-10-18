import React, { useEffect } from 'react';
import '../../css/shop.css';

const Toast = ({ message, type = 'success', onClose, duration = 2500 }) => {
  useEffect(() => {
    if (!onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`shop-toast shop-toast--top shop-toast--${type}`}> 
      <span>{message}</span>
      <button className="shop-toast-close" onClick={onClose}>&times;</button>
    </div>
  );
};

export default Toast;
