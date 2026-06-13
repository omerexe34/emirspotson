import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="flex" style={{ flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff', borderRadius: '10px' } }} />
    </HelmetProvider>
  );
}

export default App;
