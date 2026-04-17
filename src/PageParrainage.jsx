import React, { useState } from 'react';
import LogoOffre from './components/LogoOffre';
import CarouselOffresDuMoment from './components/CarrouselOffresDuMoment';
import Timer from './components/Timer';
import { OFFRES } from './data/offres';

const CATEGORIES = ['Tout', 'Énergie', 'Banque', 'Cashback', 'Crypto', 'Or & Épargne', 'Play to Earn', 'Paris Sportifs'];

// ─── COMPOSANT CHECKLIST (RÉ-INTÉGRÉ) ───────────────────────────────
function Checklist({ offreId, conditions }) {
  const storageKey = 'checklist_' + offreId;
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
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
    </div>
  );
}

// ─── COMPOSANT FAVBUTTON (RÉ-INTÉGRÉ) ──────────────────────────────
function FavButton({ id, isFav, toggle }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); toggle(id); }} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
      <span style={{ fontSize: 16, color: isFav ? '#FF4B4B' : '#FFF', transition: 'all 0.2s' }}>{isFav ? '❤️' : '🤍'}</span>
    </button>
  );
}

// ─── PAGE PRINCIPALE ────────────────────────────────────────────────
export default function PageParrainage({ favState }) {
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
