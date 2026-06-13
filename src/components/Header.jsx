import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Clock, Circle } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkOpen = () => {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      setIsOpen(mins >= 8 * 60 + 30 && mins < 20 * 60);
    };
    checkOpen();
    const t = setInterval(checkOpen, 60000);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    return () => { clearInterval(t); window.removeEventListener('scroll', handleScroll); };
  }, []);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="container header-container flex items-center justify-between">
        <Link to="/" className="logo">
          <Store size={28} color="#e63946" />
          Emir<span>Spot</span>
        </Link>

        <div className="flex items-center" style={{ gap: '1rem' }}>
          <div className="status-badge">
            <div className={`status-dot ${isOpen ? 'open' : 'closed'}`} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isOpen ? '#10b981' : '#ef4444' }}>
                {isOpen ? 'AÇIK' : 'KAPALI'}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>08:30 – 20:00</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
