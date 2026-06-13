import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { categories, WHATSAPP_NUMBER } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { Search, Tag, MessageSquare, Loader2, Star, Package, Users, ThumbsUp } from 'lucide-react';
import { supabase } from '../utils/supabase';

const REVIEWS = [
  { name: 'Ahmet Y.', loc: 'Pendik', text: 'Çok memnun kaldım. Buzdolabını gerçekten değerinde aldılar, para da anında verildi. Kesinlikle tavsiye ederim!', initials: 'AY' },
  { name: 'Fatma K.', loc: 'Kartal', text: 'WhatsApp\'tan fotoğraf attım, yarım saat içinde geldiler. Mobilyalarımı güzel bir fiyata aldılar. Teşekkürler Emir Spot!', initials: 'FK' },
  { name: 'Mehmet S.', loc: 'Maltepe', text: 'Hem alım hem satım yaptım. Fiyatları piyasanın en iyisi. İkinci el ihtiyaçlarım için artık ilk tercihim.', initials: 'MS' },
  { name: 'Ayşe D.', loc: 'Tuzla', text: 'Çok güvenilir bir yer. Taşınırken tüm eşyalarımı buraya sattım, hiçbir sorun yaşamadım. Harika hizmet!', initials: 'AD' },
];

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setProducts(data);
    } catch (err) {
      setError('İlanlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === 'Tümü' || p.category === activeCategory;
    const matchSearch = p.title ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  const categoryEmojis = { 'Tümü': '🏠', 'Mobilya': '🛋️', 'Elektronik': '📱', 'Beyaz Eşya': '🧺', 'Mutfak': '🍳', 'Diğer': '📦' };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <Helmet>
        <title>Emir Spot | İkinci El Eşya Alım Satım Merkezi</title>
        <meta name="description" content="Kullanmadığınız eşyalarınızı değerinde nakit alıyor, ihtiyacınız olan ürünleri en uygun fiyata sunuyoruz. Pendik ve çevresi spot eşya." />
      </Helmet>

      {/* ── Hero ── */}
      <div className="container">
        <motion.section
          className="hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-eyebrow">
            <Star size={14} />
            Pendik'in 1 Numaralı Spot Mağazası
          </div>
          <h1>İkinci El Eşyada<br /><span>Güvenin Adresi</span></h1>
          <p>Kullanmadığınız eşyalarınızı değerinde nakit alıyor, ihtiyacınız olan ürünleri en uygun fiyat garantisiyle sunuyoruz.</p>
          <div className="hero-buttons">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba, size eşya satmak istiyorum. Fotoğraf gönderebilir miyim?`}
              target="_blank" rel="noopener noreferrer" className="btn-primary">
              <MessageSquare size={20} /> Eşya Satmak İstiyorum
            </a>
            <a href="#ilanlar" className="btn-secondary">İlanları İncele →</a>
          </div>

          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-num">500+</div>
              <div className="stat-label">Aktif İlan</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">2K+</div>
              <div className="stat-label">Mutlu Müşteri</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">5★</div>
              <div className="stat-label">Memnuniyet</div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* ── How It Works ── */}
      <div className="container">
        <div className="how-section">
          <div className="section-eyebrow">Nasıl Çalışır?</div>
          <div className="section-title">3 Adımda Nakite Çevir</div>
          <div className="steps-grid">
            {[
              { icon: '📸', title: 'Fotoğraf Gönder', desc: 'WhatsApp\'tan eşyanızın fotoğrafını bize gönderin.' },
              { icon: '💰', title: 'Fiyat Al', desc: 'Anında değerlendirme yaparak size en iyi fiyatı verelim.' },
              { icon: '🚚', title: 'Nakit Öde', desc: 'Kapınıza gelip eşyayı alıyor, anında nakit ödüyoruz.' },
            ].map((step, i) => (
              <motion.div key={i} className="step-card"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="container" id="ilanlar">
        <div className="section-header">
          <div className="section-eyebrow">Güncel İlanlar</div>
          <div className="section-title">Mevcut Ürünlerimiz</div>
        </div>

        <div className="filter-bar">
          <div className="search-wrap">
            <Search size={18} />
            <input
              type="text"
              className="form-input"
              placeholder="İlanlarda ara..."
              style={{ paddingLeft: '2.75rem' }}
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '72607260') navigate('/admin');
                else setSearchQuery(val);
              }}
            />
          </div>
          <div className="filter-row">
            <div className="category-filter">
              {categories.map(cat => (
                <button key={cat}
                  className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}>
                  {categoryEmojis[cat] || '📦'} {cat}
                </button>
              ))}
            </div>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">En Yeniler</option>
              <option value="price-asc">Fiyat ↑</option>
              <option value="price-desc">Fiyat ↓</option>
            </select>
          </div>
        </div>

        {error && (
          <div style={{ padding: '1.25rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center" style={{ justifyContent: 'center', padding: '5rem 0', color: 'var(--text-muted)', gap: '1rem' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '1.1rem' }}>İlanlar yükleniyor...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product, index) => (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Package size={56} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Sonuç Bulunamadı</h3>
            <p>Arama kriterlerinize uygun ilan bulunamadı.</p>
          </div>
        )}
      </div>

      {/* ── Reviews ── */}
      <div className="container reviews-section">
        <div className="section-header">
          <div className="section-eyebrow">Müşteri Yorumları</div>
          <div className="section-title">Onlar Memnun, Siz Memnun</div>
        </div>
        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <motion.div key={i} className="review-card"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                <div className="review-avatar">{r.initials}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-loc">{r.loc}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="container">
        <motion.div className="cta-section"
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}>
          <h2>Eşyalarınız Değerinde Kalsın!</h2>
          <p>Kullanmadığınız eşyaları WhatsApp'tan fotoğraflayıp gönderin, anında fiyat alın. Kapınıza gelip nakit ödüyoruz!</p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba, eşyalarımın fotoğrafını atsam fiyat alabilir miyim?`}
            target="_blank" rel="noopener noreferrer"
            className="btn-primary"
            style={{ backgroundColor: '#25D366', backgroundImage: 'none', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            <MessageSquare size={22} /> WhatsApp'tan Hemen Yaz
          </a>
        </motion.div>
      </div>

      {/* ── WhatsApp FAB ── */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="fab-whatsapp" target="_blank" rel="noopener noreferrer" title="WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12 19.79 19.79 0 0 1 1.06 3.38 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      </a>
    </div>
  );
};

export default Home;
