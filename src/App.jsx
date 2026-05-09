import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

// ─── CHARGEMENT DIFFÉRÉ — Optimisation du bundle ─────────────────────────────
const PageParrainage   = lazy(() => import('./PageParrainage'));
const PageAvis         = lazy(() => import('./components/PageAvis'));
const PageProfitMaster = lazy(() => import('./components/PageProfitMaster'));
const PageFAQ          = lazy(() => import('./components/PageFAQ'));
const PageOffre        = lazy(() => import('./components/PageOffre'));
const PageGuideScrambly = lazy(() => import('./components/PageGuideScrambly'));
const PageGuideOKX = lazy(() => import('./components/PageGuideOKX'));

// ─── TRACKING UMAMI ───────────────────────────────────────────────────────────
export function trackClick(partenaire) {
  if (window.umami) window.umami.track('click_' + partenaire);
}

// ─── LOGIQUE DES FAVORIS ─────────────────────────────────────────────────────
const FavStore = {
  KEY: "p4_favs",
  get: () => {
    try {
      const v = localStorage.getItem(FavStore.KEY);
      return v ? JSON.parse(v) : [];
    } catch { return []; }
  },
  set: (ids) => {
    try { localStorage.setItem(FavStore.KEY, JSON.stringify(ids)); } catch {}
  },
};

function useFavorites() {
  const [favs, setFavs] = useState(() => FavStore.get());
  const [favOnly, setFavOnly] = useState(false);
  const toggle = useCallback((id) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      FavStore.set(next);
      return next;
    });
  }, []);
  const isFav = useCallback((id) => favs.includes(id), [favs]);
  return { favs, isFav, toggle, favOnly, setFavOnly, count: favs.length };
}

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { path: '/',            label: 'Offres', icon: '🎁' },
  { path: '/avis',        label: 'Avis',   icon: '⭐' },
  { path: '/calculateur', label: 'Calcul', icon: '📊' },
  { path: '/faq',         label: 'FAQ',    icon: '❓' },
];

// ─── FALLBACK CHARGEMENT ──────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '60vh',
      color: '#4FFFA0',
      fontSize: 13,
      fontWeight: 700,
      fontFamily: 'Inter, sans-serif',
    }}>
      Chargement...
    </div>
  );
}

// ─── LAYOUT PRINCIPAL ─────────────────────────────────────────────────────────
function AppLayout() {
  const location = useLocation();
  const favState = useFavorites();
  const isHome = location.pathname === '/';

  useEffect(() => {
    document.body.style.cssText = `margin:0; padding:0; background:#0A0B0F; color:#E8EDF5; font-family:'Inter',sans-serif;`;
    
    // Mise à jour dynamique de la balise canonique
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const url = window.location.origin + location.pathname;
    canonical.setAttribute('href', url);
  }, [location]);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0B0F', paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{
        background: '#111318',
        borderBottom: '1px solid #1A1E2A',
        padding: '18px 20px',
        paddingTop: 'max(18px, env(safe-area-inset-top))',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#4FFFA0', fontFamily: 'Inter, sans-serif', margin: 0 }}>
            Parrain 4P
          </h1>
        </Link>
        {isHome && (
          <button
            onClick={() => favState.setFavOnly(!favState.favOnly)}
            style={{
              background: favState.favOnly ? '#4FFFA0' : '#0A0B0F',
              border: 'none',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              color: favState.favOnly ? '#0A0B0F' : '#FFF',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            ❤️ {favState.count}
          </button>
        )}
      </div>

      {/* BANDEAU DISCLAIMER AFFILIATION */}
      <div style={{
        background: '#12100A',
        borderBottom: '1px solid #2A2010',
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: 11,
        color: '#7A6A40',
        fontFamily: 'Inter, sans-serif'
      }}>
        🔗 Ce site contient des liens de parrainage - je perçois une récompense si tu t'inscris, sans coût supplémentaire pour toi.
      </div>

      {/* PAGES - chargement différé avec Suspense */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"            element={<PageParrainage favState={favState} />} />
          <Route path="/avis"        element={<PageAvis />} />
          <Route path="/calculateur" element={<PageProfitMaster />} />
          <Route path="/faq"         element={<PageFAQ />} />
          <Route path="/offres/:id"  element={<PageOffre />} />
          <Route path="/guides/scrambly" element={<PageGuideScrambly />} />
          <Route path="/guides/okx" element={<PageGuideOKX />} />
        </Routes>
      </Suspense>

      {/* BARRE DE NAVIGATION */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#111318',
        borderTop: '1px solid #1A1E2A',
        display: 'flex',
        height: 70,
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 1000
      }}>
        {NAV_ITEMS.map(({ path, label, icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: isActive ? '#4FFFA0' : '#4A5568',
                fontSize: 10,
                fontFamily: 'Inter, sans-serif',
                gap: 3,
                transition: 'color 0.15s',
              }}
            >
              <span style={{ fontSize: 17 }}>{icon}</span>
              <span style={{ fontWeight: isActive ? 700 : 500 }}>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── APP AVEC ROUTER ──────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
