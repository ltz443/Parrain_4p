import React, { useState, useEffect, useCallback } from ‘react’;
import { createRoot } from ‘react-dom/client’;

// ─── DONNÉES PARRAINAGE ────────────────────────────────────────────────────────
const OFFRES = [
{
id: ‘hellobank’,
nom: ‘Hello Bank’,
categorie: ‘Banque’,
emoji: ‘🏦’,
couleur: ‘#00B4FF’,
bonus: ‘80€’,
bonusFilleul: ‘40€ + 40€’,
bonusParrain: ‘80€’,
description: ‘Ouvre un compte Hello One et recois 40€ sans depot, puis 40€ de plus des le 10e achat carte.’,
conditions: [
‘1ere ouverture d un compte de depot Hello One’,
‘40€ offerts sans depot minimum’,
‘40€ supplementaires au 10e achat carte bancaire’,
‘Delai : 72 heures’,
],
type: ‘contact’,
contact: ‘@parrain_4p’,
note: ‘Pour recevoir ton invitation, envoie ton prenom + adresse email sur Instagram’,
shareText: ‘Ouvre un compte Hello Bank et recois 80€ ! Contacte @parrain_4p sur Instagram.’,
shareUrl: ‘https://parrain-4p.vercel.app’,
},
{
id: ‘joko’,
nom: ‘Joko’,
categorie: ‘Cashback’,
emoji: ‘💸’,
couleur: ‘#FF6B35’,
bonus: ‘1€ + cashback’,
bonusFilleul: ‘1€ a l inscription’,
bonusParrain: ‘3€ + 10% du cashback filleul’,
description: ‘Joko transforme tes achats quotidiens en micro-economies automatiques en connectant ton compte bancaire.’,
conditions: [
‘Telecharger l app Joko’,
‘Connecter son compte bancaire’,
‘1€ offert a l inscription avec le code’,
‘Delai : instantane’,
],
type: ‘code’,
code: ‘skevdw’,
shareText: ‘Rejoins Joko avec mon code skevdw et gagne 1€ + du cashback automatique !’,
shareUrl: ‘https://parrain-4p.vercel.app’,
},
{
id: ‘coinbase’,
nom: ‘Coinbase’,
categorie: ‘Crypto’,
emoji: ‘₿’,
couleur: ‘#0052FF’,
bonus: ‘20€’,
bonusFilleul: ‘20€ en Bitcoin’,
bonusParrain: ‘20€’,
description: ‘Coinbase est la plateforme de reference pour acheter, vendre et stocker des cryptomonnaies en toute securite.’,
conditions: [
‘S inscrire via le lien de parrainage’,
‘Valider son identite (KYC)’,
‘Deposer 20€’,
‘Acheter 20€ de Bitcoin (BTC)’,
‘Recois 20€ de Bitcoin apres 24h — retirable integralement’,
],
type: ‘lien’,
lien: ‘https://coinbase.com/join/954EBFS?src=ios-link’,
shareText: ‘Inscris-toi sur Coinbase via mon lien et recois 20€ en Bitcoin !’,
shareUrl: ‘https://coinbase.com/join/954EBFS?src=ios-link’,
},
{
id: ‘veracash’,
nom: ‘VeraCash’,
categorie: ‘Or & Epargne’,
emoji: ‘🥇’,
couleur: ‘#FFD700’,
bonus: ‘10€ parrain’,
bonusFilleul: ‘Frais reduits’,
bonusParrain: ‘10€’,
description: ‘VeraCash permet d epargner et payer avec de l or et de l argent physique. Une alternative solide aux banques classiques.’,
conditions: [
‘S inscrire via le lien de parrainage’,
‘Verifier son identite’,
‘Deposer 10€ (retirable immediatement)’,
‘Frais de gestion reduits a vie’,
],
type: ‘lien’,
lien: ‘https://www.veracash.com/fr/inscription?sponsorMemberPseudo=DEVOMIZO’,
shareText: ‘Epargne en or avec VeraCash ! Inscris-toi via mon lien pour des frais reduits a vie.’,
shareUrl: ‘https://www.veracash.com/fr/inscription?sponsorMemberPseudo=DEVOMIZO’,
},
{
id: ‘robinhood’,
nom: ‘Robinhood’,
categorie: ‘Crypto Exchange’,
emoji: ‘🏹’,
couleur: ‘#00C805’,
bonus: ‘10€’,
bonusFilleul: ‘10€’,
bonusParrain: ‘10€’,
description: ‘Robinhood est un exchange crypto simple et intuitif pour acheter et vendre des cryptomonnaies sans frais caches.’,
conditions: [
‘S inscrire via le lien de parrainage’,
‘Valider son identite’,
‘Deposer 10€ (retirable immediatement)’,
‘Delai : immediat’,
],
type: ‘lien’,
lien: ‘https://join.robinhood.com/eu_crypto/leot-ad308a260/’,
shareText: ‘Rejoins Robinhood et recois 10€ ! Depot retirable immediatement.’,
shareUrl: ‘https://join.robinhood.com/eu_crypto/leot-ad308a260/’,
},
{
id: ‘winamax’,
nom: ‘Winamax’,
categorie: ‘Paris Sportifs’,
emoji: ‘⚽’,
couleur: ‘#E8002D’,
bonus: ‘40€’,
bonusFilleul: ‘40€’,
bonusParrain: ‘40€’,
description: ‘Winamax est la reference des paris sportifs en France. Inscris-toi avec le code parrainage et recois 40€.’,
conditions: [
‘S inscrire avec le code parrainage’,
‘Valider son inscription’,
‘Deposer 10€’,
‘Prime filleul : 40€ — Prime parrain : 40€’,
],
type: ‘code’,
code: ‘LTZXVU’,
shareText: ‘Inscris-toi sur Winamax avec le code LTZXVU et recois 40€ !’,
shareUrl: ‘https://parrain-4p.vercel.app’,
},
{
id: ‘betsson’,
nom: ‘Betsson’,
categorie: ‘Paris Sportifs’,
emoji: ‘🎯’,
couleur: ‘#FF4500’,
bonus: ‘10€ Betboost’,
bonusFilleul: ‘10€ Betboost’,
bonusParrain: ‘10€ Betboost’,
description: ‘Betsson est une plateforme de paris sportifs internationale. Recois 10€ Betboost en parrainant.’,
conditions: [
‘S inscrire via le lien’,
‘Verifier son compte’,
‘Deposer 10€’,
‘Prime filleul : 10€ Betboost — Prime parrain : 10€ Betboost’,
],
type: ‘lien’,
lien: ‘https://betsson.fr/fr/%23register?language=fr&referralCode=8LAFsK’,
shareText: ‘Inscris-toi sur Betsson via mon lien et recois 10€ Betboost !’,
shareUrl: ‘https://betsson.fr/fr/%23register?language=fr&referralCode=8LAFsK’,
},
{
id: ‘Unibet’,
nom: ‘Unibet’,
categorie: ‘Paris Sportifs’,
emoji: ‘💰’,
couleur: ‘#FF4500’,
bonus: ‘30€’,
bonusFilleul: ‘30€ Freebets’,
bonusParrain: ‘30€ Freebets’,
description: ‘Unibet est une plateforme de paris sportifs internationale. Recois 30€.’,
conditions: [
‘S inscrire via le lien’,
‘Verifier son compte’,
‘Deposer 10€’,
‘Prime filleul : 30€ Freebets — Prime parrain : 30€ Freebets’,
],
type: ‘lien’,
lien: ‘https://www.unibet.fr/inscription/?campaign=240326&parrain=AC1330D7A4D09111’,
shareText: ‘Inscris-toi sur Unibet via mon lien et recois 30€ en Freebets !’,
shareUrl: ‘https://www.unibet.fr/inscription/?campaign=240326&parrain=AC1330D7A4D09111’,
},
];

