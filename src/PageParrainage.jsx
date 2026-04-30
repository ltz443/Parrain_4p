import React, { useState } from 'react';
import LogoOffre from './components/LogoOffre';
import CarouselOffresDuMoment from './components/CarrouselOffresDuMoment';
import Timer from './components/Timer';
import { useOffres } from './hooks/useOffres';

const CATEGORIES = ['Tout', 'Énergie', 'Banque', 'Cashback', 'Crypto', 'Or & Épargne', 'Play to Earn', 'Paris Sportifs'];

// ─── RUBAN DIAGONAL ──────────────────────────────────────────────────
function RubanIndisponible() {
  return (
    <div style={{
      position: 'absolute',
      width: '160%',
      padding: '8px 0',
      top: '38%',
      left: '-30%',
      transform: 'rotate(-45deg)',
      background: 'rgba(60,60,60,0.93)',
      backdropFilter: 'blur(4px)',
      textAlign: 'center',
      borderTop: '1px solid rgba(255,255,255,0.12)',
      borderBottom: '1px solid rgba(255,255,255,0.12)',
      zIndex: 10,
      pointerEvents: 'none',
    }}>
      <span style={{ color: '#aaa', fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>
        Indisponible
      </span>
    </div>
  );
}

// ─── COMPOSANT BOUTON PARTAGE (RÉ-INTÉGRÉ) ──────────────────────────
function BoutonPartage({ offre }) {
  const partager = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: offre.nom + ' - ' + offre.bonus,
          text: offre.shareText,
          url: offre.shareUrl,
        });
      } catch (e) { }
    } else {
      navigator.clipboard.writeText(offre.shareText + ' ' + offre.shareUrl);
      alert("Lien copié !");
    }
  };
  return (
    <button onClick={partager} style={{ width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 12, color: '#8A95AA', fontSize: 14, fontWeight: 700, padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, fontFamily: 'inherit' }}>
      📤 Partager cette offre
    </button>
  );
}

// ─── COMPOSANT FORMULAIRE (RÉ-INTÉGRÉ) ─────────────────────────────
function FormulaireChallenge() {
  const [method, setMethod] = useState('revolut');
  const inputStyle = { width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 8, color: '#FFF', padding: '12px', marginBottom: '10px', outline: 'none', fontFamily: 'inherit' };

  return (
    <div style={{ background: '#111318', border: '1px solid #4FFFA0', borderRadius: 16, padding: '20px', marginTop: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 900, color: '#4FFFA0', textAlign: 'center', marginBottom: 8 }}>🏆 Challenge 3-en-1</h2>
      <p style={{ fontSize: 12, color: '#8A95AA', textAlign: 'center', marginBottom: 20 }}>Reçois <strong style={{ color: '#4FFFA0' }}>10€ de bonus</strong> après 3 offres !</p>
      <form action="https://formspree.io/f/mreojpvq" method="POST">
        <input type="text" name="pseudo" placeholder="@Pseudo Instagram" required style={inputStyle} />
        <input type="text" name="offres" placeholder="Les 3 offres choisies" required style={inputStyle} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 15 }}>
          <label style={{ color: '#8A95AA', fontSize: 12 }}><input type="radio" name="pay" value="revolut" checked={method === 'revolut'} onChange={() => setMethod('revolut')} /> Revolut</label>
          <label style={{ color: '#8A95AA', fontSize: 12 }}><input type="radio" name="pay" value="rib" checked={method === 'rib'} onChange={() => setMethod('rib')} /> RIB</label>
        </div>
        <input type="text" name="id_paiement" placeholder={method === 'revolut' ? "Ton @Tag Revolut" : "Ton IBAN"} required style={inputStyle} />
        <button type="submit" style={{ width: '100%', background: '#4FFFA0', border: 'none', borderRadius: 8, color: '#0A0B0F', fontWeight: 800, padding: '12px', cursor: 'pointer' }}>Envoyer ma demande</button>
      </form>
    </div>
  );
}

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
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const done = Object.values(checked).filter(Boolean).length;
  const total = conditions ? conditions.length : 0;

  if (total === 0) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#4FFFA0', textTransform: 'uppercase' }}>Progression</div>
        <div style={{ fontSize: 11, color: '#8A95AA' }}>{done}/{total}</div>
      </div>
      <div style={{ background: '#0A0B0F', height: 4, borderRadius: 2, marginBottom: 15, overflow: 'hidden' }}>
        <div style={{ background: '#4FFFA0', height: '100%', width: `${(done / total) * 100}%`, transition: '0.3s' }} />
      </div>
      {conditions.map((c, i) => (
        <div key={i} onClick={() => toggle(i)} style={{ display: 'flex', gap: 10, marginBottom: 8, cursor: 'pointer', alignItems: 'flex-start' }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, border: '2px solid ' + (checked[i] ? '#4FFFA0' : '#1E2230'), background: checked[i] ? '#4FFFA0' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {checked[i] && <span style={{ color: '#0A0B0F', fontSize: 10, fontWeight: 900 }}>✓</span>}
          </div>
          <span style={{ fontSize: 13, color: checked[i] ? '#4A5568' : '#8A95AA', textDecoration: checked[i] ? 'line-through' : 'none' }}>{c}</span>
        </div>
      ))}
    </div>
  );
}

// ─── COMPOSANT FAVBUTTON (RÉ-INTÉGRÉ) ──────────────────────────────
function FavButton({ id, isFav, toggle }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); toggle(id); }} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
      <span style={{ fontSize: 16, color: isFav ? '#FF4B4B' : '#FFF' }}>{isFav ? '❤️' : '🤍'}</span>
    </button>
  );
}

