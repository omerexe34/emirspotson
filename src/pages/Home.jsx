import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { categories, WHATSAPP_NUMBER } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { Search, Tag, MessageSquare, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('İlanlar yüklenirken bir hata oluştu veya veritabanı tablosu ("products") henüz oluşturulmadı.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'Tümü' || p.category === activeCategory;
    const titleMatch = p.title ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    return matchesCategory && titleMatch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <Helmet>
        <title>Emir Spot | İkinci El Eşya Alım Satım Merkezi</title>
        <meta name="description" content="Kullanmadığınız eşyalarınızı değerinde nakit alıyor, ihtiyacınız olan ürünleri en uygun fiyata sunuyoruz. Pendik ve çevresi spot eşya." />
        <meta property="og:title" content="Emir Spot | İkinci El Eşya" />
        <meta property="og:description" content="İkinci el eşyalarınızı anında nakde çevirin veya uygun fiyata eşya alın." />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Hero Section */}
      <div className="container">
        <section className="hero">
          <h1>İkinci El Eşyada<br/><span style={{ color: 'var(--primary)' }}>Güvenin Adresi</span></h1>
          <p>Kullanmadığınız eşyalarınızı değerinde nakit olarak alıyor, ihtiyacınız olan ürünleri en uygun fiyat garantisiyle sizlere sunuyoruz.</p>
          <div className="hero-buttons">
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba, size eşya satmak istiyorum. Fotoğraf gönderebilir miyim?`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
            >
              <MessageSquare size={20} />
              Eşya Satmak İstiyorum
            </a>
            <a href="#ilanlar" className="btn-secondary">
              İlanları İncele
            </a>
          </div>
        </section>
      </div>

      <div className="container" id="ilanlar">
        {/* Search and Filters */}
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}><Tag size={28} /> Kategoriler</h2>
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="İlanlarda ara..." 
              style={{ paddingLeft: '2.5rem', background: 'var(--bg-card)', color: 'var(--text-dark)' }}
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '72607260') {
                  navigate('/admin');
                } else {
                  setSearchQuery(val);
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="category-filter" style={{ flex: 1, marginBottom: 0 }}>
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          <select 
            className="form-input" 
            style={{ width: 'auto', minWidth: '150px', appearance: 'auto', background: 'var(--bg-card)', color: 'var(--text-dark)', padding: '0.5rem 1rem' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">En Yeniler</option>
            <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
          </select>
        </div>

        {/* Error State */}
        {error && (
          <div style={{ padding: '1.5rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '1rem', marginBottom: '2rem', textAlign: 'center', border: '1px solid #fca5a5' }}>
            {error}
          </div>
        )}

        {/* Product List */}
        <section>
          {loading ? (
            <div className="flex items-center" style={{ justifyContent: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <Loader2 className="spin" size={32} />
              <span style={{ marginLeft: '1rem', fontSize: '1.25rem' }}>İlanlar yükleniyor...</span>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-card)', borderRadius: '1.5rem', border: '1px dashed var(--border-color)' }}>
              <Search size={48} color="var(--border-color)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Sonuç Bulunamadı</h3>
              <p style={{ color: 'var(--text-muted)' }}>Aradığınız kriterlere uygun ilan bulunmuyor.</p>
            </div>
          )}
        </section>

        {/* CTA Banner */}
        <section className="cta-section">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--secondary)' }}>Eski Eşyalarınızı Nakde Çevirin</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Buzdolabı, çamaşır makinesi, mobilya ve diğer ev eşyalarınız için WhatsApp'tan fotoğraf gönderin, hemen fiyat verelim. Anında nakit ödeme!
          </p>
          <a 
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba, eşyalarımın fotoğrafını atsam fiyat alabilir miyim?`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary"
            style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}
          >
            Hemen Fiyat Al
          </a>
        </section>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba, ilanlar hakkında bilgi almak istiyorum.`}
        className="fab-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        title="WhatsApp ile iletişime geç"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      </a>
    </div>
  );
};

export default Home;
