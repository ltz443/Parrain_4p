import React, { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://lhvdvfmtjpeyumbybavo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Nc-2z8SR84QV-_lPUqph3g_OTp9AiUh';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
};

export default function PageAvis() {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nom, setNom] = useState('');
  const [note, setNote] = useState(5);
  const [texte, setTexte] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const fetchAvis = async () => {
    try {
      setError(null);
      const res = await fetch(`${SUPABASE_URL}/rest/v1/avis?order=created_at.desc`, { headers });
      if (!res.ok) throw new Error('Erreur lors de la récupération des avis');
      const data = await res.json();
      setAvis(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les avis pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAvis(); }, []);

  const soumettre = async () => {
    if (!nom.trim() || !texte.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/avis`, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ nom: nom.trim(), note, texte: texte.trim() }),
      });
      if (!res.ok) throw new Error('Erreur lors de l\'envoi');
      
      setNom('');
      setTexte('');
      setNote(5);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchAvis();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de l'avis. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230',
    borderRadius: 8, color: '#E8EDF5', fontSize: 14, padding: '11px 12px',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4FFFA0', marginBottom: 20, textAlign: 'center' }}>Avis de la Communauté</h2>

      <div style={{ background: '#111318', border: '1px solid #1A1E2A', borderRadius: 16, padding: '16px', marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#E8EDF5', marginBottom: 12 }}>Laisser un avis</h3>
        <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ton prénom" style={{ ...inputStyle, marginBottom: 10 }} />
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {[1,2,3,4,5].map(n => (
            <span key={n} onClick={() => setNote(n)} style={{ fontSize: 28, cursor: 'pointer', opacity: note >= n ? 1 : 0.3 }}>⭐</span>
          ))}
        </div>
        <textarea value={texte} onChange={e => setTexte(e.target.value)} placeholder="Ton expérience..." rows={3} style={{ ...inputStyle, resize: 'none', marginBottom: 10 }} />
        <button onClick={soumettre} disabled={sending} style={{ width: '100%', background: '#4FFFA0', border: 'none', borderRadius: 10, color: '#0A0B0F', fontSize: 14, fontWeight: 800, padding: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
          {sending ? 'Envoi...' : success ? '✅ Envoyé !' : 'Publier mon avis'}
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#4A5568' }}>Chargement...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: '#FF5050' }}>{error}</p>
      ) : avis.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#4A5568' }}>Sois le premier à laisser un avis !</p>
      ) : (
        avis.map((a) => (
          <div key={a.id} style={{ background: '#111318', border: '1px solid #1A1E2A', borderRadius: 16, padding: '16px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 800, color: '#E8EDF5' }}>{a.nom}</span>
              <span style={{ fontSize: 12, color: '#4A5568' }}>{new Date(a.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
            <div style={{ color: '#FFD700', fontSize: 12, marginBottom: 8 }}>{'⭐'.repeat(a.note)}</div>
            <p style={{ fontSize: 14, color: '#8A95AA', lineHeight: 1.5 }}>"{a.texte}"</p>
          </div>
        ))
      )}
    </div>
  );
}
