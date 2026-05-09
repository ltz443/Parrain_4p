import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LogoOffre from './LogoOffre';

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

function BoutonPartage({ offre }) {
  const partager = async () => {
    const url = `https://parrain-4p.vercel.app/offres/${offre.id}`;
    const text = offre.shareText || `Découvre l'offre ${offre.nom} sur Parrain 4P !`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: offre.nom + ' - ' + offre.bonusFilleul,
          text: text,
          url: url,
        });
      } catch (e) { }
    } else {
      navigator.clipboard.writeText(text + ' ' + url);
      alert('Lien copié !');
    }
  };
  return (
    <button onClick={partager} style={{ width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 12, color: '#8A95AA', fontSize: 14, fontWeight: 700, padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, fontFamily: 'inherit' }}>
      📤 Partager cette offre
    </button>
  );
}

export default function PageOffre() {
  const { id } = useParams();
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchOffre() {
      try {
        const response = await fetch('/data/offres.json');
        if (!response.ok) throw new Error('Erreur lors du chargement des offres');
        const data = await response.json();
        const found = data.find(o => o.id === id);
        if (!found) throw new Error('Offre introuvable');
        setOffre(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOffre();
  }, [id]);

  // SEO : titre et meta description uniques par offre
  useEffect(() => {
    if (offre) {
      document.title = `${offre.nom} - Parrainage ${offre.bonusFilleul} | Parrain 4P`;

      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute(
        'content',
        `${offre.description} Prime parrain : ${offre.bonusParrain}. Filleul reçoit : ${offre.bonusFilleul}.`
      );
    }

    return () => {
      document.title = 'Parrain 4P - Hub Financier & ProfitMaster';
    };
  }, [offre]);

  const copier = (texte) => {
    navigator.clipboard.writeText(texte).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#4FFFA0', fontWeight: 700 }}>
        Chargement...
      </div>
    );
  }

  if (error || !offre) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
        <Link to="/" style={{ color: '#4FFFA0', fontSize: 14, textDecoration: 'none' }}>← Retour</Link>
        <div style={{ marginTop: 20, color: '#FF4B4B', fontWeight: 700 }}>
          {error || 'Offre introuvable'}
        </div>
      </div>
    );
  }

  const o = offre;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
      <Link to="/" style={{ background: 'none', border: 'none', color: '#4FFFA0', fontSize: 14, cursor: 'pointer', marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontFamily: 'inherit' }}>← Retour</Link>
      <div style={{ background: '#111318', borderRadius: 20, padding: '24px 20px', border: '1px solid #1A1E2A', position: 'relative', overflow: 'hidden', marginTop: 16 }}>
        {o.Disponible_actuellement === false && <RubanIndisponible />}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <LogoOffre id={o.id} emoji={o.emoji} couleur={o.couleur} size={56} borderRadius={16} />
          <div>
            <div style={{ fontSize: 11, color: '#4A5568', textTransform: 'uppercase' }}>{o.categorie}</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#E8EDF5', margin: 0 }}>{o.nom}</h2>
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
        {(o.type === 'code' || (!o.type && o.code)) && (
          <div style={{ background: '#0A0B0F', borderRadius: 12, padding: '16px', border: '1px dashed #4FFFA0', textAlign: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#4FFFA0', fontFamily: 'monospace' }}>{o.code}</div>
            <button onClick={() => copier(o.code)} style={{ marginTop: 10, background: '#4FFFA0', border: 'none', borderRadius: 8, color: '#0A0B0F', fontSize: 13, fontWeight: 700, padding: '8px 20px', cursor: 'pointer' }}>
              {copied ? 'Copié !' : 'Copier le code'}
            </button>
          </div>
        )}
        {(o.type === 'lien' || (!o.type && o.lien)) && (
          <a href={o.lien} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #4FFFA0, #2ECC71)', borderRadius: 12, color: '#0A0B0F', fontSize: 15, fontWeight: 800, padding: '14px', textDecoration: 'none', marginBottom: 10 }}>
            S'inscrire avec mon lien →
          </a>
        )}
        {o.id === 'hellobank' && (
          <a href="https://www.instagram.com/parrain_4p?igsh=bjFpNHJtNjM4MGs3" target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 12, color: '#8A95AA', fontSize: 14, fontWeight: 700, padding: '12px', cursor: 'pointer', textDecoration: 'none', textAlign: 'center', marginBottom: 10, fontFamily: 'inherit' }}>
            📸 Me contacter sur Instagram
          </a>
         )}
        {o.id === 'scrambly' && (
          <Link 
            to="/guides/scrambly" 
            style={{ 
              display: 'block', 
              textAlign: 'center', 
              background: '#4FFFA0', 
              borderRadius: 12, 
              color: '#0A0B0F', 
              fontSize: 15, 
              fontWeight: 800, 
              padding: '14px', 
              textDecoration: 'none', 
              marginBottom: 10,
              boxShadow: '0 4px 15px rgba(79, 255, 160, 0.2)'
            }}
          >
            📋 Guide pas à pas →
          </Link>
        )}
        {o.id === 'okx' && (
          <Link 
            to="/guides/okx" 
            style={{ 
              display: 'block', 
              textAlign: 'center', 
              background: '#4FFFA0', 
              borderRadius: 12, 
              color: '#0A0B0F', 
              fontSize: 15, 
              fontWeight: 800, 
              padding: '14px', 
              textDecoration: 'none', 
              marginBottom: 10,
              boxShadow: '0 4px 15px rgba(79, 255, 160, 0.2)'
            }}
          >
            📋 Guide pas à pas →
          </Link>
        )}
        <BoutonPartage offre={o} />
      </div>
    </div>
  );
}