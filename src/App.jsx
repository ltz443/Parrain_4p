import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import PageParrainage from './PageParrainage';

// ─── LOGIQUE DES FAVORIS ───────────────────────────────────────────
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

// ─── CONFIGURATION CALCULATEUR ───────────────────────────────────────
const STRIPE_LINK = 'https://buy.stripe.com/14A8wPadZ2MmbRF0A4a3u00';
const TAUX_OPTIONS = [
  { label: "Auto-entrepreneur - Prestation (21.2%)", value: 21.2 },
  { label: "Auto-entrepreneur - Vente (12.8%)", value: 12.8 },
  { label: "EIRL / EI au réel (est. 45%)", value: 45 },
  { label: "Personnalisé", value: null },
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
  let sante = "Déficitaire";
  if (marge >= 20) sante = "Rentable";
  else if (marge >= 0) sante = "Risqué";
  return { prixVente, matieres, transport, outillage, autresFrais, coutMain, cotisations, totalCharges, beneficeNet, marge, sante };
}

function InputField({ label, value, onChange, placeholder, prefix, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8A95AA', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4FFFA0', fontSize: 13, fontWeight: 700 }}>{prefix || '€'}</span>
        <input
          type="number" min="0" step="0.01" value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || '0'}
          inputMode="decimal"
          style={{ width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 8, color: '#E8EDF5', fontSize: 15, padding: '10px 12px 10px 30px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
        />
      </div>
      {hint && <p style={{ fontSize: 10, color: '#4A5568', marginTop: 3 }}>{hint}</p>}
    </div>
  );
}

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

// ─── PAGE AVIS ────────────────────────────────────────────────────────────────
function PageAvis() {
  const avis = [
    { nom: "Lucas", date: "Il y a 2 jours", texte: "Super rapide pour Hello Bank, j'ai reçu mes 80€ comme prévu ! 🔥", note: "⭐⭐⭐⭐⭐" },
    { nom: "Sarah", date: "La semaine dernière", texte: "Le calculateur ProfitMaster est bluffant de précision.", note: "⭐⭐⭐⭐⭐" },
    { nom: "Tom", date: "Il y a 1 mois", texte: "Déjà 120€ de gains cumulés grâce aux offres crypto. Top !", note: "⭐⭐⭐⭐⭐" }
  ];
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4FFFA0', marginBottom: 20, textAlign: 'center' }}>Avis de la Communauté</h2>
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
    </div>
  );
}

