import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// ─── DONNÉES PARRAINAGE ────────────────────────────────────────────────────────
const OFFRES = [
  {
    id: 'hellobank',
    nom: 'Hello Bank',
    categorie: 'Banque',
    emoji: '🏦',
    couleur: '#00B4FF',
    bonus: '80€',
    bonusFilleul: '40€ + 40€',
    bonusParrain: '80€',
    description: 'Ouvre un compte Hello One et recois 40€ sans depot, puis 40€ de plus des le 10e achat carte.',
    conditions: [
      '1ere ouverture d un compte de depot Hello One',
      '40€ offerts sans depot minimum',
      '40€ supplementaires au 10e achat carte bancaire',
      'Delai : 72 heures',
    ],
    type: 'contact',
    contact: '@parrain_4p',
    note: 'Pour recevoir ton invitation, envoie ton prenom + adresse email sur Instagram',
  },
  {
    id: 'joko',
    nom: 'Joko',
    categorie: 'Cashback',
    emoji: '💸',
    couleur: '#FF6B35',
    bonus: '1€ + cashback',
    bonusFilleul: '1€ a l inscription',
    bonusParrain: '3€ + 10% du cashback filleul',
    description: 'Joko transforme tes achats quotidiens en micro-economies automatiques.',
    conditions: ['Telecharger l app Joko', 'Connecter son compte bancaire', '1€ offert avec le code'],
    type: 'code',
    code: 'skevdw',
  },
  {
    id: 'coinbase',
    nom: 'Coinbase',
    categorie: 'Crypto',
    emoji: '₿',
    couleur: '#0052FF',
    bonus: '20€',
    bonusFilleul: '20€ en Bitcoin',
    bonusParrain: '20€',
    description: 'Plateforme de reference pour acheter et stocker des cryptomonnaies.',
    conditions: ['S inscrire via le lien', 'Valider le KYC', 'Deposer 20€', 'Acheter 20€ de BTC'],
    type: 'lien',
    lien: 'https://coinbase.com/join/954EBFS?src=ios-link',
  },
  {
    id: 'veracash',
    nom: 'VeraCash',
    categorie: 'Or & Epargne',
    emoji: '🥇',
    couleur: '#FFD700',
    bonus: '10€ parrain',
    bonusFilleul: 'Frais reduits',
    bonusParrain: '10€',
    description: 'Epargne et paye avec de l or et de l argent physique.',
    conditions: ['S inscrire via le lien', 'Verifier son identite', 'Deposer 10€'],
    type: 'lien',
    lien: 'https://www.veracash.com/fr/inscription?sponsorMemberPseudo=DEVOMIZO',
  },
  {
    id: 'robinhood',
    nom: 'Robinhood',
    categorie: 'Crypto Exchange',
    emoji: '🏹',
    couleur: '#00C805',
    bonus: '10€',
    bonusFilleul: '10€',
    bonusParrain: '10€',
    description: 'Exchange crypto simple sans frais caches.',
    conditions: ['S inscrire via le lien', 'Valider identite', 'Deposer 10€'],
    type: 'lien',
    lien: 'https://join.robinhood.com/eu_crypto/leot-ad308a260/',
  },
  {
    id: 'winamax',
    nom: 'Winamax',
    categorie: 'Paris Sportifs',
    emoji: '⚽',
    couleur: '#E8002D',
    bonus: '40€',
    bonusFilleul: '40€',
    bonusParrain: '40€',
    description: 'La reference des paris sportifs en France.',
    conditions: ['S inscrire avec le code', 'Deposer 10€'],
    type: 'code',
    code: 'LTZXVU',
  },
  {
    id: 'betsson',
    nom: 'Betsson',
    categorie: 'Paris Sportifs',
    emoji: '🎯',
    couleur: '#FF4500',
    bonus: '10€ Betboost',
    bonusFilleul: '10€ Betboost',
    bonusParrain: '10€ Betboost',
    description: 'Plateforme de paris sportifs internationale.',
    conditions: ['S inscrire via le lien', 'Verifier compte', 'Deposer 10€'],
    type: 'lien',
    lien: '#',
  },
];

const CATEGORIES = ['Tout', 'Banque', 'Cashback', 'Crypto', 'Or & Epargne', 'Crypto Exchange', 'Paris Sportifs'];

const AVIS = [
  { nom: "Lucas", date: "Il y a 2 jours", texte: "Super rapide pour Hello Bank, j'ai reçu mes 80€ comme prévu ! 🔥", note: "⭐⭐⭐⭐⭐" },
  { nom: "Sarah", date: "La semaine dernière", texte: "Le calculateur ProfitMaster est bluffant de précision.", note: "⭐⭐⭐⭐⭐" },
  { nom: "Julien", date: "Hier", texte: "J'ai testé Coinbase, bonus reçu en 24h. Nickel.", note: "⭐⭐⭐⭐⭐" }
];

// ─── PROFITMASTER LOGIC ────────────────────────────────────────────────────────
const STRIPE_LINK = 'https://buy.stripe.com/14A8wPadZ2MmbRF0A4a3u00';
const fmt = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0);

