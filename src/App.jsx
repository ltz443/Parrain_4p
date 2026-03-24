import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// ─── CONFIGURATION & LOGIQUE ──────────────────────────────────────────────
const BREVO_LINK = 'https://45517a4f.sibforms.com/serve/MUIFAIWHHPs2aA0dLWK0WLFoI9DzFyIYzfEutzRc6vmIGTHfhOmt_x2Up2V8d9HyWuk-c23F4oV1QssydJGpDoeTETbj-o9H--j8ERFglfooimRO7aA5l0YoEUxVvPe8D1cVDy80rx_A6V6ZbAuwFxHRdais63yxsDteR96OWNuv0k_KBnN4Lv4JPkwhJ7i0v04FmB9iveYp_uUoAg==';

const TAUX_OPTIONS = [
  { label: 'Auto-entrepreneur - Prestation de services (21.2%)', value: 21.2 },
  { label: 'Auto-entrepreneur - Vente de marchandises (12.8%)', value: 12.8 },
  { label: 'Auto-entrepreneur - Liberal CIPAV (21.2%)', value: 21.2 },
  { label: 'EIRL / EI au reel (estimation 45%)', value: 45 },
  { label: 'Personnalise', value: null },
];

const OFFRES = [
  { id: 1, nom: 'Hello Bank', prime: '80€', categorie: 'Banque', emoji: '🏦', couleur: '#00A8E8', details: "Ouvrez un compte avec le code parrain. Prime versée après activation de la carte.", code: "Lien direct", url: "https://www.hellobank.fr" },
  { id: 2, nom: 'Unibet', prime: '30€', categorie: 'Paris Sportif', emoji: '⚽', couleur: '#00AB55', details: "1. Validez votre identité.\n2. Déposez 10€.\nPrime parrain/filleul : 30€ de freebets.", code: "Lien direct", url: "https://www.unibet.fr/inscription/?campaign=240326&parrain=AC1330D7A4D09111" },
  { id: 3, nom: 'Trade Republic', prime: '10€', categorie: 'Crypto', emoji: '📈', couleur: '#E8EDF5', details: "1. Validez votre identité.\n2. Dépôt de 5€.\n3. Achat d'une action de 5€.\nPrime filleul : 10€.", code: "7qhwx383", url: "https://refnocode.trade.re/7qhwx383" },
  { id: 4, nom: 'ENGIE', prime: '45€', categorie: 'Energie', emoji: '🔥', couleur: '#00AAFF', details: "Souscription d'un contrat énergie.\nPrime filleul/parrain : 45€ déduits sur la prochaine facture.", code: "ZUA255872", url: "https://particuliers.engie.fr" },
  { id: 5, nom: 'Woolsocks', prime: '5€', categorie: 'Cashback', emoji: '🧦', couleur: '#FF4500', details: "1. Validez votre identité.\n2. Connectez 1 compte bancaire.\nPrime filleul : 5€ carte cadeau aléatoire.", code: "Lien direct", url: "https://woolsocks.eu" },
  { id: 6, nom: 'Coinbase', prime: '20€', categorie: 'Crypto', emoji: '₿', couleur: '#0052FF', details: "Achetez pour 100€ de crypto et recevez 20€ de bonus.", code: "Lien direct", url: "https://www.coinbase.com" }
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

// ─── COMPOSANTS UI ────────────────────────────────────────────────────────
function InputField({ label, id, value, onChange, placeholder, prefix, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8A95AA', marginBottom: 6, textTransform: 'uppercase' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4FFFA0', fontSize: 14, fontWeight: 700 }}>{prefix || '€'}</span>
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || '0'} inputMode="decimal"
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
    <div style={{ background: config.bg, border: '1.5px solid ' + config.border, borderRadius: 12, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 20 }}>{config.emoji}</span>
      <div>
        <div style={{ fontSize: 11, color: '#8A95AA', textTransform: 'uppercase' }}>Santé du projet</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: config.color }}>{sante}</div>
      </div>
    </div>
  );
}

function ResultCard({ label, value, highlight }) {
  return (
    <div style={{ background: highlight ? 'rgba(79,255,160,0.07)' : '#111318', border: '1.5px solid ' + (highlight ? '#4FFFA0' : '#1E2230'), borderRadius: 12, padding: '14px 18px' }}>
      <div style={{ fontSize: 11, color: '#8A95AA', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: highlight ? 22 : 18, fontWeight: 800, color: highlight ? '#4FFFA0' : '#E8EDF5', fontFamily: 'monospace' }}>{value}</div>
    </div>
  );
}

