import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

const STRIPE_LINK = 'https://buy.stripe.com/14A8wPadZ2MmbRF0A4a3u00';
const BREVO_LINK = 'https://45517a4f.sibforms.com/serve/MUIFAIWHHPs2aA0dLWK0WLFoI9DzFyIYzfEutzRc6vmIGTHfhOmt_x2Up2V8d9HyWuk-c23F4oV1QssydJGpDoeTETbj-o9H--j8ERFglfooimRO7aA5l0YoEUxVvPe8D1cVDy80rx_A6V6ZbAuwFxHRdais63yxsDteR96OWNuv0k_KBnN4Lv4JPkwhJ7i0v04FmB9iveYp_uUoAg==';

const TAUX_OPTIONS = [
  { label: 'Auto-entrepreneur - Prestation de services (21.2%)', value: 21.2 },
  { label: 'Auto-entrepreneur - Vente de marchandises (12.8%)', value: 12.8 },
  { label: 'Auto-entrepreneur - Liberal CIPAV (21.2%)', value: 21.2 },
  { label: 'EIRL / EI au reel (estimation 45%)', value: 45 },
  { label: 'Personnalise', value: null },
];

const fmt = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0);
const pct = (n) => `${(n || 0).toFixed(1)}%`;

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
  return { prixVente, matieres, transport, outillage, autresFrais, coutMain, cotisations, totalCharges, beneficeNet, marge, sante };
}

