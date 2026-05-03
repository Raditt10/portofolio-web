import { useState, useEffect, lazy, Suspense } from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechStack from './components/TechStack';
import About from './components/About';
import Opening from './components/Opening';
import CustomCursor from './components/CustomCursor';
import NotFound from './components/NotFound';
import LazyMount from './components/LazyMount';
import GitHubContributions from './components/GitHubContributions';
const Gallery = lazy(() => import('./components/Gallery'));
const Educations = lazy(() => import('./components/Educations'));
const Projetcs = lazy(() => import('./components/Projetcs'));
const Achievements = lazy(() => import('./components/Achievements'));
const Footer = lazy(() => import('./components/Footer'));
import { Routes, Route } from 'react-router-dom';

// Removed global GSAP plugin registration to avoid duplicate bytes;
// components register only what they use locally.

function App() {
  const [showOpening, setShowOpening] = useState(true);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return document.documentElement.dataset.theme || 'dark';
  });
  const isLight = theme === 'light';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          const current = document.documentElement.dataset.theme;
          setTheme(current || 'dark');
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <main className='overflow-x-hidden' style={{
      background: isLight
        ? 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #e0e7ff 100%)'
        : 'linear-gradient(135deg, #040507 0%, #0a0d12 50%, #050608 100%)'
    }}>
      <CustomCursor />
      {showOpening && <Opening onComplete={() => setShowOpening(false)} />}
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Hero />
            <About />
            <TechStack />
            <LazyMount height={600}>
              <Suspense fallback={<div style={{height:600}} />}> <Gallery /> </Suspense>
            </LazyMount>
            <LazyMount height={600}>
              <Suspense fallback={<div style={{height:600}} />}> <Educations /> </Suspense>
            </LazyMount>
            <LazyMount height={600}>
              <Suspense fallback={<div style={{height:600}} />}> <Projetcs /> </Suspense>
            </LazyMount>
            <LazyMount height={420}>
              <GitHubContributions />
            </LazyMount>
            <LazyMount height={600}>
              <Suspense fallback={<div style={{height:600}} />}> <Achievements /> </Suspense>
            </LazyMount>
            <LazyMount height={400}>
              <Suspense fallback={<div style={{height:400}} />}> <Footer /> </Suspense>
            </LazyMount>
          </>
        } />
        <Route path="/next-demo" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )
}

export default App
