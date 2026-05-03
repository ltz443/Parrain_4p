import React, { useState } from 'react';

const FAQS = [
  {
    num: '01',
    question: "C’est quoi le parrainage ?",
    answer: "Une plateforme récompense les deux parties quand quelqu’un s’inscrit via un lien ou code parrain. Toi tu reçois un bonus, moi une prime. Tout le monde gagne.",
  },
  {
    num: '02',
    question: "Est-ce que c’est légal ?",
    answer: "Oui, à 100%. Le parrainage est un programme officiel proposé par les plateformes elles-mêmes. Ce n’est ni du MLM, ni une arnaque. Les primes sont garanties.",
  },
  {
    num: '03',
    question: "Est-ce que je peux retirer l’argent déposé ?",
    answer: "Oui. L’argent que tu déposes reste le tien. Pour les offres avec dépôt, tu peux généralement retirer après avoir obtenu la prime selon les conditions de chaque plateforme.",
  },
  {
    num: '04',
    question: "Combien de temps pour recevoir la prime ?",
    answer: "Ça varie. En général entre 1 et 7 jours ouvrés après validation des conditions. Certaines plateformes comme Kraken demandent jusqu’à 14 jours. Chaque offre précise le délai.",
  },
  {
    num: '05',
    question: "Une offre est indisponible - que faire ?",
    answer: "Les offres marquées 'Indisponible' sont temporairement suspendues. Contacte-moi sur Instagram @parrain_4p pour savoir si une nouvelle offre est disponible.",
  },
  {
    num: '06',
    question: "Qui suis-je ?",
    answer: `Parrain 4P France. De jour je bosse dans la logistique, et en parallèle j’ai créé Parrain 4P. Depuis 2024, le parrainage est devenu mon activité principale en dehors de mon travail.

+60 000 € générés en moins de 2 ans — dont +22 000 € avec Green Nation et +40 000 € via diverses banques en ligne.

Parrain 4P, c’est la centralisation de tout ce qui fonctionne vraiment. Chaque offre ici est une offre que j’utilise ou que j’ai utilisée moi-même.

Je ne suis ni influenceur, ni "guru de la finance". Je suis quelqu’un qui a testé, optimisé, et documenté — pendant deux ans — ce qui rapporte réellement dans le parrainage en France. Pas de théorie. Que du concret.

Au départ c'était pour moi : maximiser les bonus, éviter les pièges, trouver les offres qui valent vraiment le coup. Rapidement, des proches m'ont demandé les mêmes tuyaux. Parrain 4P est né de là.

Aujourd’hui je mets à jour le site régulièrement pour que tu aies toujours les meilleures conditions disponibles — sans avoir à chercher pendant des heures.`,
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

function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

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
            <div style={{ fontSize: 11, color: '#4A5568' }}>Tapoter pour fermer</div>
          </div>
          <div style={{ fontSize: 13, color: '#9AA3B0', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{answer}</div>
        </div>
      )}
    </div>
  );
}

export default function PageFAQ() {
  const [legalOuvert, setLegalOuvert] = useState(null);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 40px' }}>
      <FAQSchema />

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#4FFFA0', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>FAQ</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: 'Inter, sans-serif' }}>Questions fréquentes</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FAQS.map((faq) => (
          <FlipCard key={faq.num} {...faq} />
        ))}
      </div>

      {/* SECTION CONTACT */}
      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#4FFFA0', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>Me contacter</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Gmail (prochainement) */}
          <div style={{
            background: '#111318',
            border: '1px solid #1A1E2A',
            borderRadius: 16,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            opacity: 0.5,
            cursor: 'not-allowed'
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'grayscale(0.4)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6.5C2 5.67 2.67 5 3.5 5h17C21.33 5 22 5.67 22 6.5v11c0 .83-.67 1.5-1.5 1.5h-17C2.67 19 2 18.33 2 17.5v-11z" fill="white" opacity="0.15"/>
                <path d="M2 7l10 7 10-7" stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none"/>
                <path d="M2 6.5L12 13l10-6.5" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Envoyer un mail</div>
              <div style={{ fontSize: 12, color: '#3aff6e', fontWeight: 600 }}>🕐 Prochainement</div>
            </div>
          </div>

          {/* Instagram */}
          <a 
            href="https://www.instagram.com/parrain_4p?igsh=MXBnN2Z2bzdvM3Z6cg%3D%3D&utm_source=qr" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              background: '#111318',
              border: '1px solid #1A1E2A',
              borderRadius: 16,
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="white" stroke-width="1.8" fill="none"/>
                <circle cx="12" cy="12" r="4.2" stroke="white" stroke-width="1.8" fill="none"/>
                <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Instagram</div>
              <div style={{ fontSize: 12, color: '#9AA3B0' }}>Message direct</div>
            </div>
            <div style={{ color: '#4A5568', fontSize: 20 }}>›</div>
          </a>

        </div>
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