// --- COMPOSANTS UI CALCULATEUR (TON DESIGN) ---
function InputField({ label, value, onChange, prefix, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8A95AA', marginBottom: 6, textTransform: 'uppercase' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4FFFA0', fontSize: 14, fontWeight: 700 }}>{prefix || '€'}</span>
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} inputMode="decimal"
          style={{ width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 10, color: '#E8EDF5', fontSize: 16, padding: '12px 14px 12px 34px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
      </div>
      {hint && <p style={{ fontSize: 11, color: '#4A5568', marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

function SanteIndicateur({ sante }) {
  const configs = {
    Rentable: { bg: 'rgba(79,255,160,0.12)', color: '#4FFFA0', border: '#4FFFA0', emoji: '✅' },
    Risque: { bg: 'rgba(255,190,50,0.12)', color: '#FFBE32', border: '#FFBE32', emoji: '⚠️' },
    Deficitaire: { bg: 'rgba(255,80,80,0.12)', color: '#FF5050', border: '#FF5050', emoji: '🔴' },
  };
  const config = configs[sante] || configs['Deficitaire'];
  return (
    <div style={{ background: config.bg, border: '1.5px solid ' + config.border, borderRadius: 12, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10, marginTop: 15 }}>
      <span style={{ fontSize: 20 }}>{config.emoji}</span>
      <div>
        <div style={{ fontSize: 11, color: '#8A95AA', textTransform: 'uppercase' }}>Sante du projet</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: config.color }}>{sante}</div>
      </div>
    </div>
  );
}

function ResultCard({ label, value, highlight }) {
  return (
    <div style={{ background: highlight ? 'rgba(79,255,160,0.07)' : '#111318', border: '1.5px solid ' + (highlight ? '#4FFFA0' : '#1E2230'), borderRadius: 12, padding: '14px 18px' }}>
      <div style={{ fontSize: 11, color: '#8A95AA', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: highlight ? 24 : 18, fontWeight: 800, color: highlight ? '#4FFFA0' : '#E8EDF5', fontFamily: 'monospace' }}>{value}</div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ background: '#111318', borderRadius: 16, padding: '22px 20px', marginBottom: 16, border: '1px solid #1A1E2A' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#4FFFA0' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

// --- PAGES ---
function PageParrainage() {
  const offres = [
    { id: 1, nom: 'Hello Bank', prime: '80€', categorie: 'Banque', emoji: '🏦', couleur: '#00A8E8' },
    { id: 2, nom: 'Joko', prime: '1€ + cashback', categorie: 'Cashback', emoji: '💸', couleur: '#FF6B35' },
    { id: 3, nom: 'Coinbase', prime: '20€', categorie: 'Crypto', emoji: '₿', couleur: '#0052FF' },
    { id: 4, nom: 'VeraCash', prime: '10€ parrain', categorie: 'Or & Epargne', emoji: '🥇', couleur: '#FFD700' },
  ];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px', paddingBottom: 120 }}>
      <header style={{ textAlign: 'center', marginBottom: 30 }}>
        <h1 style={{ color: '#4FFFA0', fontSize: 28, fontWeight: 900 }}>Parrain 4P</h1>
        <p style={{ color: '#8A95AA', fontSize: 13 }}>Hub Financier & Optimisation</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {offres.map(o => (
          <div key={o.id} style={{ background: '#111318', border: '1px solid #1A1E2A', borderRadius: 20, padding: '16px' }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{o.emoji}</div>
            <h3 style={{ color: '#E8EDF5', fontSize: 15, fontWeight: 800 }}>{o.nom}</h3>
            <p style={{ color: o.couleur, fontSize: 14, fontWeight: 700 }}>{o.prime}</p>
          </div>
        ))}
      </div>

      {/* BLOC NEWSLETTER */}
      <div style={{ marginTop: 40, padding: '24px', background: '#111318', border: '2px dashed #4FFFA0', borderRadius: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>📩</div>
        <h3 style={{ color: '#E8EDF5', fontSize: 18, fontWeight: 900 }}>REJOINS LE CLUB PRO</h3>
        <p style={{ color: '#8A95AA', fontSize: 13, margin: '10px 0 20px' }}>Ne manque plus aucune offre boostée et reçois mes conseils par e-mail.</p>
        <button onClick={() => window.open(BREVO_LINK, '_blank')} style={{ width: '100%', background: '#4FFFA0', color: '#0A0C10', border: 'none', padding: '16px', borderRadius: 14, fontWeight: 800, cursor: 'pointer' }}>S'INSCRIRE GRATUITEMENT</button>
      </div>
    </div>
  );
}

function App() {
  const [onglet, setOnglet] = useState('parrainage');
  const [fields, setFields] = useState({ prixVente: '', matieres: '', transport: '', outillage: '', autresFrais: '', heures: '', tauxHoraire: '', tauxCotisations: '21.2', tauxOption: '21.2' });

  const setField = (key) => (val) => setFields(prev => ({ ...prev, [key]: val }));
  const res = calcul(fields);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0B0F', color: '#E8EDF5', fontFamily: 'sans-serif' }}>
      
      {onglet === 'parrainage' ? <PageParrainage /> : (
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px', paddingBottom: 120 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#4FFFA0', textAlign: 'center', marginBottom: 20 }}>ProfitMaster</h1>
          
          <Section title="REVENUS" icon="💰">
            <InputField label="Prix de vente" value={fields.prixVente} onChange={setField('prixVente')} />
          </Section>

          <Section title="COUTS" icon="📦">
            <InputField label="Matieres" value={fields.matieres} onChange={setField('matieres')} />
            <InputField label="Transport" value={fields.transport} onChange={setField('transport')} />
          </Section>

          {res.prixVente > 0 && (
            <>
              <SanteIndicateur sante={res.sante} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 15 }}>
                <ResultCard label="Net" value={fmt(res.beneficeNet)} highlight />
                <ResultCard label="Marge" value={pct(res.marge)} />
              </div>
            </>
          )}
        </div>
      )}

      {/* NAV BAR */}
      <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: 400, background: 'rgba(17, 19, 24, 0.95)', backdropFilter: 'blur(10px)', borderRadius: 22, display: 'flex', padding: '8px', border: '1px solid #1A1E2A', zIndex: 1000 }}>
        <button onClick={() => setOnglet('parrainage')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'parrainage' ? '#4FFFA0' : '#4A5568', fontWeight: 700, fontSize: 11 }}>OFFRES</button>
        <button onClick={() => setOnglet('calculateur')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'calculateur' ? '#4FFFA0' : '#4A5568', fontWeight: 700, fontSize: 11 }}>CALCUL</button>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
