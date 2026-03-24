import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// ─── COMPOSANT PAGE AVIS ───────────────────────────────────────────────────
function PageAvis() {
  const avis = [
    { nom: "Lucas", date: "Il y a 2 jours", texte: "Super rapide pour Hello Bank, j'ai reçu mes 80€ comme prévu ! 🔥", note: "⭐⭐⭐⭐⭐" },
    { nom: "Sarah", date: "La semaine dernière", texte: "Le calculateur de rentabilité m'aide trop pour mes projets.", note: "⭐⭐⭐⭐⭐" },
    { nom: "Marc", date: "Il y a 1 mois", texte: "Code Joko fonctionnel à 100%. Merci pour le partage.", note: "⭐⭐⭐⭐" },
  ];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px', paddingBottom: 120 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#4FFFA0', marginBottom: 20, textAlign: 'center', letterSpacing: '1px' }}>AVIS UTILISATEURS</h2>
      {avis.map((a, i) => (
        <div key={i} style={{ background: '#111318', border: '1px solid #1A1E2A', borderRadius: 16, padding: '16px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 800, color: '#E8EDF5' }}>{a.nom}</span>
            <span style={{ fontSize: 12, color: '#4A5568' }}>{a.date}</span>
          </div>
          <div style={{ color: '#FFD700', fontSize: 12, marginBottom: 8 }}>{a.note}</div>
          <p style={{ fontSize: 14, color: '#8A95AA', lineHeight: 1.5 }}>"{a.texte}"</p>
        </div>
      ))}
      <div style={{ textAlign: 'center', marginTop: 30, padding: '20px', background: 'rgba(79,255,160,0.05)', borderRadius: 12, border: '1px dashed #4FFFA0' }}>
        <p style={{ fontSize: 13, color: '#E8EDF5' }}>Tu as utilisé un code ?</p>
        <p style={{ color: '#4FFFA0', fontWeight: 800, marginTop: 5 }}>Contacte-moi pour laisser ton avis !</p>
      </div>
    </div>
  );
}

// ─── COMPOSANT PAGE PARRAINAGE ──────────────────────────────────────────────
const OFFRES = [
  { id: 1, nom: 'Hello Bank', prime: '80€', categorie: 'Banque', emoji: '🏦', couleur: '#00A8E8' },
  { id: 2, nom: 'Joko', prime: '1€ + cashback', categorie: 'Cashback', emoji: '💸', couleur: '#FF6B35' },
  { id: 3, nom: 'Coinbase', prime: '20€', categorie: 'Crypto', emoji: '₿', couleur: '#0052FF' },
  { id: 4, nom: 'VeraCash', prime: '10€ parrain', categorie: 'Or & Epargne', emoji: '🥇', couleur: '#FFD700' },
  { id: 5, nom: 'Robinhood', prime: '10€', categorie: 'Crypto Exchange', emoji: '🏹', couleur: '#00C805' },
  { id: 6, nom: 'Winamax', prime: '40€', categorie: 'Paris Sportifs', emoji: '⚽', couleur: '#E21421' }
];

