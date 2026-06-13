import React, { useState, useEffect } from 'react';
import { ShoppingCart, ZoomIn, X, Share2, Heart, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { WHATSAPP_NUMBER } from '../data/mockData';

const ProductCard = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('emirFavorites') || '[]');
    setIsFavorite(favs.includes(product.id));
  }, [product.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    let favs = JSON.parse(localStorage.getItem('emirFavorites') || '[]');
    if (isFavorite) {
      favs = favs.filter(id => id !== product.id);
      toast('Favorilerden çıkarıldı', { icon: '💔' });
    } else {
      favs.push(product.id);
      toast.success('Favorilere eklendi! ❤️');
    }
    localStorage.setItem('emirFavorites', JSON.stringify(favs));
    setIsFavorite(!isFavorite);
  };

  const waMsg = `Merhaba, "${product.title}" (${product.price}) ilanınızla ilgileniyorum. Müsait misiniz?`;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try { await navigator.share({ title: product.title, text: `${product.title} - ${product.price}`, url: window.location.href }); }
      catch (_) {}
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success('Link kopyalandı!');
    }
  };

  const isNew = product.created_at && (Date.now() - new Date(product.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000;

  return (
    <>
      <div className="card" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
        <div className="product-image-container">
          {imgError ? (
            <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'#f1f5f9', color:'#94a3b8', fontSize:'0.875rem', flexDirection:'column', gap:'0.5rem' }}>
              <span style={{ fontSize: '2rem' }}>🖼️</span>
              Görsel yok
            </div>
          ) : (
            <img src={product.image} alt={product.title} className="product-image" onError={() => setImgError(true)} />
          )}

          <div className="zoom-overlay">
            <ZoomIn size={40} color="white" strokeWidth={1.5} />
            <span style={{ color: 'white', marginTop: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Detayları Gör</span>
          </div>

          <div className="product-badge">{product.category}</div>
          {isNew && <div className="product-badge new" style={{ left: 'auto', right: '0.875rem' }}>YENİ</div>}

          <button onClick={toggleFavorite}
            style={{ position: 'absolute', bottom: '0.875rem', right: '0.875rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s', zIndex: 3 }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <Heart size={18} fill={isFavorite ? '#e63946' : 'none'} color={isFavorite ? '#e63946' : '#64748b'} />
          </button>
        </div>

        <div className="product-content">
          <h3 className="product-title">
            {product.title?.length > 40 ? product.title.substring(0, 40) + '…' : product.title}
          </h3>
          <div className="product-price">{product.price}</div>
          <div className="product-actions">
            <button onClick={(e) => { e.stopPropagation(); window.open(waLink, '_blank'); }}
              className="btn-primary" style={{ flex: 1, padding: '0.7rem 0.75rem', fontSize: '0.875rem', borderRadius: '0.75rem' }}>
              <ShoppingCart size={16} /> Satın Al
            </button>
            <button onClick={handleShare} className="btn-secondary"
              style={{ padding: '0.7rem 0.75rem', borderRadius: '0.75rem' }} title="Paylaş">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="product-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}><X size={22} /></button>
            <div className="modal-grid">
              <div className="modal-image-wrapper">
                {imgError ? (
                  <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'#f1f5f9', fontSize: '3rem' }}>🖼️</div>
                ) : (
                  <img src={product.image} alt={product.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={() => setImgError(true)} />
                )}
              </div>
              <div className="modal-details">
                <div>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.3rem 0.75rem', background:'rgba(230,57,70,0.1)', color:'var(--primary)', borderRadius:'2rem', fontSize:'0.75rem', fontWeight:800, marginBottom:'1rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                    {product.category}
                    {isNew && <span style={{ background:'#10b981', color:'white', padding:'0.1rem 0.4rem', borderRadius:'1rem', marginLeft:'0.25rem' }}>YENİ</span>}
                  </div>
                  <h2 style={{ fontSize:'1.75rem', fontWeight:900, color:'var(--secondary)', marginBottom:'0.5rem', lineHeight:1.2 }}>{product.title}</h2>
                  <div style={{ fontSize:'2.25rem', fontWeight:900, color:'var(--primary)', marginBottom:'1.5rem' }}>{product.price}</div>
                  <div className="modal-desc-box">
                    <p style={{ color:'var(--text-muted)', lineHeight:1.7, fontSize:'0.95rem' }}>
                      {product.description || 'Bu ürün için henüz detaylı açıklama girilmemiş. WhatsApp üzerinden bilgi alabilirsiniz.'}
                    </p>
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginTop:'1.5rem' }}>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary"
                    style={{ width:'100%', padding:'1rem', fontSize:'1rem' }}>
                    <MessageCircle size={20} /> WhatsApp'tan Bilgi Al / Satın Al
                  </a>
                  <button onClick={toggleFavorite} className="btn-secondary"
                    style={{ width:'100%', padding:'0.875rem', color: isFavorite ? 'var(--primary)' : 'inherit' }}>
                    <Heart size={18} fill={isFavorite ? 'var(--primary)' : 'none'} />
                    {isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                  </button>
                  <p style={{ textAlign:'center', fontSize:'0.8rem', color:'var(--text-muted)', lineHeight:1.5 }}>
                    ⚡ Ürünlerimiz hızla satılabilir. Müsaitlik için lütfen bizimle iletişime geçin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
