import React, { useState, useEffect, useCallback } from 'react';

/* ========== DONNÉES PARRAINAGE ========== */

const OFFRES = [
{
id: 'hellobank',
nom: 'Hello Bank',
categorie: 'Banque',
emoji: '🏦',
couleur: '#00B4FF',
bonus: '80€',
bonusFilleul: '40€ + 40€',
bonusParrain: '80€',
description: 'Ouvre un compte Hello One et reçois 40€ sans dépôt, puis 40€ de plus dès le 10e achat carte.',
conditions: [
'1ère ouverture d’un compte Hello One',
'40€ offerts sans dépôt minimum',
'40€ supplémentaires au 10e achat carte bancaire',
'Délai : 72 heures',
],
type: 'contact',
contact: '@parrain_4p',
note: 'Pour recevoir ton invitation, envoie ton prénom + adresse email sur Instagram',
},
{
id: 'joko',
nom: 'Joko',
categorie: 'Cashback',
emoji: '💸',
couleur: '#FF6B35',
bonus: '1€ + cashback',
bonusFilleul: '1€ à l’inscription',
bonusParrain: '3€ + 10% du cashback filleul',
description: 'Joko transforme tes achats quotidiens en micro-économies automatiques.',
conditions: [
'Télécharger l’app Joko',
'Connecter son compte bancaire',
'1€ offert à l’inscription avec le code',
],
type: 'code',
code: 'skevdw',
},
];

/* ========== PAGE PARRAINAGE ========== */

function PageParrainage() {
const [selected, setSelected] = useState(null);
const [copied, setCopied] = useState(false);

const copier = (texte) => {
navigator.clipboard.writeText(texte).then(() => {
setCopied(true);
setTimeout(() => setCopied(false), 2000);
});
};

if (selected) {
const o = selected;

return (
<div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
<button onClick={() => setSelected(null)} style={{ marginBottom: 20 }}>← Retour</button>

<h2>{o.nom}</h2>
<p>{o.description}</p>

{o.type === 'code' && (
<div style={{ marginTop: 20 }}>
<h3>Code parrainage</h3>
<div style={{ fontSize: 28, fontWeight: 'bold' }}>{o.code}</div>

<button onClick={() => copier(o.code)}>
{copied ? 'Copié !' : 'Copier le code'}
</button>
</div>
)}
</div>
);
}

return (
<div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
<h1>Parrain 4P</h1>

{OFFRES.map((o) => (
<div
key={o.id}
onClick={() => setSelected(o)}
style={{
padding: 16,
border: '1px solid #ccc',
borderRadius: 10,
marginBottom: 12,
cursor: 'pointer',
}}
>
<div style={{ fontSize: 20, fontWeight: 'bold' }}>{o.nom}</div>
<div>{o.bonus}</div>
</div>
))}
</div>
);
}

/* ========== APP ========== */

export default function App() {
return <PageParrainage />;
}