function calcul(f) {
  const prixVente = parseFloat(f.prixVente) || 0;
  const matieres = parseFloat(f.matieres) || 0;
  const transport = parseFloat(f.transport) || 0;
  const outillage = parseFloat(f.outillage) || 0;
  const autresFrais = parseFloat(f.autresFrais) || 0;
  const heures = parseFloat(f.heures) || 0;
  const tauxHoraire = parseFloat(f.tauxHoraire) || 0;
  const taux = parseFloat(f.tauxCotisations) || 0;
  const coutMain = heures * tauxHoraire;
  const cotisations = (prixVente * taux) / 100;
  const totalCharges = matieres + transport + outillage + autresFrais + coutMain + cotisations;
  const beneficeNet = prixVente - totalCharges;
  const marge = prixVente > 0 ? (beneficeNet / prixVente) * 100 : 0;
  let sante = 'Deficitaire';
  if (marge >= 20) sante = 'Rentable';
  else if (marge >= 0) sante = 'Risque';
  return { prixVente, coutMain, cotisations, totalCharges, beneficeNet, marge, sante };
}

// ─── COMPOSANTS UI ────────────────────────────────────────────────────────────
function Section({ title, icon, children }) {
  return (
    <div style={{ background: '#111318', borderRadius: 14, padding: '18px 16px', marginBottom: 12, border: '1px solid #1A1E2A' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h3 style={{ fontSize: 13, fontWeight: 800, color: '#4FFFA0', letterSpacing: '0.06em' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── PAGE PARRAINAGE ──────────────────────────────────────────────────────────
function PageParrainage() {
  const [filtre, setFiltre] = useState('Tout');
  const [selected, setSelected] = useState(null);
  const filtrees = filtre === 'Tout' ? OFFRES : OFFRES.filter(o => o.categorie === filtre);

  if (selected) {
    const o = selected;
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#4FFFA0', marginBottom: 16, cursor: 'pointer' }}>← Retour</button>
        <div style={{ background: '#111318', borderRadius: 20, padding: '24px 20px', border: '1px solid #1A1E2A' }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
             <div style={{ width: 56, height: 56, borderRadius: 16, background: o.couleur + '22', border: '2px solid ' + o.couleur, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{o.emoji}</div>
             <h2 style={{ fontSize: 22, fontWeight: 900, color: '#E8EDF5' }}>{o.nom}</h2>
          </div>
          <p style={{ color: '#8A95AA', marginBottom: 20 }}>{o.description}</p>
          <div style={{ background: '#0A0B0F', padding: '15px', borderRadius: 12, border: '1px dashed #4FFFA0', textAlign: 'center' }}>
            {o.type === 'contact' ? (
              <button onClick={() => window.open('https://instagram.com/' + o.contact.replace('@',''), '_blank')} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #833AB4, #FD1D1D)', border: 'none', color: '#FFF', borderRadius: 12, fontWeight: 800 }}>Contact Instagram {o.contact}</button>
            ) : o.type === 'code' ? (
              <div style={{ fontSize: 24, fontWeight: 900, color: '#4FFFA0' }}>{o.code}</div>
            ) : (
              <button onClick={() => window.open(o.lien, '_blank')} style={{ width: '100%', padding: '15px', background: '#4FFFA0', borderRadius: 12, fontWeight: 800, border: 'none' }}>S'inscrire</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFiltre(cat)} style={{ background: filtre === cat ? '#4FFFA0' : '#111318', border: 'none', padding: '8px 15px', borderRadius: 20, color: filtre === cat ? '#000' : '#8A95AA', whiteSpace: 'nowrap' }}>{cat}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtrees.map(o => (
          <div key={o.id} onClick={() => setSelected(o)} style={{ background: '#111318', padding: '16px', borderRadius: 16, border: '1px solid #1A1E2A', cursor: 'pointer' }}>
            <div style={{ fontSize: 24 }}>{o.emoji}</div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>{o.nom}</div>
            <div style={{ color: o.couleur, fontSize: 13, fontWeight: 900 }}>{o.bonus}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [onglet, setOnglet] = useState('parrainage');
  return (
    <div style={{ minHeight: '100vh', background: '#0A0B0F', color: '#E8EDF5', paddingBottom: 80 }}>
      <div style={{ padding: '20px', textAlign: 'center', background: '#111318' }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#4FFFA0' }}>Parrain 4P</h1>
      </div>

      {onglet === 'parrainage' && <PageParrainage />}
      
      {onglet === 'avis' && (
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
          {AVIS.map((a, i) => (
            <div key={i} style={{ background: '#111318', border: '1px solid #1A1E2A', borderRadius: 16, padding: '16px', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 800 }}>{a.nom}</span>
                <span style={{ fontSize: 12, color: '#4A5568' }}>{a.date}</span>
              </div>
              <div style={{ color: '#FFD700', fontSize: 12 }}>{a.note}</div>
              <p style={{ fontSize: 14, color: '#8A95AA', marginTop: 8 }}>"{a.texte}"</p>
            </div>
          ))}
        </div>
      )}

      {onglet === 'calculateur' && <div style={{ textAlign: 'center', padding: '50px' }}>Chargement du calculateur...</div>}

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111318', display: 'flex', borderTop: '1px solid #1A1E2A', zIndex: 100 }}>
        <button onClick={() => setOnglet('parrainage')} style={{ flex: 1, padding: '15px', background: 'none', border: 'none', color: onglet === 'parrainage' ? '#4FFFA0' : '#4A5568', fontWeight: 800 }}>OFFRES</button>
        <button onClick={() => setOnglet('avis')} style={{ flex: 1, padding: '15px', background: 'none', border: 'none', color: onglet === 'avis' ? '#4FFFA0' : '#4A5568', fontWeight: 800 }}>AVIS</button>
        <button onClick={() => setOnglet('calculateur')} style={{ flex: 1, padding: '15px', background: 'none', border: 'none', color: onglet === 'calculateur' ? '#4FFFA0' : '#4A5568', fontWeight: 800 }}>CALCUL</button>
      </nav>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