function SimulationMensuelle({ beneficeNet }) {
  const paliers = [5, 10, 20, 30, 50];
  return (
    <div style={{ background: '#111318', border: '1px solid #1A1E2A', borderRadius: 16, padding: '22px 20px', marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 18 }}>🚀</span>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#4FFFA0' }}>SIMULATION MENSUELLE</h3>
      </div>
      {paliers.map((nb) => (
        <div key={nb} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A0B0F', borderRadius: 10, padding: '12px 16px', marginBottom: 8, border: '1px solid #1A1E2A' }}>
          <span style={{ fontSize: 14, color: '#8A95AA' }}><strong style={{ color: '#E8EDF5' }}>{nb} clients</strong>/mois</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: (beneficeNet * nb) >= 2000 ? '#4FFFA0' : '#E8EDF5', fontFamily: 'monospace' }}>{fmt(beneficeNet * nb)}</span>
        </div>
      ))}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ background: '#111318', borderRadius: 16, padding: '20px', marginBottom: 16, border: '1px solid #1A1E2A' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#4FFFA0' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── COMPOSANT MODALE (MINI PAGE) ──────────────────────────────────────────
function ModaleOffre({ offre, onClose }) {
  if (!offre) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }} onClick={onClose}>
      <div style={{ background: '#111318', width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: '30px 20px', position: 'relative', borderTop: '2px solid #4FFFA0', animation: 'slideUp 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, background: '#333', borderRadius: 2, margin: '0 auto 20px' }} onClick={onClose}></div>
        <div style={{ fontSize: 40, marginBottom: 15 }}>{offre.emoji}</div>
        <h2 style={{ color: '#4FFFA0', fontSize: 24, fontWeight: 900 }}>{offre.nom}</h2>
        <p style={{ color: '#8A95AA', marginTop: 15, lineHeight: 1.6, fontSize: 15, whiteSpace: 'pre-line' }}>{offre.details}</p>
        
        <div style={{ background: '#0A0B0F', padding: '15px', borderRadius: 15, marginTop: 20, border: '1px solid #1E2230', textAlign: 'center' }}>
          <span style={{ color: '#4A5568', fontSize: 11, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Code Promo / Parrain</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#E8EDF5', letterSpacing: 1 }}>{offre.code}</span>
        </div>

        <button onClick={() => window.open(offre.url, '_blank')} style={{ width: '100%', background: '#4FFFA0', color: '#0A0C10', border: 'none', padding: '18px', borderRadius: 16, fontWeight: 800, fontSize: 16, marginTop: 20, cursor: 'pointer' }}>PROFITER DE L'OFFRE</button>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────
function PageAvis() {
  const avis = [
    { nom: "Lucas", date: "Il y a 2 jours", texte: "Super rapide pour Hello Bank, j'ai reçu mes 80€ comme prévu ! 🔥", note: "⭐⭐⭐⭐⭐" },
    { nom: "Sarah", date: "La semaine dernière", texte: "Le calculateur ProfitMaster est bluffant de précision.", note: "⭐⭐⭐⭐⭐" },
  ];
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px', paddingBottom: 120 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#4FFFA0', marginBottom: 20, textAlign: 'center' }}>AVIS UTILISATEURS</h2>
      {avis.map((a, i) => (
        <div key={i} style={{ background: '#111318', border: '1px solid #1A1E2A', borderRadius: 16, padding: '16px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 800, color: '#E8EDF5' }}>{a.nom}</span>
            <span style={{ fontSize: 12, color: '#4A5568' }}>{a.date}</span>
          </div>
          <div style={{ color: '#FFD700', fontSize: 12 }}>{a.note}</div>
          <p style={{ fontSize: 14, color: '#8A95AA', marginTop: 8 }}>"{a.texte}"</p>
        </div>
      ))}
    </div>
  );
}

function PageParrainage() {
  const [filtre, setFiltre] = useState('Tout');
  const [offreSelectionnee, setOffreSelectionnee] = useState(null);
  const categories = ['Tout', ...new Set(OFFRES.map(o => o.categorie))];
  const filtered = filtre === 'Tout' ? OFFRES : OFFRES.filter(o => o.categorie === filtre);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px', paddingBottom: 120 }}>
      <header style={{ textAlign: 'center', marginBottom: 30 }}>
        <h1 style={{ color: '#4FFFA0', fontSize: 28, fontWeight: 900 }}>Parrain 4P</h1>
        <p style={{ color: '#8A95AA', fontSize: 13 }}>Hub Financier & Optimisation</p>
      </header>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 10 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFiltre(cat)} style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: filtre === cat ? '#4FFFA0' : '#111318', color: filtre === cat ? '#0A0C10' : '#8A95AA', fontWeight: 700, whiteSpace: 'nowrap' }}>{cat}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtered.map(o => (
          <div key={o.id} onClick={() => setOffreSelectionnee(o)} style={{ background: '#111318', border: '1px solid #1A1E2A', borderRadius: 20, padding: '16px', cursor: 'pointer' }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{o.emoji}</div>
            <h3 style={{ color: '#E8EDF5', fontSize: 15, fontWeight: 800 }}>{o.nom}</h3>
            <p style={{ color: o.couleur, fontSize: 14, fontWeight: 700 }}>{o.prime}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, padding: '24px', background: '#111318', border: '2px dashed #4FFFA0', borderRadius: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>📩</div>
        <h3 style={{ color: '#E8EDF5', fontSize: 18, fontWeight: 900, marginBottom: 8 }}>REJOINS LE CLUB PRO</h3>
        <p style={{ color: '#8A95AA', fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>Ne manque plus aucune offre boostée et reçois mes conseils par e-mail.</p>
        <button onClick={() => window.open(BREVO_LINK, '_blank')} style={{ width: '100%', background: '#4FFFA0', color: '#0A0C10', border: 'none', padding: '16px', borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>S'INSCRIRE GRATUITEMENT</button>
      </div>

      <ModaleOffre offre={offreSelectionnee} onClose={() => setOffreSelectionnee(null)} />
    </div>
  );
}

// ─── APPLICATION PRINCIPALE ───────────────────────────────────────────────
function App() {
  const [onglet, setOnglet] = useState('parrainage');
  const [fields, setFields] = useState({ prixVente: '', matieres: '', transport: '', outillage: '', autresFrais: '', heures: '', tauxHoraire: '', tauxCotisations: '21.2', tauxPersonnalise: '', tauxOption: '21.2' });

  const setField = (key) => (val) => setFields((prev) => ({ ...prev, [key]: val }));
  const res = calcul(fields);

  useEffect(() => {
    const t = fields.tauxOption === 'custom' ? (parseFloat(fields.tauxPersonnalise) || 0) : parseFloat(fields.tauxOption);
    setFields(prev => ({ ...prev, tauxCotisations: String(t) }));
  }, [fields.tauxOption, fields.tauxPersonnalise]);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0B0F', color: '#E8EDF5', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
      
      {onglet === 'parrainage' && <PageParrainage />}
      {onglet === 'avis' && <PageAvis />}

      {onglet === 'calculateur' && (
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px', paddingBottom: 120 }}>
          <div style={{ textAlign: 'center', marginBottom: 25 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#4FFFA0' }}>ProfitMaster</h1>
            <p style={{ color: '#4A5568', fontSize: 13 }}>Calculateur de Rentabilité Pro</p>
          </div>
          <Section title="REVENUS" icon="💰"><InputField label="Prix de vente estimé" value={fields.prixVente} onChange={setField('prixVente')} /></Section>
          <Section title="COÛTS DIRECTS" icon="📦">
            <InputField label="Matières premières" value={fields.matieres} onChange={setField('matieres')} />
            <InputField label="Transport / Essence" value={fields.transport} onChange={setField('transport')} />
            <InputField label="Autres frais" value={fields.autresFrais} onChange={setField('autresFrais')} />
          </Section>
          <Section title="TEMPS PASSÉ" icon="🕐">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <InputField label="Heures" prefix="h" value={fields.heures} onChange={setField('heures')} />
              <InputField label="Taux/heure" value={fields.tauxHoraire} onChange={setField('tauxHoraire')} />
            </div>
          </Section>
          <Section title="FISCALITÉ" icon="🏛️">
            <select value={fields.tauxOption} onChange={(e) => setFields(prev => ({ ...prev, tauxOption: e.target.value }))} style={{ width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 10, color: '#E8EDF5', padding: '12px', marginBottom: 10, outline: 'none' }}>
              {TAUX_OPTIONS.map(o => <option key={o.label} value={o.value === null ? 'custom' : String(o.value)}>{o.label}</option>)}
            </select>
            {fields.tauxOption === 'custom' && <InputField label="Taux personnalisé (%)" prefix="%" value={fields.tauxPersonnalise} onChange={setField('tauxPersonnalise')} />}
          </Section>
          {res.prixVente > 0 && (
            <>
              <SanteIndicateur sante={res.sante} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}><ResultCard label="Bénéfice Net" value={fmt(res.beneficeNet)} highlight /><ResultCard label="Marge Nette" value={pct(res.marge)} /></div>
              <SimulationMensuelle beneficeNet={res.beneficeNet} />
            </>
          )}
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: '92%', maxWidth: 400, background: 'rgba(17, 19, 24, 0.95)', backdropFilter: 'blur(10px)', borderRadius: 22, display: 'flex', padding: '6px', border: '1px solid #1A1E2A', zIndex: 1000 }}>
        <button onClick={() => setOnglet('parrainage')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'parrainage' ? '#4FFFA0' : '#4A5568', padding: '10px', fontSize: 10, fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><span style={{ fontSize: 18 }}>🎁</span> OFFRES</button>
        <button onClick={() => setOnglet('avis')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'avis' ? '#4FFFA0' : '#4A5568', padding: '10px', fontSize: 10, fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><span style={{ fontSize: 18 }}>⭐</span> AVIS</button>
        <button onClick={() => setOnglet('calculateur')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'calculateur' ? '#4FFFA0' : '#4A5568', padding: '10px', fontSize: 10, fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><span style={{ fontSize: 18 }}>📊</span> CALCUL</button>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
