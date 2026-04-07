import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';

// ─── CONFIGURATION LOGOS ──────────────────────────────────────────────────────
const LOGO_DOMAINS = {
  hellobank: 'hellobank.fr',
  joko:      'joko.com',
  okx:       'okx.com',
  veracash:  'veracash.com',
  robinhood: 'robinhood.com',
  winamax:   'winamax.fr',
  betsson:   'betsson.fr',
  Unibet:    'unibet.fr',
  engie:     'engie.fr',
  nordvpn:   'nordvpn.com',
  myfin:     'myfin.eu',
};

function LogoOffre({ id, emoji, couleur, size = 44, borderRadius = 12 }) {
  const [error, setError] = useState(false);
  const domain = LOGO_DOMAINS[id];

  const wrapperStyle = {
    width: size,
    height: size,
    borderRadius,
    background: couleur + '22',
    border: '1.5px solid ' + couleur,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  };

  if (!domain || error) {
    return (
      <div style={{ ...wrapperStyle, fontSize: size * 0.5 }}>
        {emoji}
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <img
        src={`https://img.logo.dev/${domain}?token=pk_BXZXZrJITlWofFOzS8oAoA&size=128`} 
        alt={id}
        onError={(e) => {
           e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
           setError(false);
        }}
        style={{ width: '80%', height: '80%', objectFit: 'contain' }}
      />
    </div>
  );
}

// ─── DONNÉES PARRAINAGE ────────────────────────────────────────────────────────
const OFFRES = [
  {
    id: 'hellobank',
    nom: "Hello Bank",
    categorie: "Banque",
    emoji: "🏦",
    couleur: '#00B4FF',
    bonus: "80€",
    bonusFilleul: "40€ + 40€",
    bonusParrain: "80€",
    description: "Ouvre un compte Hello One et reçois 40€ sans dépôt, puis 40€ de plus dès le 10e achat carte.",
    conditions: [
      "Première ouverture d’un compte de dépôt Hello One",
      "40€ offerts sans dépôt minimum",
      "40€ supplémentaires au 10e achat carte bancaire",
    ],
    type: 'contact',
    contact: '@parrain_4p',
    note: "Pour recevoir ton invitation, envoie ton prénom + adresse email sur Instagram",
    shareText: "Ouvre un compte Hello Bank et reçois 80€ ! Contacte @parrain_4p sur Instagram.",
    shareUrl: 'https://parrain-4p.vercel.app',
  },
  {
    id: 'joko',
    nom: "Joko",
    categorie: "Cashback",
    emoji: "💸",
    couleur: '#FF6B35',
    bonus: "1€ + cashback",
    bonusFilleul: "1€ à l’inscription",
    bonusParrain: "3€ + 10% du cashback filleul",
    description: "Joko transforme tes achats quotidiens en micro-économies automatiques en connectant ton compte bancaire.",
    conditions: [
      "Télécharger l’app Joko et utilise mon code de parrainage",
      "Connecte ton compte bancaire",
      "1€ offerts à l’inscription",
      "Délai : instantané",
    ],
    type: 'code',
    code: 'skevdw',
    shareText: "Rejoins Joko avec mon code skevdw et gagne 1€ + du cashback automatique !",
    shareUrl: 'https://parrain-4p.vercel.app',
  },
  {
    id: 'okx',
    nom: "OKX",
    categorie: "Crypto",
    emoji: "₿",
    couleur: '#0052FF',
    bonus: "40€",
    bonusFilleul: "40€ en Bitcoin",
    bonusParrain: "60€",
    description: "OKX est la plateforme de référence pour acheter, vendre et stocker des cryptomonnaies en toute sécurité.",
    conditions: [
      "S’inscrire via le lien de parrainage",
      "Valider son identité (KYC)",
      "Déposer 200€",
      "Acheter 200€ de Bitcoin (BTC)",
      "Reçois 40€ de Bitcoin après 24h — retirable intégralement",
    ],
    type: 'lien',
    lien: 'https://my.okx.com/fr-fr/join/90527625',
    shareText: "Inscris-toi sur OKX via mon lien et reçois 40€ en Bitcoin !",
    shareUrl: 'https://my.okx.com/fr-fr/join/90527625',
  },
  {
    id: 'veracash',
    nom: "VeraCash",
    categorie: "Or & Épargne",
    emoji: "🥇",
    couleur: '#FFD700',
    bonus: "10€ parrain",
    bonusFilleul: "Frais réduits",
    bonusParrain: "10€",
    description: "VeraCash permet d’épargner et payer avec de l’or et de l’argent physique. Une alternative solide aux banques classiques.",
    conditions: [
      "S’inscrire via le lien de parrainage",
      "Vérifier son identité",
      "Déposer 10€ (retirable immédiatement)",
    ],
    type: 'lien',
    lien: 'https://www.veracash.com/fr/inscription?sponsorMemberPseudo=DEVOMIZO',
    shareText: "Épargne en or avec VeraCash ! Inscris-toi via mon lien pour des frais réduits à vie.",
    shareUrl: 'https://www.veracash.com/fr/inscription?sponsorMemberPseudo=DEVOMIZO',
  },
  {
    id: 'robinhood',
    nom: "Robinhood",
    categorie: "Crypto Exchange",
    emoji: "🏹",
    couleur: '#00C805',
    bonus: "10€",
    bonusFilleul: "10€",
    bonusParrain: "10€",
    description: "Robinhood est un exchange crypto simple et intuitif pour acheter et vendre des cryptomonnaies sans frais cachés.",
    conditions: [
      "S’inscrire via le lien de parrainage",
      "Valider son identité",
      "Déposer 10€ (retirable immédiatement)",
      "Délai : 6 mois",
    ],
    type: 'lien',
    lien: 'https://join.robinhood.com/eu_crypto/leot-ad308a260/',
    shareText: "Rejoins Robinhood et reçois 10€ ! Dépôt retirable immédiatement.",
    shareUrl: 'https://join.robinhood.com/eu_crypto/leot-ad308a260/',
  },
  {
    id: 'winamax',
    nom: "Winamax",
    categorie: "Paris Sportifs",
    emoji: "⚽",
    couleur: '#E8002D',
    bonus: "40€",
    bonusFilleul: "40€",
    bonusParrain: "40€",
    description: "Winamax est la référence des paris sportifs en France. Inscris-toi avec le code parrainage et reçois 40€.",
    conditions: [
      "S’inscrire avec le code parrainage",
      "Valider son inscription",
      "Déposer 10€",
    ],
    type: 'code',
    code: 'LTZXVU',
    shareText: "Inscris-toi sur Winamax avec le code LTZXVU et reçois 40€ !",
    shareUrl: 'https://parrain-4p.vercel.app',
  },
  {
    id: 'betsson',
    nom: "Betsson",
    categorie: "Paris Sportifs",
    emoji: "🎯",
    couleur: '#FF4500',
    bonus: "10€ Betboost",
    bonusFilleul: "10€ Betboost",
    bonusParrain: "10€ Betboost",
    description: "Betsson est une plateforme de paris sportifs internationale. Reçois 10€ Betboost en parrainant.",
    conditions: [
      "S’inscrire via le lien",
      "Vérifier son compte",
      "Déposer 10€",
    ],
    type: 'lien',
    lien: 'https://betsson.fr/fr/%23register?language=fr&referralCode=8LAFsK',
    shareText: "Inscris-toi sur Betsson via mon lien et reçois 10€ Betboost !",
    shareUrl: 'https://betsson.fr/fr/%23register?language=fr&referralCode=8LAFsK',
  },
  {
    id: 'Unibet',
    nom: "Unibet",
    categorie: "Paris Sportifs",
    emoji: "💰",
    couleur: '#FF4500',
    bonus: "30€",
    bonusFilleul: "30€ Freebets",
    bonusParrain: "30€ Freebets",
    description: "Unibet est une plateforme de paris sportifs internationale. Reçois 30€.",
    conditions: [
      "S’inscrire via le lien",
      "Vérifier son compte",
      "Déposer 10€",
    ],
    type: 'lien',
    lien: 'https://www.unibet.fr/inscription/?campaign=240326&parrain=AC1330D7A4D09111',
    shareText: "Inscris-toi sur Unibet via mon lien et reçois 30€ en Freebets !",
    shareUrl: 'https://www.unibet.fr/inscription/?campaign=240326&parrain=AC1330D7A4D09111',
  },
  {
    id: 'engie',
    nom: "Engie",
    categorie: "Énergie",
    emoji: "⚡",
    couleur: '#00B4FF',
    bonus: "20€",
    bonusFilleul: "20€ sur ta première facture",
    bonusParrain: "20€ sur la prochaine facture",
    description: "Groupe énergétique axé sur les énergies renouvelables.",
    conditions: [
      "S’inscrire avec le code de parrainage",
      "Souscription d’une offre électricité ou gaz naturel",
    ],
    type: 'code',
    code: 'ZUA255872',
    shareText: "Rejoins Engie avec mon code parrainage !",
    shareUrl: 'https://parrain-4p.vercel.app',
  },
  {
    id: 'nordvpn',
    nom: "NordVPN",
    categorie: "VPN",
    emoji: "🔒",
    couleur: '#4687FF',
    bonus: "1 à 3 Mois",
    bonusFilleul: "1 à 3 mois offerts",
    bonusParrain: "3 mois offerts",
    description: "Protégez votre vie privée avec le VPN leader du marché.",
    conditions: [
      "S’inscrire via le lien de parrainage",
      "Souscription abonnement 1 an : 3 mois offerts",
      "Souscription abonnement mensuel : 1 mois offert",
    ],
    type: 'lien',
    lien: 'https://refer-nordvpn.com/jFCxwAkTEVV',
    shareText: "Protège ta connexion avec NordVPN via mon lien !",
    shareUrl: 'https://parrain-4p.vercel.app',
  },
  {
    id: 'myfin',
    nom: "Myfin",
    categorie: "Banque",
    emoji: "💳",
    couleur: '#22c55e',
    bonus: "10€",
    bonusFilleul: "10€",
    bonusParrain: "10€",
    description: "Solution digitale de gestion financière personnelle.",
    conditions: [
      "S’inscrire avec le code parrainage",
      "Vérifier son compte",
      "Déposer 10€",
      "Utiliser la carte virtuelle et déposer 10 euros sur Betclic",
      "Retirer tes 10€ sur Betclic",
    ],
    type: 'code',
    code: 'LE00BB5I',
    shareText: "Rejoins Myfin via mon lien !",
    shareUrl: 'https://parrain-4p.vercel.app',
  },
];

const CATEGORIES = ['Tout', 'Énergie', 'Banque', 'Cashback', 'Crypto', 'Or & Épargne', 'Crypto Exchange', 'Paris Sportifs'];

const STRIPE_LINK = 'https://buy.stripe.com/14A8wPadZ2MmbRF0A4a3u00';
const TAUX_OPTIONS = [
  { label: "Auto-entrepreneur - Prestation de services (21.2%)", value: 21.2 },
  { label: "Auto-entrepreneur - Vente de marchandises (12.8%)", value: 12.8 },
  { label: "EIRL / EI au réel (estimation 45%)", value: 45 },
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
    marginBottom: '10px'
  };

  return (
    <div style={{ background: '#111318', border: '1px solid #4FFFA0', borderRadius: 16, padding: '20px', marginTop: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: '#4FFFA0', marginBottom: 8 }}>🏆 Challenge 3-en-1</h3>
        <p style={{ fontSize: 12, color: '#8A95AA' }}>Complète 3 offres et reçois <strong style={{color: '#4FFFA0'}}>10€ de bonus</strong> de ma part !</p>
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
            📸 N’oublie pas d’envoyer tes 3 preuves sur <a href="https://www.instagram.com/parrain_4p?igsh=MXBnN2Z2bzdvM3Z6cg%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" style={{color: '#4FFFA0', fontWeight: 'bold'}}>Instagram</a> pour valider le virement.
          </p>
        </div>

        <button type="submit" style={{ width: '100%', background: '#4FFFA0', border: 'none', borderRadius: 8, color: '#0A0B0F', fontWeight: 800, padding: '12px', cursor: 'pointer', fontSize: '14px' }}>
          Envoyer ma demande
        </button>
      </form>
    </div>
  );
}