const CATEGORIES = [‘Tout’, ‘Banque’, ‘Cashback’, ‘Crypto’, ‘Or & Epargne’, ‘Crypto Exchange’, ‘Paris Sportifs’];

const STRIPE_LINK = ‘https://buy.stripe.com/14A8wPadZ2MmbRF0A4a3u00’;
const TAUX_OPTIONS = [
{ label: ‘Auto-entrepreneur - Prestation de services (21.2%)’, value: 21.2 },
{ label: ‘Auto-entrepreneur - Vente de marchandises (12.8%)’, value: 12.8 },
{ label: ‘EIRL / EI au reel (estimation 45%)’, value: 45 },
{ label: ‘Personnalise’, value: null },
];

const fmt = (n) => new Intl.NumberFormat(‘fr-FR’, { style: ‘currency’, currency: ‘EUR’ }).format(n || 0);
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
let sante = ‘Deficitaire’;
if (marge >= 20) sante = ‘Rentable’;
else if (marge >= 0) sante = ‘Risque’;
return { prixVente, matieres, transport, outillage, autresFrais, coutMain, cotisations, totalCharges, beneficeNet, marge, sante };
}

function InputField({ label, value, onChange, placeholder, prefix, hint }) {
return (
<div style={{ marginBottom: 14 }}>
<label style={{ display: ‘block’, fontSize: 11, fontWeight: 600, color: ‘#8A95AA’, marginBottom: 5, textTransform: ‘uppercase’, letterSpacing: ‘0.06em’ }}>{label}</label>
<div style={{ position: ‘relative’ }}>
<span style={{ position: ‘absolute’, left: 12, top: ‘50%’, transform: ‘translateY(-50%)’, color: ‘#4FFFA0’, fontSize: 13, fontWeight: 700 }}>{prefix || ‘€’}</span>
<input
type=“number” min=“0” step=“0.01” value={value}
onChange={(e) => onChange(e.target.value)}
placeholder={placeholder || ‘0’}
inputMode=“decimal”
style={{ width: ‘100%’, background: ‘#0A0B0F’, border: ‘1.5px solid #1E2230’, borderRadius: 8, color: ‘#E8EDF5’, fontSize: 15, padding: ‘10px 12px 10px 30px’, outline: ‘none’, boxSizing: ‘border-box’, fontFamily: ‘monospace’ }}
/>
</div>
{hint && <p style={{ fontSize: 10, color: ‘#4A5568’, marginTop: 3 }}>{hint}</p>}
</div>
);
}

function Section({ title, icon, children }) {
return (
<div style={{ background: ‘#111318’, borderRadius: 14, padding: ‘18px 16px’, marginBottom: 12, border: ‘1px solid #1A1E2A’ }}>
<div style={{ display: ‘flex’, alignItems: ‘center’, gap: 8, marginBottom: 14 }}>
<span style={{ fontSize: 16 }}>{icon}</span>
<h3 style={{ fontSize: 13, fontWeight: 800, color: ‘#4FFFA0’, letterSpacing: ‘0.06em’ }}>{title}</h3>
</div>
{children}
</div>
);
}

// ─── CHECKLIST LOCALE ─────────────────────────────────────────────────────────
function Checklist({ offreId, conditions }) {
const storageKey = ‘checklist_’ + offreId;
const [checked, setChecked] = useState(() => {
try {
const saved = localStorage.getItem(storageKey);
return saved ? JSON.parse(saved) : {};
} catch (e) {
return {};
}
});

const toggle = (i) => {
const next = { …checked, [i]: !checked[i] };
setChecked(next);
try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch (e) {}
};

const total = conditions.length;
const done = Object.values(checked).filter(Boolean).length;

return (
<div style={{ marginBottom: 20 }}>
<div style={{ display: ‘flex’, justifyContent: ‘space-between’, alignItems: ‘center’, marginBottom: 10 }}>
<div style={{ fontSize: 12, fontWeight: 700, color: ‘#4FFFA0’, textTransform: ‘uppercase’, letterSpacing: ‘0.06em’ }}>Ma progression</div>
<div style={{ fontSize: 11, color: done === total ? ‘#4FFFA0’ : ‘#8A95AA’, fontWeight: 700 }}>{done}/{total}</div>
</div>
<div style={{ background: ‘#0A0B0F’, borderRadius: 6, height: 4, marginBottom: 12, overflow: ‘hidden’ }}>
<div style={{ background: ‘#4FFFA0’, height: ‘100%’, width: (done / total * 100) + ‘%’, borderRadius: 6, transition: ‘width 0.3s ease’ }} />
</div>
{conditions.map((c, i) => (
<div key={i} onClick={() => toggle(i)} style={{ display: ‘flex’, gap: 10, alignItems: ‘flex-start’, marginBottom: 10, cursor: ‘pointer’ }}>
<div style={{ width: 20, height: 20, borderRadius: 6, border: ’2px solid ’ + (checked[i] ? ‘#4FFFA0’ : ‘#1E2230’), background: checked[i] ? ‘#4FFFA0’ : ‘transparent’, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’, flexShrink: 0, marginTop: 1, transition: ‘all 0.2s’ }}>
{checked[i] && <span style={{ fontSize: 11, color: ‘#0A0B0F’, fontWeight: 900 }}>✓</span>}
</div>
<span style={{ fontSize: 13, color: checked[i] ? ‘#4A5568’ : ‘#8A95AA’, lineHeight: 1.5, textDecoration: checked[i] ? ‘line-through’ : ‘none’ }}>{c}</span>
</div>
))}
{done === total && (
<div style={{ background: ‘rgba(79,255,160,0.1)’, border: ‘1px solid #4FFFA0’, borderRadius: 10, padding: ‘10px’, textAlign: ‘center’, marginTop: 8 }}>
<span style={{ fontSize: 13, color: ‘#4FFFA0’, fontWeight: 800 }}>🎉 Toutes les etapes completees !</span>
</div>
)}
</div>
);
}

// ─── BOUTON PARTAGE ───────────────────────────────────────────────────────────
function BoutonPartage({ offre }) {
const partager = async () => {
if (navigator.share) {
try {
await navigator.share({
title: offre.nom + ’ — ’ + offre.bonus,
text: offre.shareText,
url: offre.shareUrl,
});
} catch (e) {}
} else {
try {
await navigator.clipboard.writeText(offre.shareText + ’ ’ + offre.shareUrl);
alert(‘Lien copie !’);
} catch (e) {}
}
};

return (
<button onClick={partager} style={{ width: ‘100%’, background: ‘#0A0B0F’, border: ‘1.5px solid #1E2230’, borderRadius: 12, color: ‘#8A95AA’, fontSize: 14, fontWeight: 700, padding: ‘12px’, cursor: ‘pointer’, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’, gap: 8, marginTop: 10 }}>
<span style={{ fontSize: 16 }}>📤</span> Partager cette offre
</button>
);
}

// ─── PAGE PARRAINAGE ──────────────────────────────────────────────────────────
function PageParrainage() {
const [filtre, setFiltre] = useState(‘Tout’);
const [selected, setSelected] = useState(null);
const [copied, setCopied] = useState(false);

const filtrees = filtre === ‘Tout’ ? OFFRES : OFFRES.filter(o => o.categorie === filtre);

const copier = (texte) => {
navigator.clipboard.writeText(texte).then(() => {
setCopied(true);
setTimeout(() => setCopied(false), 2000);
});
};

if (selected) {
const o = selected;
return (
<div style={{ maxWidth: 480, margin: ‘0 auto’, padding: ‘16px’ }}>
<button onClick={() => setSelected(null)} style={{ background: ‘none’, border: ‘none’, color: ‘#4FFFA0’, fontSize: 14, cursor: ‘pointer’, marginBottom: 16, display: ‘flex’, alignItems: ‘center’, gap: 6 }}>
← Retour
</button>
<div style={{ background: ‘#111318’, borderRadius: 20, padding: ‘24px 20px’, border: ‘1px solid #1A1E2A’, marginBottom: 16 }}>
<div style={{ display: ‘flex’, alignItems: ‘center’, gap: 14, marginBottom: 16 }}>
<div style={{ width: 56, height: 56, borderRadius: 16, background: o.couleur + ‘22’, border: ’2px solid ’ + o.couleur, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’, fontSize: 26 }}>{o.emoji}</div>
<div>
<div style={{ fontSize: 11, color: ‘#4A5568’, textTransform: ‘uppercase’, letterSpacing: ‘0.08em’ }}>{o.categorie}</div>
<h2 style={{ fontSize: 22, fontWeight: 900, color: ‘#E8EDF5’ }}>{o.nom}</h2>
</div>
</div>
<p style={{ fontSize: 14, color: ‘#8A95AA’, lineHeight: 1.6, marginBottom: 20 }}>{o.description}</p>
<div style={{ display: ‘grid’, gridTemplateColumns: ‘1fr 1fr’, gap: 10, marginBottom: 20 }}>
<div style={{ background: ‘#0A0B0F’, borderRadius: 10, padding: ‘12px’, textAlign: ‘center’, border: ‘1px solid #1A1E2A’ }}>
<div style={{ fontSize: 10, color: ‘#4A5568’, textTransform: ‘uppercase’, marginBottom: 4 }}>Tu gagnes</div>
<div style={{ fontSize: 20, fontWeight: 900, color: ‘#4FFFA0’ }}>{o.bonusParrain}</div>
</div>
<div style={{ background: ‘#0A0B0F’, borderRadius: 10, padding: ‘12px’, textAlign: ‘center’, border: ‘1px solid #1A1E2A’ }}>
<div style={{ fontSize: 10, color: ‘#4A5568’, textTransform: ‘uppercase’, marginBottom: 4 }}>Filleul recoit</div>
<div style={{ fontSize: 20, fontWeight: 900, color: ‘#E8EDF5’ }}>{o.bonusFilleul}</div>
</div>
</div>

```
      {/* CHECKLIST INTERACTIVE */}
      <Checklist offreId={o.id} conditions={o.conditions} />

      {o.type === 'code' && (
        <div style={{ background: '#0A0B0F', borderRadius: 12, padding: '16px', marginBottom: 12, border: '1px dashed #4FFFA0', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 6, textTransform: 'uppercase' }}>Code parrainage</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#4FFFA0', fontFamily: 'monospace', letterSpacing: '0.1em' }}>{o.code}</div>
          <button onClick={() => copier(o.code)} style={{ marginTop: 10, background: '#4FFFA0', border: 'none', borderRadius: 8, color: '#0A0B0F', fontSize: 13, fontWeight: 700, padding: '8px 20px', cursor: 'pointer' }}>
            {copied ? 'Copie !' : 'Copier le code'}
          </button>
        </div>
      )}
      {o.type === 'lien' && o.lien !== '#' && (
        <a href={o.lien} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #4FFFA0, #2ECC71)', borderRadius: 12, color: '#0A0B0F', fontSize: 15, fontWeight: 800, padding: '14px', textDecoration: 'none' }}>
          S inscrire avec mon lien →
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

      {/* BOUTON PARTAGE */}
      <BoutonPartage offre={o} />
    </div>
  </div>
);
```

}

return (
<div style={{ maxWidth: 480, margin: ‘0 auto’, padding: ‘16px’ }}>
<div style={{ marginBottom: 16, overflowX: ‘auto’, display: ‘flex’, gap: 8, paddingBottom: 4 }}>
{CATEGORIES.map(cat => (
<button key={cat} onClick={() => setFiltre(cat)} style={{ background: filtre === cat ? ‘#4FFFA0’ : ‘#111318’, border: ’1px solid ’ + (filtre === cat ? ‘#4FFFA0’ : ‘#1A1E2A’), borderRadius: 20, color: filtre === cat ? ‘#0A0B0F’ : ‘#8A95AA’, fontSize: 12, fontWeight: 700, padding: ‘6px 14px’, cursor: ‘pointer’, whiteSpace: ‘nowrap’ }}>
{cat}
</button>
))}
</div>
<div style={{ display: ‘grid’, gridTemplateColumns: ‘1fr 1fr’, gap: 12 }}>
{filtrees.map(o => (
<button key={o.id} onClick={() => setSelected(o)} style={{ background: ‘#111318’, border: ‘1px solid #1A1E2A’, borderRadius: 16, padding: ‘16px 12px’, cursor: ‘pointer’, textAlign: ‘left’, transition: ‘border-color 0.2s’ }}>
<div style={{ width: 44, height: 44, borderRadius: 12, background: o.couleur + ‘22’, border: ’1.5px solid ’ + o.couleur, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’, fontSize: 22, marginBottom: 10 }}>{o.emoji}</div>
<div style={{ fontSize: 10, color: ‘#4A5568’, textTransform: ‘uppercase’, letterSpacing: ‘0.06em’, marginBottom: 3 }}>{o.categorie}</div>
<div style={{ fontSize: 15, fontWeight: 800, color: ‘#E8EDF5’, marginBottom: 6 }}>{o.nom}</div>
<div style={{ fontSize: 13, fontWeight: 900, color: o.couleur }}>{o.bonus}</div>
</button>
))}
</div>

```
  {/* ─── NEWSLETTER ─── */}
  <div style={{ background: '#111318', border: '1px solid #1A1E2A', borderRadius: 16, padding: '20px', marginTop: 24, textAlign: 'center' }}>
    <h3 style={{ fontSize: 16, fontWeight: 900, color: '#4FFFA0', marginBottom: 8 }}>Newsletter Exclue 📥</h3>
    <p style={{ fontSize: 12, color: '#8A95AA', marginBottom: 16 }}>Reçois les nouveaux bons plans avant tout le monde.</p>
    <div style={{ display: 'flex', gap: 8 }}>
      <input type="email" placeholder="Ton email..." style={{ flex: 1, background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 8, color: '#FFF', padding: '10px 12px', outline: 'none' }} />
      <button style={{ background: '#4FFFA0', border: 'none', borderRadius: 8, color: '#0A0B0F', fontWeight: 800, padding: '0 16px', cursor: 'pointer' }}>OK</button>
    </div>
  </div>
</div>
```

);
}

// ─── PAGE AVIS ──────────────────────────────────────────────────────────────
function PageAvis() {
const avis = [
{ nom: “Lucas”, date: “Il y a 2 jours”, texte: “Super rapide pour Hello Bank, j’ai reçu mes 80€ comme prévu ! 🔥”, note: “⭐⭐⭐⭐⭐” },
{ nom: “Sarah”, date: “La semaine dernière”, texte: “Le calculateur ProfitMaster est bluffant de précision.”, note: “⭐⭐⭐⭐⭐” },
{ nom: “Tom”, date: “Il y a 1 mois”, texte: “Déjà 120€ de gains cumulés grâce aux offres crypto. Top !”, note: “⭐⭐⭐⭐⭐” }
];

return (
<div style={{ maxWidth: 480, margin: ‘0 auto’, padding: ‘16px’ }}>
<h2 style={{ fontSize: 20, fontWeight: 900, color: ‘#4FFFA0’, marginBottom: 20, textAlign: ‘center’ }}>Avis de la Communauté</h2>
{avis.map((a, i) => (
<div key={i} style={{ background: ‘#111318’, border: ‘1px solid #1A1E2A’, borderRadius: 16, padding: ‘16px’, marginBottom: 12 }}>
<div style={{ display: ‘flex’, justifyContent: ‘space-between’, marginBottom: 8 }}>
<span style={{ fontWeight: 800, color: ‘#E8EDF5’ }}>{a.nom}</span>
<span style={{ fontSize: 12, color: ‘#4A5568’ }}>{a.date}</span>
</div>
<div style={{ color: ‘#FFD700’, fontSize: 12, marginBottom: 8 }}>{a.note}</div>
<p style={{ fontSize: 14, color: ‘#8A95AA’, lineHeight: 1.5 }}>”{a.texte}”</p>
</div>
))}
</div>
);
}

// ─── PAGE PROFITMASTER ────────────────────────────────────────────────────────
function PageProfitMaster() {
const [fields, setFields] = useState({
prixVente: ‘’, matieres: ‘’, transport: ‘’, outillage: ‘’, autresFrais: ‘’,
heures: ‘’, tauxHoraire: ‘’, tauxCotisations: ‘21.2’, tauxPersonnalise: ‘’, tauxOption: ‘21.2’,
});
const [showPaywall, setShowPaywall] = useState(false);
const [pdfPaid, setPdfPaid] = useState(false);
const setField = (key) => (val) => setFields((prev) => ({ …prev, [key]: val }));
const res = calcul(fields);

useEffect(() => {
const params = new URLSearchParams(window.location.search);
if (params.get(‘paid’) === ‘true’) setPdfPaid(true);
}, []);

const handlePDFClick = useCallback(() => {
if (pdfPaid) alert(‘Fonctionnalite PDF disponible’);
else setShowPaywall(true);
}, [pdfPaid]);

const handlePay = () => {
window.open(STRIPE_LINK, ‘_blank’);
setShowPaywall(false);
};

const tauxActuel = fields.tauxOption === ‘custom’ ? (parseFloat(fields.tauxPersonnalise) || 0) : parseFloat(fields.tauxOption);
useEffect(() => {
setFields((prev) => ({ …prev, tauxCotisations: String(tauxActuel) }));
}, [tauxActuel]);

return (
<div style={{ maxWidth: 480, margin: ‘0 auto’, padding: ‘16px’ }}>
<Section title="REVENUS" icon="💰">
<InputField label=“Prix de vente estime” value={fields.prixVente} onChange={setField(‘prixVente’)} hint=“Le montant facture au client” />
</Section>
<Section title="COUTS DIRECTS" icon="📦">
<InputField label=“Matieres premieres” value={fields.matieres} onChange={setField(‘matieres’)} />
<InputField label=“Transport / Essence” value={fields.transport} onChange={setField(‘transport’)} />
<InputField label=“Outillage” value={fields.outillage} onChange={setField(‘outillage’)} />
<InputField label=“Autres frais” value={fields.autresFrais} onChange={setField(‘autresFrais’)} />
</Section>
<Section title="TEMPS PASSE" icon="🕐">
<div style={{ display: ‘grid’, gridTemplateColumns: ‘1fr 1fr’, gap: 10 }}>
<InputField label=“Heures” prefix=“h” value={fields.heures} onChange={setField(‘heures’)} />
<InputField label=“Taux/heure” value={fields.tauxHoraire} onChange={setField(‘tauxHoraire’)} />
</div>
<div style={{ fontSize: 11, color: ‘#4A5568’, marginTop: 4 }}>Cout main oeuvre : <span style={{ color: ‘#8A95AA’ }}>{fmt(res.coutMain)}</span></div>
</Section>
<Section title="FISCALITE" icon="🏛️">
<div style={{ position: ‘relative’, marginBottom: 12 }}>
<select value={fields.tauxOption} onChange={(e) => setFields((prev) => ({ …prev, tauxOption: e.target.value }))}
style={{ width: ‘100%’, background: ‘#0A0B0F’, border: ‘1.5px solid #1E2230’, borderRadius: 8, color: ‘#E8EDF5’, fontSize: 13, padding: ‘10px 12px’, outline: ‘none’, cursor: ‘pointer’ }}>
{TAUX_OPTIONS.map((o) => (
<option key={o.label} value={o.value === null ? ‘custom’ : String(o.value)}>{o.label}</option>
))}
</select>
</div>
{fields.tauxOption === ‘custom’ && <InputField label=“Taux (%)” prefix=”%” value={fields.tauxPersonnalise} onChange={setField(‘tauxPersonnalise’)} />}
<div style={{ fontSize: 11, color: ‘#4A5568’ }}>Cotisations : <span style={{ color: ‘#8A95AA’ }}>{fmt(res.cotisations)}</span></div>
</Section>

```
  {res.prixVente > 0 && (
    <div style={{ marginTop: 4 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: '#4FFFA0', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.08em' }}>Resultats en temps reel</div>
      <div style={{ background: res.sante === 'Rentable' ? 'rgba(79,255,160,0.1)' : res.sante === 'Risque' ? 'rgba(255,190,50,0.1)' : 'rgba(255,80,80,0.1)', border: '1.5px solid ' + (res.sante === 'Rentable' ? '#4FFFA0' : res.sante === 'Risque' ? '#FFBE32' : '#FF5050'), borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{res.sante === 'Rentable' ? '✅' : res.sante === 'Risque' ? '⚠️' : '🔴'}</span>
        <div>
          <div style={{ fontSize: 10, color: '#8A95AA', textTransform: 'uppercase' }}>Sante du projet</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: res.sante === 'Rentable' ? '#4FFFA0' : res.sante === 'Risque' ? '#FFBE32' : '#FF5050' }}>{res.sante}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        {[
          { label: 'Benefice Net', value: fmt(res.beneficeNet), h: true },
          { label: 'Marge Nette', value: pct(res.marge), h: false },
          { label: 'Total Charges', value: fmt(res.totalCharges), h: false },
          { label: 'Cotisations', value: fmt(res.cotisations), h: false },
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
        {pdfPaid ? 'Telecharger mon Bilan PDF' : 'Telecharger le Bilan PDF - 2,00 €'}
      </button>
    </div>
  )}

  {res.prixVente === 0 && (
    <div style={{ textAlign: 'center', padding: '30px 20px', color: '#2E3545' }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
      <p style={{ fontSize: 14 }}>Renseignez votre prix de vente pour voir les resultats.</p>
    </div>
  )}

  {showPaywall && (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(5,6,10,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(8px)' }}>
      <div style={{ background: '#111318', border: '1.5px solid #4FFFA0', borderRadius: 20, maxWidth: 400, width: '100%', padding: '32px 28px', position: 'relative' }}>
        <button onClick={() => setShowPaywall(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#4A5568', fontSize: 22, cursor: 'pointer' }}>X</button>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
        <h2 style={{ color: '#E8EDF5', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Securisez votre projet</h2>
        <div style={{ background: '#0A0B0F', borderRadius: 12, padding: '16px', marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#4FFFA0' }}>2,00 €</div>
          <div style={{ fontSize: 12, color: '#8A95AA' }}>Paiement securise via Stripe</div>
        </div>
        <button onClick={handlePay} style={{ width: '100%', background: 'linear-gradient(135deg, #4FFFA0, #2ECC71)', border: 'none', borderRadius: 12, color: '#0A0B0F', fontSize: 16, fontWeight: 800, padding: '15px', cursor: 'pointer' }}>
          Payer et Telecharger
        </button>
      </div>
    </div>
  )}
</div>
```

);
}

// ─── APP PRINCIPALE ────────────────────────────────────────────────────────────
export default function App() {
const [onglet, setOnglet] = useState(‘parrainage’);

useEffect(() => {
const style = document.createElement(‘style’);
style.textContent = `* { margin: 0; padding: 0; box-sizing: border-box; }  body { background: #0A0B0F; color: #E8EDF5; font-family: sans-serif; }  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }  select { -webkit-appearance: none; appearance: none; }  ::-webkit-scrollbar { width: 4px; height: 4px; }  ::-webkit-scrollbar-track { background: #0A0B0F; }  ::-webkit-scrollbar-thumb { background: #1E2230; border-radius: 2px; }`;
document.head.appendChild(style);
return () => document.head.removeChild(style);
}, []);

return (
<div style={{ minHeight: ‘100vh’, background: ‘#0A0B0F’, paddingBottom: 80 }}>
<div style={{ background: ‘linear-gradient(180deg, #111318 0%, #0A0B0F 100%)’, borderBottom: ‘1px solid #1A1E2A’, padding: ‘18px 20px 16px’, textAlign: ‘center’ }}>
<div style={{ fontSize: 10, color: ‘#4FFFA0’, letterSpacing: ‘0.2em’, textTransform: ‘uppercase’, marginBottom: 4 }}>HUB FINANCIER</div>
<h1 style={{ fontSize: 24, fontWeight: 900, background: ‘linear-gradient(90deg, #4FFFA0, #A8FFD8)’, WebkitBackgroundClip: ‘text’, WebkitTextFillColor: ‘transparent’ }}>
Parrain 4P
</h1>
<p style={{ color: ‘#4A5568’, fontSize: 12, marginTop: 2 }}>Parrainages + Calculateur de Rentabilite</p>
</div>

```
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
</div>
```

);
}

const container = document.getElementById(‘root’);
const root = createRoot(container);
root.render(<App />);