// ─── PAGE PRINCIPALE ────────────────────────────────────────────────
export default function PageParrainage({ favState }) {
  const { isFav, toggle, favOnly } = favState;
  const { offres, loading, error } = useOffres();
  const [filtre, setFiltre] = useState('Tout');
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);

  const filtrees = offres.filter(o => {
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#4FFFA0', fontWeight: 700 }}>
        Chargement des offres...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#FF4B4B', fontWeight: 700 }}>
        Erreur: {error}
      </div>
    );
  }

  if (selected) {
    const o = selected;
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#4FFFA0', fontSize: 14, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>← Retour</button>
        <div style={{ background: '#111318', borderRadius: 20, padding: '24px 20px', border: '1px solid #1A1E2A', position: 'relative', overflow: 'hidden' }}>
          {o.Disponible_actuellement === false && <RubanIndisponible />}
          <FavButton id={o.id} isFav={isFav(o.id)} toggle={toggle} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <LogoOffre id={o.id} emoji={o.emoji} couleur={o.couleur} size={56} borderRadius={16} />
            <div>
              <div style={{ fontSize: 11, color: '#4A5568', textTransform: 'uppercase' }}>{o.categorie}</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#E8EDF5' }}>{o.nom}</h2>
            </div>
          </div>
          <p style={{ fontSize: 14, color: '#8A95AA', lineHeight: 1.6, marginBottom: 20 }}>{o.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            <div style={{ background: '#0A0B0F', borderRadius: 10, padding: '12px', textAlign: 'center', border: '1px solid #1A1E2A' }}>
              <div style={{ fontSize: 10, color: '#4A5568', textTransform: 'uppercase' }}>Prime parrain</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#4FFFA0' }}>{o.bonusParrain}</div>
            </div>
            <div style={{ background: '#0A0B0F', borderRadius: 10, padding: '12px', textAlign: 'center', border: '1px solid #1A1E2A' }}>
              <div style={{ fontSize: 10, color: '#4A5568', textTransform: 'uppercase' }}>Filleul reçoit</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#E8EDF5' }}>{o.bonusFilleul}</div>
            </div>
          </div>
          <Checklist offreId={o.id} conditions={o.conditions} />
          {o.type === 'code' && (
            <div style={{ background: '#0A0B0F', borderRadius: 12, padding: '16px', border: '1px dashed #4FFFA0', textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#4FFFA0', fontFamily: 'monospace' }}>{o.code}</div>
              <button onClick={() => copier(o.code)} style={{ marginTop: 10, background: '#4FFFA0', border: 'none', borderRadius: 8, color: '#0A0B0F', fontSize: 13, fontWeight: 700, padding: '8px 20px', cursor: 'pointer' }}>
                {copied ? "Copié !" : "Copier le code"}
              </button>
            </div>
          )}
          {o.type === 'lien' && (
            <a href={o.lien} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #4FFFA0, #2ECC71)', borderRadius: 12, color: '#0A0B0F', fontSize: 15, fontWeight: 800, padding: '14px', textDecoration: 'none', marginBottom: 10 }}>S'inscrire avec mon lien →</a>
          )}
          {o.id === 'hellobank' && (
            <a href="https://www.instagram.com/parrain_4p?igsh=bjFpNHJtNjM4MGs3" target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 12, color: '#8A95AA', fontSize: 14, fontWeight: 700, padding: '12px', cursor: 'pointer', textDecoration: 'none', textAlign: 'center', marginBottom: 10, fontFamily: 'inherit' }}>📸 Me contacter sur Instagram</a>
          )}
          <BoutonPartage offre={o} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
      <CarouselOffresDuMoment offres={offres} onSelect={setSelected} />
      <div style={{ marginBottom: 16, overflowX: 'auto', display: 'flex', gap: 8, paddingBottom: 4 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFiltre(cat)} style={{ background: filtre === cat ? '#4FFFA0' : '#111318', border: '1px solid ' + (filtre === cat ? '#4FFFA0' : '#1A1E2A'), borderRadius: 20, color: filtre === cat ? '#0A0B0F' : '#8A95AA', fontSize: 12, fontWeight: 700, padding: '6px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{cat}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtrees.map(o => (
          <div key={o.id} style={{ position: 'relative' }}>
            <FavButton id={o.id} isFav={isFav(o.id)} toggle={toggle} />
            <button
              onClick={() => setSelected(o)}
              style={{ width: '100%', background: '#111318', border: '1px solid #1A1E2A', borderRadius: 16, padding: '16px 12px 12px', cursor: 'pointer', textAlign: 'left', minHeight: 180, position: 'relative', display: 'flex', flexDirection: 'column', fontFamily: 'inherit', overflow: 'hidden', justifyContent: 'space-between', opacity: o.Disponible_actuellement === false ? 0.7 : 1 }}
            >
              {o.Disponible_actuellement === false && <RubanIndisponible />}
              <LogoOffre id={o.id} emoji={o.emoji} couleur={o.couleur} size={40} borderRadius={10} />
              <div style={{ fontSize: 10, color: '#4A5568', marginTop: 10 }}>{o.categorie}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#E8EDF5' }}>{o.nom}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: o.couleur }}>{o.bonus}</div>
              {o.dateFin && <Timer dateFin={o.dateFin} />}
              <div style={{ alignSelf: 'flex-end', background: 'rgba(79, 255, 160, 0.05)', border: '1px solid #4FFFA0', borderRadius: 8, color: '#4FFFA0', fontSize: 11, fontWeight: 800, padding: '6px 12px', marginTop: 10, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Détail →</div>
            </button>
          </div>
        ))}
      </div>
      <FormulaireChallenge />
    </div>
  );
}
