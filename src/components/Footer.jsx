import React from 'react';
import { MapPin, Phone, MessageCircle, Store, Mail } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/mockData';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand Col */}
          <div>
            <div className="logo" style={{ color: 'white', marginBottom: '1.5rem', fontSize: '2rem' }}>
              <Store size={32} color="var(--primary)" />
              Emir<span style={{ color: 'var(--primary)' }}>Spot</span>
            </div>
            <p style={{ lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '350px' }}>
              Yılların verdiği tecrübe ile ikinci el eşyalarınızı değerinde alıyor, en kaliteli ürünleri en uygun fiyatlarla müşterilerimize sunuyoruz.
            </p>
            <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '50%' }}>
                <Phone size={18} color="var(--primary)" />
              </div>
              <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>0542 677 33 03</span>
            </div>
            <div className="flex items-center" style={{ gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '50%' }}>
                <MapPin size={18} color="var(--primary)" />
              </div>
              <span>Mağaza Konumumuz (Hemen Ziyaret Edin)</span>
            </div>
          </div>
          
          {/* Contact Col */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Hızlı İletişim
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Eşya satmak veya ilanlarımız hakkında detaylı bilgi almak için bize 7/24 WhatsApp üzerinden ulaşabilirsiniz.
            </p>
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba, ilanlarınız hakkında bilgi almak istiyorum.`}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ backgroundColor: '#25D366', backgroundImage: 'none', boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)', padding: '1rem 2rem' }}
            >
              <MessageCircle size={20} />
              WhatsApp ile İletişime Geç
            </a>
          </div>

          {/* Map Col */}
          <div>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Konumumuz
            </h3>
            <div className="footer-map" style={{ height: '200px' }}>
              <iframe 
                src="https://maps.google.com/maps?q=39.503717,26.983632&hl=tr&z=15&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '0.75rem' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Emir Spot Konum"
              ></iframe>
            </div>
            <p style={{ marginTop: '1rem', textAlign: 'right' }}>
              <a href="https://maps.app.goo.gl/rrzWC2fHYUt7Erb17" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                Haritalarda Aç &rarr;
              </a>
            </p>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.875rem' }} className="text-muted">
          &copy; {new Date().getFullYear()} Emir Spot. Tüm hakları saklıdır. Her gün 08:30 - 20:00 arası hizmetinizdeyiz.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
