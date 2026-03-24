import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// CONNEXION SUPABASE
const supabase = createClient(
  'https://wjduwqjcfbbhtkzzdkga.supabase.co',
  'sb_publishable_IBBHjx4pchtNmbTAXNTQ7Q_oOi7Piso'
);

export default function App() {
  const [offres, setOffres] = useState([]);
  const [onglet, setOnglet] = useState('parrainage');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffres() {
      const { data, error } = await supabase.from('offres').select('*');
      if (!error) setOffres(data);
      setLoading(false);
    }
    fetchOffres();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0B0F', color: '#E8EDF5', fontFamily: 'sans-serif', paddingBottom: '80px' }}>
      <div style={{ padding: '20px', textAlign: 'center', background: '#111318', borderBottom: '1px solid #1A1E2A' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#4FFFA0', margin: 0 }}>PARRAIN 4P</h1>
      </div>

      {onglet === 'parrainage' ? (
        <div style={{ padding: '16px' }}>
          {loading ? <p style={{ textAlign: 'center' }}>Chargement...</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {offres.map((o) => (
                <div key={o.id} style={{ background: '#111318', border: '1px solid #1A1E2A', borderRadius: '16px', padding: '16px' }}>
                  <div style={{ fontSize: '10px', color: '#4FFFA0', fontWeight: 'bold' }}>{o.categorie}</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', margin: '6px 0' }}>{o.nom}</div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#4FFFA0' }}>{o.bonus}</div>
                  <a href={o.lien} target="_blank" style={{ display: 'block', marginTop: '12px', textAlign: 'center', background: '#1E2230', color: 'white', padding: '8px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px' }}>Voir →</a>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2 style={{ color: '#4FFFA0' }}>Calculateur ProfitMaster</h2>
          <p>Section en cours de finalisation...</p>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111318', borderTop: '1px solid #1A1E2A', display: 'flex', height: '70px' }}>
        <button onClick={() => setOnglet('parrainage')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'parrainage' ? '#4FFFA0' : '#4A5568' }}>🎁 OFFRES</button>
        <button onClick={() => setOnglet('calculateur')} style={{ flex: 1, background: 'none', border: 'none', color: onglet === 'calculateur' ? '#4FFFA0' : '#4A5568' }}>📊 PROFIT</button>
      </div>
    </div>
  );
}
