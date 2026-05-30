import React, { useState, useEffect } from 'react';
import { ShoppingCart, ZoomIn, X, Share2, Info, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { WHATSAPP_NUMBER } from '../data/mockData';

const ProductCard = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
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
      toast.success('Favorilere eklendi!');
    }
    localStorage.setItem('emirFavorites', JSON.stringify(favs));
    setIsFavorite(!isFavorite);
  };
  
  const whatsappMessage = `Merhaba, ${product.title} (${product.price}) ilanınızla ilgileniyorum.`;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  // Share functionality (for mobile or browsers that support it)
  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `${product.title} - ${product.price}\nEmir Spot'ta bu ürüne göz atın!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Paylaşım iptal edildi', error);
      }
    } else {
      alert("Tarayıcınız paylaşım özelliğini desteklemiyor.");
    }
  };

  return (
    <>
      <div className="card group" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
        <div className="product-image-container">
          <img src={product.image} alt={product.title} className="product-image" />
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', boxShadow: 'var(--shadow-sm)', zIndex: 2 }}>
            {product.category}
          </div>
          
          {/* Zoom icon overlay */}
          <div className="zoom-overlay">
            <ZoomIn size={48} color="white" strokeWidth={1.5} />
            <span style={{ color: 'white', marginTop: '0.5rem', fontWeight: 500, letterSpacing: '0.05em' }}>İncele</span>
          </div>
        </div>
        <div className="product-content">
          <h3 className="product-title" title={product.title}>
            {product.title.length > 35 ? product.title.substring(0, 35) + '...' : product.title}
          </h3>
          <div className="product-price">{product.price}</div>
          
          <div className="flex" style={{ gap: '0.5rem' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); window.open(whatsappLink, '_blank'); }}
              className="btn-primary"
              style={{ flex: 1, padding: '0.75rem' }}
            >
              <ShoppingCart size={18} />
              Satın Al
            </button>
            <button 
              onClick={toggleFavorite}
              className="btn-secondary"
              style={{ padding: '0.75rem', color: isFavorite ? '#e63946' : 'inherit' }}
              title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            >
              <Heart size={18} fill={isFavorite ? '#e63946' : 'none'} />
            </button>
            <button 
              onClick={handleShare}
              className="btn-secondary"
              style={{ padding: '0.75rem' }}
              title="Paylaş"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </button>
            
            <div className="modal-grid">
              {/* Left Side: Big Image */}
              <div className="modal-image-wrapper">
                <img src={product.image} alt={product.title} />
              </div>
              
              {/* Right Side: Details */}
              <div className="modal-details">
                <div>
                  <div style={{ display: 'inline-block', padding: '0.35rem 0.75rem', background: 'rgba(230, 57, 70, 0.1)', color: 'var(--primary)', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {product.category}
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                    {product.title}
                  </h2>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2rem' }}>
                    {product.price}
                  </div>
                  
                  <div className="modal-desc-box">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--secondary)', fontWeight: 600 }}>
                      <Info size={18} /> Ürün Açıklaması
                    </div>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {product.description || "Bu ürün için henüz detaylı bir açıklama girilmemiş. Lütfen WhatsApp üzerinden bilgi isteyiniz."}
                    </p>
                  </div>
                </div>
                
                <div style={{ marginTop: 'auto' }}>
                  <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary"
                    style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem' }}
                  >
                    <ShoppingCart size={22} />
                    WhatsApp'tan Satın Al / Bilgi İste
                  </a>
                  <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Ürünlerimiz hızlıca satılabildiği için lütfen müsaitlik durumunu sorunuz.
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
