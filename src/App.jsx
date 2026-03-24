import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// ─── DONNÉES COMPLÈTES (BASÉES SUR TES CAPTURES) ──────────────────────────
const OFFRES = [
  {
    id: 'hellobank',
    nom: 'Hello Bank',
    categorie: 'BANQUE',
    emoji: '🏦',
    couleur: '#00A8E8',
    description: 'Ouvre un compte Hello One et recois 40€ sans depot, puis 40€ de plus des le 10e achat carte.',
    tuGagnes: '80€',
    filleulRecoit: '40€ + 40€',
    delai: '72 heures',
    conditions: [
      '1ere ouverture d un compte de depot Hello One',
      '40€ offerts sans depot minimum',
      '40€ supplementaires au 10e achat carte bancaire'
    ],
    type: 'instagram',
    contact: '@parrain_4p',
    instruction: 'Pour recevoir ton invitation, envoie ton prenom + adresse email sur Instagram'
  },
  {
    id: 'joko',
    nom: 'Joko',
    categorie: 'CASHBACK',
    emoji: '💸',
    couleur: '#FF6B35',
    description: 'Joko transforme tes achats quotidiens en micro-economies automatiques en connectant ton compte bancaire.',
    tuGagnes: '3€ + 10% du cashback filleul',
    filleulRecoit: '1€ a l inscription',
    delai: 'instantané',
    conditions: [
      'Telecharger l app Joko',
      'Connecter son compte bancaire',
      '1€ offert a l inscription avec le code'
    ],
    type: 'code',
    code: 'skevdw'
  }
];

// ─── LOGIQUE CALCULATEUR ──────────────────────────────────────────────────
const STRIPE_LINK = 'https://buy.stripe.com/14A8wPadZ2MmbRF0A4a3u00';
const fmt = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0);

function calcul(f) {
  const prixVente = parseFloat(f.prixVente) || 0;
  const matieres = parseFloat(f.matieres) || 0;
  const transport = parseFloat(f.transport) || 0;
  const autres = parseFloat(f.autresFrais) || 0;
  const taux = parseFloat(f.tauxCotisations) || 0;
  const cotisations = (prixVente * taux) / 100;
  const beneficeNet = prixVente - (matieres + transport + autres + cotisations);
  const marge = prixVente > 0 ? (beneficeNet / prixVente) * 100 : 0;
  return { beneficeNet, marge, prixVente };
}

// ─── COMPOSANTS UI ────────────────────────────────────────────────────────

