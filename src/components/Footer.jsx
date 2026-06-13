import React from 'react';
import { MapPin, Phone, MessageCircle, Store, Clock } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/mockData';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Store size={28} color="#e63946" />
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Emir<span style={{ color: '#e63946' }}>Spot</span></span>
            </div>
            <p style={{ lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Yılların deneyimiyle ikinci el eşyalarınızı değerinde alıyor, en kaliteli ürünleri en uygun fiyatlarla sunuyoruz.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                <Phone size={16} color="#e63946" />
                <span>0542 677 33 03</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                <Clock size={16} color="#e63946" />
                <span>Her gün 08:30 – 20:00</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3>İletişim</h3>
            <p style={{ lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Satmak istediğiniz eşyaların fotoğrafını WhatsApp'tan gönderin, hemen fiyat verelim!
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba, ilanlarınız hakkında bilgi almak istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ backgroundColor: '#25D366', backgroundImage: 'none', boxShadow: '0 4px 14px rgba(37,211,102,0.3)', width: '100%', justifyContent: 'center' }}>
              <MessageCircle size={18} />
              WhatsApp ile Yaz
            </a>
          </div>

          {/* Map */}
          <div>
            <h3>Konumumuz</h3>
            <div className="footer-map" style={{ height: '200px', marginBottom: '1rem' }}>
              <iframe
                src="https://maps.google.com/maps?q=39.503717,26.983632&hl=tr&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '0.875rem' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Emir Spot Konum"
              />
            </div>
            <a
              href="https://maps.app.goo.gl/rrzWC2fHYUt7Erb17"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e63946', fontWeight: 700, fontSize: '0.875rem' }}>
              <MapPin size={16} /> Haritada Aç →
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Emir Spot. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
