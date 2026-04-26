import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import PageParrainage from './PageParrainage';
import PageAvis from './components/PageAvis';
import PageProfitMaster from './components/PageProfitMaster';
import PageLegal from './components/PageLegal';

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
    try { localStorage.setItem(FavStore.KEY, JSON.stringify(ids)); } catch { }
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

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
export default function App() {
  const [onglet, setOnglet] = useState('parrainage');
  const favState = useFavorites();

  useEffect(() => {
    document.body.style.cssText = `margin:0; padding:0; background:#0A0B0F; color:#E8EDF5; font-family:'Inter',sans-serif;`;
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0B0F', paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{ background: '#111318', borderBottom: '1px solid #1A1E2A', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#4FFFA0', fontFamily: 'Inter, sans-serif' }}>Parrain 4P</h1>
        {onglet === 'parrainage' && (
          <button onClick={() => favState.setFavOnly(!favState.favOnly)} style={{ background: favState.favOnly ? '#4FFFA0' : '#0A0B0F', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: favState.favOnly ? '#0A0B0F' : '#FFF', fontFamily: 'Inter, sans-serif' }}>
            ❤️ {favState.count}
          </button>
        )}
      </div>

      {/* BANDEAU DISCLAIMER AFFILIATION */}
      <div style={{ background: '#12100A', borderBottom: '1px solid #2A2010', padding: '8px 16px', textAlign: 'center', fontSize: 11, color: '#7A6A40', fontFamily: 'Inter, sans-serif' }}>
        🔗 Ce site contient des liens de parrainage — je perçois une récompense si tu t'inscris, sans coût supplémentaire pour toi.
      </div>

      {/* PAGES */}
      {onglet === 'parrainage' && <PageParrainage favState={favState} />}
      {onglet === 'avis' && <PageAvis />}
      {onglet === 'calculateur' && <PageProfitMaster />}
      {onglet === 'legal' && <PageLegal />}

      {/* BARRE DE NAVIGATION */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111318', borderTop: '1px solid #1A1E2A', display: 'flex', height: 70, zIndex: 1000 }}>
        <button onClick={() => setOnglet('parrainage')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'parrainage' ? '#4FFFA0' : '#4A5568', cursor: 'pointer', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>🎁<br/>Offres</button>
        <button onClick={() => setOnglet('avis')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'avis' ? '#4FFFA0' : '#4A5568', cursor: 'pointer', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>⭐<br/>Avis</button>
        <button onClick={() => setOnglet('calculateur')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'calculateur' ? '#4FFFA0' : '#4A5568', cursor: 'pointer', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>📊<br/>Calcul</button>
        <button onClick={() => setOnglet('legal')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'legal' ? '#4FFFA0' : '#4A5568', cursor: 'pointer', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>⚖️<br/>Légal</button>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