function PageParrainage() {
  const [filtre, setFiltre] = useState('Tout');
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);

  const filtrees = filtre === 'Tout' ? OFFRES : OFFRES.filter(o => o.categorie === filtre);

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
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#4FFFA0', fontSize: 14, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Retour
        </button>
        <div style={{ background: '#111318', borderRadius: 20, padding: '24px 20px', border: '1px solid #1A1E2A', marginBottom: 16 }}>
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
              <button onClick={() => copier(o.code)} style={{ marginTop: 10, background: '#4FFFA0', border: 'none', borderRadius: 8, color: '#0A0B0F', fontSize: 13, fontWeight: 700, padding: '8px 20px', cursor: 'pointer' }}>
                {copied ? "Copié !" : "Copier le code"}
              </button>
            </div>
          )}
          {o.type === 'lien' && o.lien !== '#' && (
            <a href={o.lien} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #4FFFA0, #2ECC71)', borderRadius: 12, color: '#0A0B0F', fontSize: 15, fontWeight: 800, padding: '14px', textDecoration: 'none' }}>
              S’inscrire avec mon lien →
            </a>
          )}
          {o.type === 'contact' && (
            <div style={{ background: '#0A0B0F', borderRadius: 12, padding: '16px', border: '1px dashed #4FFFA0', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#8A95AA', marginBottom: 8, lineHeight: 1.5 }}>{o.note}</div>
              <a href={'https://instagram.com/' + o.contact.replace('@', '')} target="_blank" rel="noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F56040)', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 800, padding: '12px 24px', textDecoration: 'none' }}>
                Me contacter sur Instagram {o.contact}
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
      <div style={{ marginBottom: 16, overflowX: 'auto', display: 'flex', gap: 8, paddingBottom: 4 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFiltre(cat)} style={{ background: filtre === cat ? '#4FFFA0' : '#111318', border: '1px solid ' + (filtre === cat ? '#4FFFA0' : '#1A1E2A'), borderRadius: 20, color: filtre === cat ? '#0A0B0F' : '#8A95AA', fontSize: 12, fontWeight: 700, padding: '6px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {cat}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtrees.map(o => (
          <button key={o.id} onClick={() => setSelected(o)} style={{ background: '#111318', border: '1px solid #1A1E2A', borderRadius: 16, padding: '16px 12px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s' }}>
            <div style={{ marginBottom: 10 }}>
              <LogoOffre id={o.id} emoji={o.emoji} couleur={o.couleur} size={44} borderRadius={12} />
            </div>
            <div style={{ fontSize: 10, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{o.categorie}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#E8EDF5', marginBottom: 6 }}>{o.nom}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: o.couleur }}>{o.bonus}</div>
          </button>
        ))}
      </div>
      <FormulaireChallenge />
    </div>
  );
}

function PageAvis() {
  const avis = [
    { nom: "Lucas", date: "Il y a 2 jours", texte: "Super rapide pour Hello Bank, j’ai reçu mes 80€ comme prévu ! 🔥", note: "⭐⭐⭐⭐⭐" },
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
          <p style={{ fontSize: 14, color: '#8A95AA', lineHeight: 1.5 }}>“{a.texte}”</p>
        </div>
      ))}
    </div>
  );
}

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
        <div style={{ fontSize: 11, color: '#4A5568', marginTop: 4 }}>Coût main d’œuvre : <span style={{ color: '#8A95AA' }}>{fmt(res.coutMain)}</span></div>
      </Section>
      <Section title="FISCALITÉ" icon="🏛️">
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <select value={fields.tauxOption} onChange={(e) => setFields((prev) => ({ ...prev, tauxOption: e.target.value }))}
            style={{ width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 8, color: '#E8EDF5', fontSize: 13, padding: '10px 12px', outline: 'none', cursor: 'pointer' }}>
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
          <button onClick={handlePDFClick} style={{ width: '100%', background: pdfPaid ? 'linear-gradient(135deg, #4FFFA0, #2ECC71)' : '#111318', border: '2px solid #4FFFA0', borderRadius: 12, color: pdfPaid ? '#0A0B0F' : '#4FFFA0', fontSize: 14, fontWeight: 800, padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {pdfPaid ? "Télécharger mon Bilan PDF" : "Télécharger le Bilan PDF - 2,00 €"}
          </button>
        </div>
      )}
      {res.prixVente === 0 && (
        <div style={{ textAlign: 'center', padding: '30px 20px', color: '#2E3545' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
          <p style={{ fontSize: 14 }}>Renseignez votre prix de vente pour voir les résultats.</p>
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
            <button onClick={handlePay} style={{ width: '100%', background: 'linear-gradient(135deg, #4FFFA0, #2ECC71)', border: 'none', borderRadius: 12, color: '#0A0B0F', fontSize: 16, fontWeight: 800, padding: '15px', cursor: 'pointer' }}>
              Payer et Télécharger
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [onglet, setOnglet] = useState('parrainage');

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `* { margin: 0; padding: 0; box-sizing: border-box; }  body { background: #0A0B0F; color: #E8EDF5; font-family: sans-serif; }  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }  select { -webkit-appearance: none; appearance: none; }  ::-webkit-scrollbar { width: 4px; height: 4px; }  ::-webkit-scrollbar-track { background: #0A0B0F; }  ::-webkit-scrollbar-thumb { background: #1E2230; border-radius: 2px; }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0B0F', paddingBottom: 80 }}>
      <div style={{ background: 'linear-gradient(180deg, #111318 0%, #0A0B0F 100%)', borderBottom: '1px solid #1A1E2A', padding: '18px 20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: '#4FFFA0', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>HUB FINANCIER</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, background: 'linear-gradient(90deg, #4FFFA0, #A8FFD8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Parrain 4P
        </h1>
        <p style={{ color: '#4A5568', fontSize: 12, marginTop: 2 }}>Parrainages + Calculateur de Rentabilité</p>
      </div>
      {onglet === 'parrainage' && <PageParrainage />}
      {onglet === 'avis' && <PageAvis />}
      {onglet === 'calculateur' && <PageProfitMaster />}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111318', borderTop: '1px solid #1A1E2A', display: 'flex', zIndex: 100 }}>
        <button onClick={() => setOnglet('parrainage')} style={{ flex: 1, background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 20 }}>🎁</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: onglet === 'parrainage' ? '#4FFFA0' : '#4A5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Parrainages</span>
          {onglet === 'parrainage' && <div style={{ width: 20, height: 2, background: '#4FFFA0', borderRadius: 1 }} />}
        </button>
        <button onClick={() => setOnglet('avis')} style={{ flex: 1, background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 20 }}>⭐</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: onglet === 'avis' ? '#4FFFA0' : '#4A5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avis</span>
          {onglet === 'avis' && <div style={{ width: 20, height: 2, background: '#4FFFA0', borderRadius: 1 }} />}
        </button>
        <button onClick={() => setOnglet('calculateur')} style={{ flex: 1, background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 20 }}>📊</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: onglet === 'calculateur' ? '#4FFFA0' : '#4A5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Calculateur</span>
          {onglet === 'calculateur' && <div style={{ width: 20, height: 2, background: '#4FFFA0', borderRadius: 1 }} />}
        </button>
      </div>
      <SpeedInsights />
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
