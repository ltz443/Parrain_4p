import React from 'react';

export default function PageAvis() {
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