// La fameuse page qui s'ouvre (Modale)
function OffreDetails({ offre, onClose }) {
  if (!offre) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0A0B0F', zIndex: 2000, overflowY: 'auto', padding: '20px' }}>
      {/* Header Modale */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <button onClick={onClose} style={{ background: '#1E2230', border: 'none', color: '#FFF', width: 40, height: 40, borderRadius: '50%', fontSize: 20 }}>✕</button>
        <span style={{ fontWeight: 800, fontSize: 18 }}>AppHub</span>
        <div style={{ width: 40 }}></div>
      </div>

      <div style={{ background: '#111318', borderRadius: 24, padding: '24px', border: '1px solid #1A1E2A' }}>
        {/* Titre & Icone */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: '#0A0B0F', border: `2px solid ${offre.couleur}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
            {offre.emoji}
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#4A5568', fontWeight: 700 }}>{offre.categorie}</div>
            <div style={{ fontSize: 24, fontWeight: 900 }}>{offre.nom}</div>
          </div>
        </div>

        <p style={{ color: '#8A95AA', lineHeight: 1.5, marginBottom: 25 }}>{offre.description}</p>

        {/* Grille Bonus */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 30 }}>
          <div style={{ background: '#0A0B0F', padding: '15px', borderRadius: 16, textAlign: 'center', border: '1px solid #1A1E2A' }}>
            <div style={{ fontSize: 10, color: '#4A5568', marginBottom: 8 }}>TU GAGNES</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#4FFFA0' }}>{offre.tuGagnes}</div>
          </div>
          <div style={{ background: '#0A0B0F', padding: '15px', borderRadius: 16, textAlign: 'center', border: '1px solid #1A1E2A' }}>
            <div style={{ fontSize: 10, color: '#4A5568', marginBottom: 8 }}>FILLEUL RECOIT</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#FFF' }}>{offre.filleulRecoit}</div>
          </div>
        </div>

        {/* Conditions */}
        <div style={{ marginBottom: 30 }}>
          <h4 style={{ color: '#4FFFA0', fontSize: 14, fontWeight: 800, marginBottom: 15 }}>CONDITIONS</h4>
          {offre.conditions.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 14, color: '#8A95AA' }}>
              <span style={{ color: '#4FFFA0' }}>✓</span> {c}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 10, fontSize: 14, color: '#8A95AA' }}>
            <span style={{ color: '#4FFFA0' }}>✓</span> Delai : {offre.delai}
          </div>
        </div>

        {/* Action */}
        <div style={{ background: '#0A0B0F', borderRadius: 20, padding: '20px', border: '1px dashed #4FFFA0', textAlign: 'center' }}>
          {offre.type === 'instagram' ? (
            <>
              <p style={{ fontSize: 12, color: '#8A95AA', marginBottom: 15 }}>{offre.instruction}</p>
              <button 
                onClick={() => window.open('https://instagram.com/parrain_4p')}
                style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none', fontWeight: 800, color: '#FFF', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
              >
                Me contacter sur Instagram {offre.contact}
              </button>
            </>
          ) : (
            <>
              <p style={{ fontSize: 12, color: '#8A95AA', marginBottom: 5 }}>CODE PARRAINAGE</p>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#4FFFA0', letterSpacing: 2, marginBottom: 15 }}>{offre.code}</div>
              <button style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none', fontWeight: 800, background: '#4FFFA0', color: '#0A0B0F' }}>Copier le code</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────
export default function App() {
  const [onglet, setOnglet] = useState('parrainage');
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [fields, setFields] = useState({ prixVente: '', matieres: '', transport: '', autresFrais: '', tauxCotisations: '21.2' });

  const res = calcul(fields);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0B0F', color: '#E8EDF5', fontFamily: 'sans-serif' }}>
      
      {/* Liste des Offres */}
      {onglet === 'parrainage' && (
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px' }}>
          <h1 style={{ textAlign: 'center', color: '#4FFFA0', fontWeight: 900, marginBottom: 30 }}>Parrain 4P</h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {OFFRES.map(o => (
              <div key={o.id} onClick={() => setSelectedOffre(o)} style={{ background: '#111318', padding: '20px', borderRadius: 20, border: '1px solid #1A1E2A' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{o.emoji}</div>
                <div style={{ fontWeight: 800 }}>{o.nom}</div>
                <div style={{ color: o.couleur, fontSize: 14, fontWeight: 700 }}>{o.tuGagnes}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vue Calculateur (Simplifiée ici) */}
      {onglet === 'calculateur' && (
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px' }}>
           <h2 style={{ color: '#4FFFA0', textAlign: 'center' }}>ProfitMaster</h2>
           <input type="number" placeholder="Prix de vente" onChange={e => setFields({...fields, prixVente: e.target.value})} style={{ width: '100%', padding: '15px', margin: '10px 0', background: '#111318', border: '1px solid #1A1E2A', color: '#FFF', borderRadius: 10 }} />
           {res.prixVente > 0 && <div style={{ background: '#4FFFA0', color: '#000', padding: '20px', borderRadius: 15, textAlign: 'center', fontWeight: 900, marginTop: 20 }}>Bénéfice : {fmt(res.beneficeNet)}</div>}
        </div>
      )}

      {/* Fenêtre de détails (Modale) */}
      {selectedOffre && <OffreDetails offre={selectedOffre} onClose={() => setSelectedOffre(null)} />}

      {/* Barre de Navigation */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111318', display: 'flex', padding: '15px', borderTop: '1px solid #1A1E2A', justifyContent: 'space-around' }}>
        <button onClick={() => setOnglet('parrainage')} style={{ background: 'none', border: 'none', color: onglet === 'parrainage' ? '#4FFFA0' : '#4A5568', fontWeight: 800 }}>🎁 PARRAINAGES</button>
        <button onClick={() => setOnglet('calculateur')} style={{ background: 'none', border: 'none', color: onglet === 'calculateur' ? '#4FFFA0' : '#4A5568', fontWeight: 800 }}>📊 CALCULATEUR</button>
      </nav>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
