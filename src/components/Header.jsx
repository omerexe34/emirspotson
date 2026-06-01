import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Clock, Circle } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      const currentTimeInMinutes = hours * 60 + minutes;
      const openTimeInMinutes = 8 * 60 + 30; // 08:30
      const closeTimeInMinutes = 20 * 60; // 20:00
      
      if (currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header>
      <div className="container header-container flex items-center justify-between">
        <Link to="/" className="logo">
          <Store size={32} color="var(--primary)" />
          Emir<span>Spot</span>
        </Link>
        <div className="working-hours" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>08:30 - 20:00</span>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              color: isOpen ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Circle size={8} fill="currentColor" strokeWidth={0} />
              {isOpen ? 'ŞU AN AÇIK' : 'ŞU AN KAPALI'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

