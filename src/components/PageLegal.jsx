import React, { useState } from 'react';

const sections = {
  mentions: {
    titre: '📋 Mentions Légales',
    contenu: `
Éditeur du site : LTZ44
Contact : Instagram @parrain_4p
Hébergeur : Vercel Inc., 340 Pine Street, Suite 1200, San Francisco, CA 94104, États-Unis

Ce site est un hub personnel de codes de parrainage.
    `
  },
  cgu: {
    titre: "📜 Conditions Générales d'Utilisation",
    contenu: `
En accédant à ce site, vous acceptez les présentes conditions.

Ce site présente des offres de parrainage à titre informatif. L'utilisation de ces offres est soumise aux conditions propres de chaque plateforme partenaire.

Nous nous réservons le droit de modifier les offres présentées à tout moment sans préavis.

Ce site n'est pas responsable des changements ou suppressions d'offres par les plateformes tierces.
    `
  },
  confidentialite: {
    titre: '🔒 Politique de Confidentialité',
    contenu: `
Ce site utilise Umami Analytics, un outil de mesure d'audience respectueux de la vie privée (sans cookies, sans données personnelles identifiables).

Données collectées : pages visitées, pays de provenance, type d'appareil. Aucune donnée personnelle n'est collectée, vendue ou partagée.

Aucun cookie de traçage n'est utilisé sur ce site.

Conformément au RGPD, vous pouvez exercer vos droits en nous contactant via Instagram @parrain_4p.
    `
  }
};

export default function PageLegal() {
  const [actif, setActif] = useState('mentions');
  const section = sections[actif];

  return (
    <div style={{ padding: '20px 16px', maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ color: '#4FFFA0', fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Informations légales</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {Object.entries(sections).map(([key, s]) => (
          <button
            key={key}
            onClick={() => setActif(key)}
            style={{
              background: actif === key ? '#4FFFA0' : '#1A1E2A',
              color: actif === key ? '#0A0B0F' : '#9AA3B0',
              border: 'none',
              borderRadius: 8,
              padding: '7px 13px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {s.titre}
          </button>
        ))}
      </div>

      <div style={{
        background: '#111318',
        border: '1px solid #1A1E2A',
        borderRadius: 12,
        padding: '20px 16px',
        whiteSpace: 'pre-line',
        fontSize: 13,
        color: '#9AA3B0',
        lineHeight: 1.8
      }}>
        {section.contenu}
      </div>

      <p style={{ marginTop: 16, fontSize: 11, color: '#4A5568', textAlign: 'center' }}>
        Dernière mise à jour : avril 2026
      </p>
    </div>
  );
}
