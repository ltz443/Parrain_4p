import React, { useState } from 'react';

const FAQS = [
  {
    num: '01',
    question: "C'est quoi le parrainage ?",
    answer: "Une plateforme récompense les deux parties quand quelqu'un s'inscrit via un lien ou code parrain. Toi tu reçois un bonus, moi une prime. Tout le monde gagne.",
  },
  {
    num: '02',
    question: "Est-ce que c'est légal ?",
    answer: "Oui, à 100%. Le parrainage est un programme officiel proposé par les plateformes elles-mêmes. Ce n'est ni du MLM, ni une arnaque. Les primes sont garanties.",
  },
  {
    num: '03',
    question: "Est-ce que je peux retirer l'argent déposé ?",
    answer: "Oui. L'argent que tu déposes reste le tien. Pour les offres avec dépôt, tu peux généralement retirer après avoir obtenu la prime selon les conditions de chaque plateforme.",
  },
  {
    num: '04',
    question: "Combien de temps pour recevoir la prime ?",
    answer: "Ça varie. En général entre 1 et 7 jours ouvrés après validation des conditions. Certaines plateformes comme Kraken demandent jusqu'à 14 jours. Chaque offre précise le délai.",
  },
  {
    num: '05',
    question: "Une offre est indisponible - que faire ?",
    answer: "Les offres marquées 'Indisponible' sont temporairement suspendues. Contacte-moi sur Instagram @parrain_4p pour savoir si une nouvelle offre est disponible.",
  },
];

const LEGALS = [
  {
    key: 'mentions',
    label: '📋 Mentions légales',
    contenu: `Éditeur du site : Parrain4P\nContact : Instagram @parrain_4p\nHébergeur : Vercel Inc., 340 Pine Street, Suite 1200, San Francisco, CA 94104, États-Unis\n\nCe site est un hub personnel de codes de parrainage.`,
  },
  {
    key: 'cgu',
    label: '📜 CGU',
    contenu: `En accédant à ce site, vous acceptez les présentes conditions.\n\nCe site présente des offres de parrainage à titre informatif. L'utilisation de ces offres est soumise aux conditions propres de chaque plateforme partenaire.\n\nNous nous réservons le droit de modifier les offres à tout moment sans préavis. Ce site n'est pas responsable des changements ou suppressions d'offres par les plateformes tierces.`,
  },
  {
    key: 'confidentialite',
    label: '🔒 Confidentialité',
    contenu: `Ce site utilise Umami Analytics, un outil de mesure d'audience respectueux de la vie privée (sans cookies, sans données personnelles identifiables).\n\nDonnées collectées : pages visitées, pays de provenance, type d'appareil. Aucune donnée personnelle n'est collectée, vendue ou partagée.\n\nConformément au RGPD, vous pouvez exercer vos droits en nous contactant via Instagram @parrain_4p.`,
  },
];

function FlipCard({ num, question, answer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      style={{ cursor: 'pointer', marginBottom: 0 }}
    >
      {/* FACE AVANT */}
      {!flipped && (
        <div style={{
          background: '#111318',
          border: '1px solid #1A1E2A',
          borderRadius: 16,
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4FFFA0', fontFamily: 'monospace' }}>{num}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#E8EDF5', lineHeight: 1.35, flex: 1 }}>{question}</div>
            <div style={{ fontSize: 18, opacity: 0.3, flexShrink: 0 }}>↺</div>
          </div>
        </div>
      )}

      {/* FACE ARRIÈRE */}
      {flipped && (
        <div style={{
          background: '#0F1A12',
          border: '1px solid #4FFFA0',
          borderRadius: 16,
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#4FFFA0', letterSpacing: 2, textTransform: 'uppercase' }}>Réponse</div>
            <div style={{ fontSize: 11, color: '#4A5568' }}>Retapper pour fermer</div>
          </div>
          <div style={{ fontSize: 13, color: '#9AA3B0', lineHeight: 1.65 }}>{answer}</div>
        </div>
      )}
    </div>
  );
}

export default function PageFAQ() {
  const [legalOuvert, setLegalOuvert] = useState(null);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 40px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#4FFFA0', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>FAQ</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: 'Inter, sans-serif' }}>Questions fréquentes</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FAQS.map((faq) => (
          <FlipCard key={faq.num} {...faq} />
        ))}
      </div>

      <div style={{ marginTop: 32, borderTop: '1px solid #1A1E2A', paddingTop: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#4A5568', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
          Informations légales
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {LEGALS.map((l) => (
            <button
              key={l.key}
              onClick={() => setLegalOuvert(legalOuvert === l.key ? null : l.key)}
              style={{
                background: legalOuvert === l.key ? '#1A2A1A' : '#111318',
                border: `1px solid ${legalOuvert === l.key ? '#4FFFA0' : '#1A1E2A'}`,
                borderRadius: 8,
                padding: '8px 14px',
                fontSize: 12,
                color: legalOuvert === l.key ? '#4FFFA0' : '#4A5568',
                cursor: 'pointer',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {legalOuvert && (
          <div style={{
            background: '#111318',
            border: '1px solid #1A1E2A',
            borderRadius: 12,
            padding: '16px',
            fontSize: 12,
            color: '#6B7280',
            lineHeight: 1.8,
            whiteSpace: 'pre-line',
          }}>
            {LEGALS.find(l => l.key === legalOuvert)?.contenu}
          </div>
        )}
      </div>
    </div>
  );
}
