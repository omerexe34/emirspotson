import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/mockData';
import { Trash2, Edit, Plus, ArrowLeft, LayoutDashboard, Package, Tag, UploadCloud, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

const Admin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ id: '', title: '', category: 'Buzdolabı', price: '', description: '' });
  const [files, setFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

      if (error) throw error;
      if (data) setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadImage = async (fileToUpload) => {
    // Image Compression
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true
    };
    
    let compressedFile = fileToUpload;
    try {
      compressedFile = await imageCompression(fileToUpload, options);
    } catch (error) {
      console.log('Sıkıştırma hatası, orijinal dosya yükleniyor...', error);
    }

    const fileExt = compressedFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, compressedFile);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let imageUrl = formData.image;

      if (files.length > 0) {
        toast.loading(`${files.length} fotoğraf yükleniyor...`, { id: 'uploadToast' });
        const uploadedUrls = await Promise.all(files.map(f => uploadImage(f)));
        imageUrl = uploadedUrls.join(',');
        toast.dismiss('uploadToast');
      } else if (!isEditing && !imageUrl) {
        toast.error('Lütfen en az bir resim seçin!');
        setSubmitting(false);
        return;
      }

      const productData = {
        title: formData.title,
        category: formData.category,
        price: formData.price,
        description: formData.description,
        image: imageUrl
      };

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', formData.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
          
        if (error) throw error;
      }

      await fetchProducts();
      resetForm();
      toast.success(isEditing ? 'İlan güncellendi!' : 'İlan başarıyla eklendi!');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.dismiss('uploadToast');
      toast.error('İlan kaydedilirken hata oluştu!\n\nDetaylı Hata: ' + (error.message || 'Bilinmeyen hata'), { duration: 6000 });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormData({ id: '', title: '', category: 'Buzdolabı', price: '', description: '', image: '' });
    setFiles([]);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setFiles([]); // Clear file input when editing existing
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu ilanı silmek/satıldı olarak işaretlemek istediğinize emin misiniz?')) {
      const toastId = toast.loading('Siliniyor...');
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        await fetchProducts();
        toast.success('İlan silindi!', { id: toastId });
      } catch (err) {
        console.error('Error deleting product:', err);
        toast.error('Silinirken hata oluştu.', { id: toastId });
      }
    }
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', items: 'center', gap: '0.75rem' }}>
              <LayoutDashboard size={32} color="var(--primary)" />
              Yönetici Paneli (Supabase)
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>İlanlarınızı veritabanı üzerinden anlık yönetin.</p>
          </div>
          <button onClick={() => navigate('/')} className="btn-secondary">
            <ArrowLeft size={18} /> Siteye Dön
          </button>
        </div>

        {/* Stats */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(230, 57, 70, 0.1)', padding: '1rem', borderRadius: '1rem' }}>
              <Package size={32} color="var(--primary)" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Toplam İlan</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>{products.length}</h3>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 2.5fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* Form */}
          <div className="admin-sidebar" style={{ position: 'sticky', top: '6rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              {isEditing ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Başlık (Örn: Arçelik Buzdolabı)</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" required />
              </div>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-input" required style={{ appearance: 'auto' }}>
                  {categories.filter(c => c !== 'Tümü').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Fiyat (Örn: 5.000 ₺)</label>
                <input type="text" name="price" value={formData.price} onChange={handleChange} className="form-input" required />
              </div>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Ürün Açıklaması</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} className="form-input" rows="3" placeholder="Ürün durumu, özellikleri vb."></textarea>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Ürün Fotoğrafı Yükle</label>
                <div style={{ position: 'relative' }}>
                  <input type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
                  <label htmlFor="file-upload" className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', background: 'var(--bg-main)', borderStyle: 'dashed' }}>
                    <UploadCloud size={20} />
                    {files.length > 0 ? `${files.length} fotoğraf seçildi` : (formData.image ? 'Yeni Resimler Seç (Mevcutları Değiştirir)' : 'Fotoğraflar Seç (Birden Fazla Seçebilirsiniz)')}
                  </label>
                </div>
                {formData.image && files.length === 0 && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {formData.image.split(',').map((img, idx) => (
                      <img key={idx} src={img} alt="Önizleme" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0, border: '1px solid var(--border-color)' }} />
                    ))}
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem' }} disabled={submitting}>
                  {submitting ? <Loader2 size={18} className="spin" /> : (isEditing ? <><Edit size={18}/> Güncelle</> : <><Plus size={18}/> İlan Ekle</>)}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="btn-secondary" style={{ padding: '0.75rem' }} disabled={submitting}>
                    İptal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className="card" style={{ background: 'var(--bg-card)' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Veritabanındaki İlanlar</h2>
            </div>
            
            <div style={{ overflowX: 'auto', padding: '0 1rem 1rem 1rem' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <Loader2 size={32} className="spin" style={{ margin: '0 auto 1rem auto' }} /> Yükleniyor...
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Görsel</th>
                      <th>Başlık</th>
                      <th>Kategori</th>
                      <th>Fiyat</th>
                      <th style={{ textAlign: 'right' }}>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} style={{ transition: 'background 0.2s' }} className="hover:bg-gray-50">
                        <td>
                          <img src={product.image ? product.image.split(',')[0] : ''} alt={product.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.5rem', boxShadow: 'var(--shadow-sm)' }} />
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--secondary)' }}>{product.title}</td>
                        <td>
                          <span style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', background: 'rgba(230, 57, 70, 0.1)', color: 'var(--primary)', borderRadius: '2rem', fontWeight: 700 }}>
                            {product.category}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{product.price}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="flex" style={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleEdit(product)} className="action-btn edit" title="Düzenle">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="action-btn delete" title="Sil / Satıldı">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                          <Package size={48} color="var(--border-color)" style={{ margin: '0 auto 1rem auto' }} />
                          <p>Veritabanında ilan bulunamadı.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