function PageParrainage() {
  const [filtre, setFiltre] = useState('Tout');
  const categories = ['Tout', ...new Set(OFFRES.map(o => o.categorie))];
  const filtered = filtre === 'Tout' ? OFFRES : OFFRES.filter(o => o.categorie === filtre);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px', paddingBottom: 120 }}>
      <header style={{ textAlign: 'center', marginBottom: 30, paddingTop: 20 }}>
        <p style={{ color: '#4FFFA0', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Hub Financier</p>
        <h1 style={{ color: '#E8EDF5', fontSize: 28, fontWeight: 900, margin: '5px 0' }}>Parrain 4P</h1>
        <p style={{ color: '#8A95AA', fontSize: 13 }}>Parrainages + Calculateur de Rentabilité</p>
      </header>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 24, paddingBottom: 8 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFiltre(cat)} style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: filtre === cat ? '#4FFFA0' : '#111318', color: filtre === cat ? '#0A0C10' : '#8A95AA', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>{cat}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtered.map(offre => (
          <div key={offre.id} style={{ background: '#111318', border: '1px solid #1A1E2A', borderRadius: 20, padding: '16px', position: 'relative' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12, border: `1px solid ${offre.couleur}` }}>{offre.emoji}</div>
            <p style={{ color: '#4A5568', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>{offre.categorie}</p>
            <h3 style={{ color: '#E8EDF5', fontSize: 15, fontWeight: 800, margin: '4px 0' }}>{offre.nom}</h3>
            <p style={{ color: offre.couleur, fontSize: 14, fontWeight: 700 }}>{offre.prime}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMPOSANT CALCULATEUR ──────────────────────────────────────────────────
function PageProfitMaster() {
  const [montant, setMontant] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const profit = prixVente && montant ? (prixVente - montant).toFixed(2) : 0;
  const roi = montant > 0 ? ((profit / montant) * 100).toFixed(1) : 0;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px', paddingBottom: 120 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#4FFFA0', marginBottom: 24, textAlign: 'center', paddingTop: 20 }}>CALCULATEUR PRO</h2>
      <div style={{ background: '#111318', borderRadius: 24, padding: '24px', border: '1px solid #1A1E2A' }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: '#8A95AA', fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Achat (€)</label>
          <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} style={{ width: '100%', background: '#0A0C10', border: '1px solid #1A1E2A', borderRadius: 12, padding: '12px', color: '#E8EDF5', outline: 'none' }} placeholder="0.00" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: '#8A95AA', fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Vente (€)</label>
          <input type="number" value={prixVente} onChange={(e) => setPrixVente(e.target.value)} style={{ width: '100%', background: '#0A0C10', border: '1px solid #1A1E2A', borderRadius: 12, padding: '12px', color: '#E8EDF5', outline: 'none' }} placeholder="0.00" />
        </div>
        <div style={{ display: 'flex', gap: 15, marginTop: 30, padding: '20px', background: '#0A0C10', borderRadius: 16, border: '1px solid #1A1E2A' }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#8A95AA', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Net</p>
            <p style={{ color: profit >= 0 ? '#4FFFA0' : '#FF4F4F', fontSize: 24, fontWeight: 900 }}>{profit}€</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#8A95AA', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Rendement</p>
            <p style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 900 }}>{roi}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APPLICATION PRINCIPALE ────────────────────────────────────────────────
function App() {
  const [onglet, setOnglet] = useState('parrainage');

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw',
      background: '#0A0C10', 
      color: '#E8EDF5', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: 0,
      overflowX: 'hidden'
    }}>
      
      {/* AFFICHAGE DE LA PAGE SELON L'ONGLET */}
      {onglet === 'parrainage' ? <PageParrainage /> : 
       onglet === 'calculateur' ? <PageProfitMaster /> : 
       <PageAvis />}

      {/* BARRE DE NAVIGATION FIXE ADAPTÉE IPHONE */}
      <div style={{ 
        position: 'fixed', 
        bottom: 'max(20px, env(safe-area-inset-bottom))', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '90%', 
        maxWidth: 400, 
        background: 'rgba(17, 19, 24, 0.95)', 
        backdropFilter: 'blur(15px)', 
        WebkitBackdropFilter: 'blur(15px)',
        borderRadius: 24, 
        display: 'flex', 
        padding: '8px', 
        border: '1px solid rgba(255,255,255,0.1)', 
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)', 
        zIndex: 1000 
      }}>
        
        <button onClick={() => setOnglet('parrainage')} style={{ flex: 1, background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 20 }}>🎁</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: onglet === 'parrainage' ? '#4FFFA0' : '#4A5568', textTransform: 'uppercase' }}>Offres</span>
        </button>

        <button onClick={() => setOnglet('avis')} style={{ flex: 1, background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 20 }}>⭐</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: onglet === 'avis' ? '#4FFFA0' : '#4A5568', textTransform: 'uppercase' }}>Avis</span>
        </button>

        <button onClick={() => setOnglet('calculateur')} style={{ flex: 1, background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 20 }}>📊</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: onglet === 'calculateur' ? '#4FFFA0' : '#4A5568', textTransform: 'uppercase' }}>Calcul</span>
        </button>
      </div>
    </div>
  );
}

// RENDU FINAL
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
