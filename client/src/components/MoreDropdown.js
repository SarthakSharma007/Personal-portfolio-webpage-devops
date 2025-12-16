import React, { useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import './MoreDropdown.css';

const MoreDropdown = ({ isOpen, onClose, moreItems, activeSection, onNavigate }) => {
  const dropdownRef = useRef(null);

  // ── Close on click anywhere outside the dropdown ──────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    // Use capture phase so it fires before any other handler
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="md-dropdown" ref={dropdownRef}>
      {moreItems.map(item => (
        <button
          key={item.id}
          className={`md-item ${activeSection === item.id ? 'active' : ''}`}
          onClick={() => {
            onNavigate(item.id);
            onClose();
          }}
        >
          {item.label}
        </button>
      ))}
      <div className="md-divider" />
      <div className="md-theme-row">
        <span>Theme</span>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default MoreDropdown;
