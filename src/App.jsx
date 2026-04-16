import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import LogoOffre from './components/LogoOffre';
import CarouselOffresDuMoment from './components/CarouselOffresDuMoment';
import { OFFRES } from './data/offres';
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

// ─── COMPOSANT TIMER ──────────────────────────────────────────────────────────
function Timer({ dateFin }) {
  const calcRemaining = useCallback(() => {
    const now = Date.now();
    const end = new Date(dateFin).getTime();
    const diff = end - now;
    if (diff <= 0) return null;
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return { days, hours, minutes };
  }, [dateFin]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(calcRemaining());
    }, 60000);
    return () => clearInterval(interval);
  }, [calcRemaining]);

  if (!remaining) return null;

  const label = remaining.days > 0
    ? `${remaining.days}j ${remaining.hours}h`
    : `${remaining.hours}h ${remaining.minutes}m`;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      background: 'rgba(255,80,80,0.12)',
      border: '1px solid rgba(255,80,80,0.35)',
      borderRadius: 5,
      padding: '2px 5px',
      marginTop: 4,
      width: 'fit-content',
      maxWidth: 'fit-content',
      flexShrink: 0,
      alignSelf: 'flex-start',
      whiteSpace: 'nowrap',
      lineHeight: 1,
    }}>
      <span style={{ fontSize: 9 }}>⏱️</span>
      <span style={{ fontSize: 9, fontWeight: 800, color: '#FF5050', letterSpacing: '0.03em' }}>
        {label}
      </span>
    </span>
  );
}

const CATEGORIES = ['Tout', 'Énergie', 'Banque', 'Cashback', 'Crypto', 'Or & Épargne', 'Play to Earn', 'Paris Sportifs'];
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

function Checklist({ offreId, conditions }) {
  const storageKey = 'checklist_' + offreId;
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggle = (i) => {
    const next = { ...checked, [i]: !checked[i] };
    setChecked(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch (e) { }
  };

  const total = conditions.length;
  const done = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#4FFFA0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ma progression</div>
        <div style={{ fontSize: 11, color: done === total ? '#4FFFA0' : '#8A95AA', fontWeight: 700 }}>{done}/{total}</div>
      </div>
      <div style={{ background: '#0A0B0F', borderRadius: 6, height: 4, marginBottom: 12, overflow: 'hidden' }}>
        <div style={{ background: '#4FFFA0', height: '100%', width: (done / total * 100) + '%', borderRadius: 6, transition: 'width 0.3s ease' }} />
      </div>
      {conditions.map((c, i) => (
        <div key={i} onClick={() => toggle(i)} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, cursor: 'pointer' }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, border: '2px solid ' + (checked[i] ? '#4FFFA0' : '#1E2230'), background: checked[i] ? '#4FFFA0' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.2s' }}>
            {checked[i] && <span style={{ fontSize: 11, color: '#0A0B0F', fontWeight: 900 }}>✓</span>}
          </div>
          <span style={{ fontSize: 13, color: checked[i] ? '#4A5568' : '#8A95AA', lineHeight: 1.5, textDecoration: checked[i] ? 'line-through' : 'none' }}>{c}</span>
        </div>
      ))}
      {done === total && (
        <div style={{ background: 'rgba(79,255,160,0.1)', border: '1px solid #4FFFA0', borderRadius: 10, padding: '10px', textAlign: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 13, color: '#4FFFA0', fontWeight: 800 }}>🎉 Toutes les étapes complétées !</span>
        </div>
      )}
    </div>
  );
}

function BoutonPartage({ offre }) {
  const partager = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: offre.nom + ' — ' + offre.bonus,
          text: offre.shareText,
          url: offre.shareUrl,
        });
      } catch (e) { }
    } else {
      try {
        await navigator.clipboard.writeText(offre.shareText + ' ' + offre.shareUrl);
        alert("Lien copié !");
      } catch (e) { }
    }
  };

  return (
    <button onClick={partager} style={{ width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 12, color: '#8A95AA', fontSize: 14, fontWeight: 700, padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 }}>
      <span style={{ fontSize: 16 }}>📤</span> Partager cette offre
    </button>
  );
}