// ─── PAGE CALCULATEUR ─────────────────────────────────────────────────────────
function PageProfitMaster() {
  const [fields, setFields] = useState({
    prixVente: '', matieres: '', transport: '', outillage: '', autresFrais: '',
    heures: '', tauxHoraire: '', tauxCotisations: '21.2', tauxPersonnalise: '', tauxOption: '21.2',
  });
  const [showPaywall, setShowPaywall] = useState(false);
  const [pdfPaid, setPdfPaid] = useState(false);
  const setField = (key) => (val) => setFields((prev) => ({ ...prev, [key]: val }));
  const res = calcul(fields);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') === 'true') setPdfPaid(true);
  }, []);

  const handlePDFClick = useCallback(() => {
    if (pdfPaid) alert("Fonctionnalité PDF bientôt disponible");
    else setShowPaywall(true);
  }, [pdfPaid]);

  const handlePay = () => {
    window.open(STRIPE_LINK, '_blank');
    setShowPaywall(false);
  };

  const tauxActuel = fields.tauxOption === 'custom' ? (parseFloat(fields.tauxPersonnalise) || 0) : parseFloat(fields.tauxOption);
  useEffect(() => {
    setFields((prev) => ({ ...prev, tauxCotisations: String(tauxActuel) }));
  }, [tauxActuel]);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
      <Section title="REVENUS" icon="💰">
        <InputField label="Prix de vente estimé" value={fields.prixVente} onChange={setField('prixVente')} hint="Le montant facturé au client" />
      </Section>
      <Section title="COÛTS DIRECTS" icon="📦">
        <InputField label="Matières premières" value={fields.matieres} onChange={setField('matieres')} />
        <InputField label="Transport / Essence" value={fields.transport} onChange={setField('transport')} />
        <InputField label="Outillage" value={fields.outillage} onChange={setField('outillage')} />
        <InputField label="Autres frais" value={fields.autresFrais} onChange={setField('autresFrais')} />
      </Section>
      <Section title="TEMPS PASSÉ" icon="🕐">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <InputField label="Heures" prefix="h" value={fields.heures} onChange={setField('heures')} />
          <InputField label="Taux/heure" value={fields.tauxHoraire} onChange={setField('tauxHoraire')} />
        </div>
      </Section>
      <Section title="FISCALITÉ" icon="🏛️">
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <select value={fields.tauxOption} onChange={(e) => setFields((prev) => ({ ...prev, tauxOption: e.target.value }))}
            style={{ width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 8, color: '#E8EDF5', fontSize: 13, padding: '10px 12px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            {TAUX_OPTIONS.map((o) => (
              <option key={o.label} value={o.value === null ? 'custom' : String(o.value)}>{o.label}</option>
            ))}
          </select>
        </div>
        {fields.tauxOption === 'custom' && <InputField label="Taux (%)" prefix="%" value={fields.tauxPersonnalise} onChange={setField('tauxPersonnalise')} />}
      </Section>
      {res.prixVente > 0 && (
        <div style={{ marginTop: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div style={{ background: 'rgba(79,255,160,0.07)', border: '1.5px solid #4FFFA0', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#8A95AA', textTransform: 'uppercase', marginBottom: 3 }}>Bénéfice Net</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#4FFFA0', fontFamily: 'monospace' }}>{fmt(res.beneficeNet)}</div>
              </div>
              <div style={{ background: '#111318', border: '1.5px solid #1E2230', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#8A95AA', textTransform: 'uppercase', marginBottom: 3 }}>Marge Nette</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#E8EDF5', fontFamily: 'monospace' }}>{pct(res.marge)}</div>
              </div>
          </div>
          <button onClick={handlePDFClick} style={{ width: '100%', background: pdfPaid ? 'linear-gradient(135deg, #4FFFA0, #2ECC71)' : '#111318', border: '2px solid #4FFFA0', borderRadius: 12, color: pdfPaid ? '#0A0B0F' : '#4FFFA0', fontSize: 14, fontWeight: 800, padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
            {pdfPaid ? "Télécharger mon Bilan PDF" : "Télécharger le Bilan PDF - 2,00 €"}
          </button>
        </div>
      )}
      {showPaywall && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(5,6,10,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#111318', border: '1.5px solid #4FFFA0', borderRadius: 20, maxWidth: 400, width: '100%', padding: '32px 28px', position: 'relative' }}>
            <button onClick={() => setShowPaywall(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#4A5568', fontSize: 22, cursor: 'pointer' }}>X</button>
            <h2 style={{ color: '#E8EDF5', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Sécurisez votre projet</h2>
            <button onClick={handlePay} style={{ width: '100%', background: 'linear-gradient(135deg, #4FFFA0, #2ECC71)', border: 'none', borderRadius: 12, color: '#0A0B0F', fontSize: 16, fontWeight: 800, padding: '15px', cursor: 'pointer', fontFamily: 'inherit' }}>
              Payer et Télécharger
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
export default function App() {
  const [onglet, setOnglet] = useState('parrainage');
  const favState = useFavorites();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #0A0B0F; color: #E8EDF5; font-family: 'Inter', sans-serif; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0B0F', paddingBottom: 80 }}>
      <div style={{ background: '#111318', borderBottom: '1px solid #1A1E2A', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#4FFFA0' }}>Parrain 4P</h1>
        {onglet === 'parrainage' && (
          <button onClick={() => favState.setFavOnly(!favState.favOnly)} style={{ background: favState.favOnly ? '#4FFFA0' : '#0A0B0F', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: favState.favOnly ? '#0A0B0F' : '#FFF' }}>
             ❤️ {favState.count}
          </button>
        )}
      </div>

      {onglet === 'parrainage' && <PageParrainage favState={favState} />}
      {onglet === 'avis' && <PageAvis />}
      {onglet === 'calculateur' && <PageProfitMaster />}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111318', borderTop: '1px solid #1A1E2A', display: 'flex', height: 70, zIndex: 1000 }}>
        <button onClick={() => setOnglet('parrainage')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'parrainage' ? '#4FFFA0' : '#4A5568', cursor: 'pointer' }}>🎁 Offres</button>
        <button onClick={() => setOnglet('avis')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'avis' ? '#4FFFA0' : '#4A5568', cursor: 'pointer' }}>⭐ Avis</button>
        <button onClick={() => setOnglet('calculateur')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'calculateur' ? '#4FFFA0' : '#4A5568', cursor: 'pointer' }}>📊 Calcul</button>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