function FormulaireChallenge() {
  const [method, setMethod] = useState('revolut');
  const inputBaseStyle = {
    width: '100%',
    background: '#0A0B0F',
    border: '1.5px solid #1E2230',
    borderRadius: 8,
    color: '#FFF',
    padding: '12px',
    outline: 'none',
    fontSize: '14px',
    marginBottom: '10px',
    fontFamily: 'inherit'
  };

  return (
    <div style={{ background: '#111318', border: '1px solid #4FFFA0', borderRadius: 16, padding: '20px', marginTop: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: '#4FFFA0', marginBottom: 8 }}>🏆 Challenge 3-en-1</h3>
        <p style={{ fontSize: 12, color: '#8A95AA' }}>Complète 3 offres et reçois <strong style={{ color: '#4FFFA0' }}>10€ de bonus</strong> de ma part !</p>
      </div>
      <form action="https://formspree.io/f/mreojpvq" method="POST">
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" name="prenom" placeholder="Prénom" required style={inputBaseStyle} />
          <input type="text" name="instagram" placeholder="@Pseudo Instagram" required style={inputBaseStyle} />
        </div>
        <input type="email" name="email" placeholder="Ton adresse email" required style={inputBaseStyle} />
        <input type="text" name="offres" placeholder="Les 3 offres choisies" required style={inputBaseStyle} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
          <label style={{ fontSize: '12px', color: '#8A95AA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input type="radio" name="pay_method" value="revolut" checked={method === 'revolut'} onChange={() => setMethod('revolut')} />
            Revolut
          </label>
          <label style={{ fontSize: '12px', color: '#8A95AA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input type="radio" name="pay_method" value="rib" checked={method === 'rib'} onChange={() => setMethod('rib')} />
            RIB
          </label>
        </div>
        {method === 'revolut' ? (
          <input type="text" name="revolut_tag" placeholder="Ton @Tag Revolut" required style={inputBaseStyle} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input type="text" name="nom_famille" placeholder="Nom de famille (pour le RIB)" required style={inputBaseStyle} />
            <input type="text" name="iban" placeholder="Ton IBAN" required style={inputBaseStyle} />
          </div>
        )}
        <div style={{ background: 'rgba(79, 255, 160, 0.05)', padding: '12px', borderRadius: '8px', border: '1px dashed rgba(79, 255, 160, 0.3)', marginBottom: '15px' }}>
          <p style={{ fontSize: '11px', color: '#8A95AA', textAlign: 'center', lineHeight: '1.4' }}>
            📸 N'oublie pas d'envoyer tes 3 preuves sur <a href="https://www.instagram.com/parrain_4p" target="_blank" rel="noreferrer" style={{ color: '#4FFFA0', fontWeight: 'bold' }}>Instagram</a> pour valider le virement.
          </p>
        </div>
        <button type="submit" style={{ width: '100%', background: '#4FFFA0', border: 'none', borderRadius: 8, color: '#0A0B0F', fontWeight: 800, padding: '12px', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>
          Envoyer ma demande
        </button>
      </form>
    </div>
  );
}

// ─── COMPOSANT FAVORIS ──────────────────────────────────────────────────────
function FavButton({ id, isFav, toggle }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); toggle(id); }} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
      <span style={{ fontSize: 16, color: isFav ? '#FF4B4B' : '#FFF', transition: 'all 0.2s' }}>{isFav ? '❤️' : '🤍'}</span>
    </button>
  );
}

// ─── PAGE PARRAINAGE ──────────────────────────────────────────────────────────
function PageParrainage({ favState }) {
  const { isFav, toggle, favOnly } = favState;
  const [filtre, setFiltre] = useState('Tout');
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);

  const filtrees = OFFRES.filter(o => {
    const matchCat = filtre === 'Tout' || o.categorie === filtre;
    const matchFav = !favOnly || isFav(o.id);
    return matchCat && matchFav;
  });

  const copier = (texte) => {
    navigator.clipboard.writeText(texte).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (selected) {
    const o = selected;
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#4FFFA0', fontSize: 14, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
          ← Retour
        </button>
        <div style={{ background: '#111318', borderRadius: 20, padding: '24px 20px', border: '1px solid #1A1E2A', marginBottom: 16, position: 'relative' }}>
          <FavButton id={o.id} isFav={isFav(o.id)} toggle={toggle} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <LogoOffre id={o.id} emoji={o.emoji} couleur={o.couleur} size={56} borderRadius={16} />
            <div>
              <div style={{ fontSize: 11, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{o.categorie}</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#E8EDF5' }}>{o.nom}</h2>
            </div>
          </div>
          <p style={{ fontSize: 14, color: '#8A95AA', lineHeight: 1.6, marginBottom: 20 }}>{o.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            <div style={{ background: '#0A0B0F', borderRadius: 10, padding: '12px', textAlign: 'center', border: '1px solid #1A1E2A' }}>
              <div style={{ fontSize: 10, color: '#4A5568', textTransform: 'uppercase', marginBottom: 4 }}>Prime parrain</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#4FFFA0' }}>{o.bonusParrain}</div>
            </div>
            <div style={{ background: '#0A0B0F', borderRadius: 10, padding: '12px', textAlign: 'center', border: '1px solid #1A1E2A' }}>
              <div style={{ fontSize: 10, color: '#4A5568', textTransform: 'uppercase', marginBottom: 4 }}>Filleul reçoit</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#E8EDF5' }}>{o.bonusFilleul}</div>
            </div>
          </div>
          <Checklist offreId={o.id} conditions={o.conditions} />
          {o.type === 'code' && (
            <div style={{ background: '#0A0B0F', borderRadius: 12, padding: '16px', marginBottom: 12, border: '1px dashed #4FFFA0', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 6, textTransform: 'uppercase' }}>Code parrainage</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#4FFFA0', fontFamily: 'monospace', letterSpacing: '0.1em' }}>{o.code}</div>
              <button onClick={() => copier(o.code)} style={{ marginTop: 10, background: '#4FFFA0', border: 'none', borderRadius: 8, color: '#0A0B0F', fontSize: 13, fontWeight: 700, padding: '8px 20px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {copied ? "Copié !" : "Copier le code"}
              </button>
            </div>
          )}
          {o.type === 'lien' && o.lien !== '#' && (
            <a href={o.lien} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #4FFFA0, #2ECC71)', borderRadius: 12, color: '#0A0B0F', fontSize: 15, fontWeight: 800, padding: '14px', textDecoration: 'none', fontFamily: 'inherit' }}>
              S'inscrire avec mon lien →
            </a>
          )}
          {o.type === 'contact' && (
            <div style={{ background: '#0A0B0F', borderRadius: 12, padding: '16px', border: '1px dashed #4FFFA0', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#8A95AA', marginBottom: 8, lineHeight: 1.5 }}>{o.note}</div>
              <a href={'https://instagram.com/' + o.contact.replace('@', '')} target="_blank" rel="noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F56040)', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 800, padding: '12px 24px', textDecoration: 'none', fontFamily: 'inherit' }}>
                Me contacter sur {o.contact}
              </a>
            </div>
          )}
          <BoutonPartage offre={o} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
      <CarouselOffresDuMoment offres={OFFRES} onSelect={setSelected} />
      <div style={{ marginBottom: 16, overflowX: 'auto', display: 'flex', gap: 8, paddingBottom: 4 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFiltre(cat)} style={{ background: filtre === cat ? '#4FFFA0' : '#111318', border: '1px solid ' + (filtre === cat ? '#4FFFA0' : '#1A1E2A'), borderRadius: 20, color: filtre === cat ? '#0A0B0F' : '#8A95AA', fontSize: 12, fontWeight: 700, padding: '6px 14px', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
            {cat}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtrees.map(o => (
          <div key={o.id} style={{ position: 'relative' }}>
            <FavButton id={o.id} isFav={isFav(o.id)} toggle={toggle} />
            <button
              onClick={() => setSelected(o)}
              style={{
                width: '100%',
                background: '#111318',
                border: '1px solid #1A1E2A',
                borderRadius: 16,
                padding: '16px 12px 34px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                position: 'relative',
                minHeight: '145px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                fontFamily: 'inherit'
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <LogoOffre id={o.id} emoji={o.emoji} couleur={o.couleur} size={44} borderRadius={12} />
              </div>
              <div style={{ fontSize: 10, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{o.categorie}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#E8EDF5', marginBottom: 4 }}>{o.nom}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: o.couleur }}>{o.bonus}</div>
              {o.dateFin && <Timer dateFin={o.dateFin} />}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(79, 255, 160, 0.1)',
                border: '1px solid rgba(79, 255, 160, 0.3)',
                borderRadius: '8px',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#4FFFA0', textTransform: 'uppercase' }}>Détail</span>
                <span style={{ fontSize: '10px', color: '#4FFFA0' }}>→</span>
              </div>
            </button>
          </div>
        ))}
      </div>
      <FormulaireChallenge />
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
    if (pdfPaid) alert("Fonctionnalité PDF disponible");
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
        <div style={{ fontSize: 11, color: '#4A5568', marginTop: 4 }}>Coût main d'œuvre : <span style={{ color: '#8A95AA' }}>{fmt(res.coutMain)}</span></div>
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
        <div style={{ fontSize: 11, color: '#4A5568' }}>Cotisations : <span style={{ color: '#8A95AA' }}>{fmt(res.cotisations)}</span></div>
      </Section>
      {res.prixVente > 0 && (
        <div style={{ marginTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#4FFFA0', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.08em' }}>Résultats en temps réel</div>
          <div style={{ background: res.sante === 'Rentable' ? 'rgba(79,255,160,0.1)' : res.sante === 'Risqué' ? 'rgba(255,190,50,0.1)' : 'rgba(255,80,80,0.1)', border: '1.5px solid ' + (res.sante === 'Rentable' ? '#4FFFA0' : res.sante === 'Risqué' ? '#FFBE32' : '#FF5050'), borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>{res.sante === 'Rentable' ? '✅' : res.sante === 'Risqué' ? '⚠️' : '🔴'}</span>
            <div>
              <div style={{ fontSize: 10, color: '#8A95AA', textTransform: 'uppercase' }}>Santé du projet</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: res.sante === 'Rentable' ? '#4FFFA0' : res.sante === 'Risqué' ? '#FFBE32' : '#FF5050' }}>{res.sante}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[
              { label: "Bénéfice Net", value: fmt(res.beneficeNet), h: true },
              { label: "Marge Nette", value: pct(res.marge), h: false },
              { label: "Total Charges", value: fmt(res.totalCharges), h: false },
              { label: "Cotisations", value: fmt(res.cotisations), h: false },
            ].map(({ label, value, h }) => (
              <div key={label} style={{ background: h ? 'rgba(79,255,160,0.07)' : '#111318', border: '1.5px solid ' + (h ? '#4FFFA0' : '#1E2230'), borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#8A95AA', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: h ? 22 : 17, fontWeight: 800, color: h ? '#4FFFA0' : '#E8EDF5', fontFamily: 'monospace' }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#111318', border: '1px solid #1A1E2A', borderRadius: 14, padding: '18px 16px', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 16 }}>🚀</span>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#4FFFA0', letterSpacing: '0.06em' }}>SIMULATION MENSUELLE</h3>
            </div>
            {[5, 10, 20, 30, 50].map((nb) => (
              <div key={nb} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A0B0F', borderRadius: 8, padding: '10px 14px', marginBottom: 6, border: '1px solid #1A1E2A' }}>
                <span style={{ fontSize: 13, color: '#8A95AA' }}><strong style={{ color: '#E8EDF5' }}>{nb} clients</strong> / mois</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: res.beneficeNet * nb >= 2000 ? '#4FFFA0' : '#E8EDF5', fontFamily: 'monospace' }}>{fmt(res.beneficeNet * nb)}</span>
              </div>
            ))}
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
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
            <h2 style={{ color: '#E8EDF5', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Sécurisez votre projet</h2>
            <div style={{ background: '#0A0B0F', borderRadius: 12, padding: '16px', marginBottom: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#4FFFA0' }}>2,00 €</div>
              <div style={{ fontSize: 12, color: '#8A95AA' }}>Paiement sécurisé via Stripe</div>
            </div>
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
      body { background: #0A0B0F; color: #E8EDF5; font-family: 'Inter', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
      input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      select { -webkit-appearance: none; appearance: none; }
      ::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0B0F', paddingBottom: 80 }}>
      <div style={{ background: 'linear-gradient(180deg, #111318 0%, #0A0B0F 100%)', borderBottom: '1px solid #1A1E2A', padding: '18px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 10, color: '#4FFFA0', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>HUB FINANCIER</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, background: 'linear-gradient(90deg, #4FFFA0, #A8FFD8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Parrain 4P
          </h1>
        </div>
        {onglet === 'parrainage' && (
          <button
            onClick={() => favState.setFavOnly(!favState.favOnly)}
            style={{ background: favState.favOnly ? '#4FFFA0' : '#111318', border: '1px solid #1A1E2A', borderRadius: 12, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}
          >
            <span style={{ fontSize: 14 }}>{favState.favOnly ? '❤️' : '🤍'}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: favState.favOnly ? '#0A0B0F' : '#4FFFA0' }}>{favState.count}</span>
          </button>
        )}
      </div>

      <p style={{ color: '#4A5568', fontSize: 12, marginTop: -8, textAlign: 'center', paddingBottom: 10, fontWeight: 500 }}>Parrainages + Calculateur de Rentabilité</p>

      {onglet === 'parrainage' && <PageParrainage favState={favState} />}
      {onglet === 'avis' && <PageAvis />}
      {onglet === 'calculateur' && <PageProfitMaster />}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111318', borderTop: '1px solid #1A1E2A', display: 'flex', zIndex: 100 }}>
        <button onClick={() => setOnglet('parrainage')} style={{ flex: 1, background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: 'inherit' }}>
          <span style={{ fontSize: 20 }}>🎁</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: onglet === 'parrainage' ? '#4FFFA0' : '#4A5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Parrainages</span>
          {onglet === 'parrainage' && <div style={{ width: 20, height: 2, background: '#4FFFA0', borderRadius: 1 }} />}
        </button>
        <button onClick={() => setOnglet('avis')} style={{ flex: 1, background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: 'inherit' }}>
          <span style={{ fontSize: 20 }}>⭐</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: onglet === 'avis' ? '#4FFFA0' : '#4A5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avis</span>
          {onglet === 'avis' && <div style={{ width: 20, height: 2, background: '#4FFFA0', borderRadius: 1 }} />}
        </button>
        <button onClick={() => setOnglet('calculateur')} style={{ flex: 1, background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: 'inherit' }}>
          <span style={{ fontSize: 20 }}>📊</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: onglet === 'calculateur' ? '#4FFFA0' : '#4A5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Calculateur</span>
          {onglet === 'calculateur' && <div style={{ width: 20, height: 2, background: '#4FFFA0', borderRadius: 1 }} />}
        </button>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
