import React, { useState, useEffect, useCallback } from "react";

const OFFRES = [
{
id: "hellobank",
nom: "Hello Bank",
categorie: "Banque",
emoji: "🏦",
couleur: "#00B4FF",
bonus: "80€",
bonusFilleul: "40€ + 40€",
bonusParrain: "80€",
description: "Ouvre un compte Hello One et recois 40€ sans depot, puis 40€ de plus des le 10e achat carte.",
conditions: [
"1ere ouverture d un compte de depot Hello One",
"40€ offerts sans depot minimum",
"40€ supplementaires au 10e achat carte bancaire",
"Delai : 72 heures"
],
type: "contact",
contact: "@parrain_4p",
note: "Pour recevoir ton invitation, envoie ton prenom + adresse email sur Instagram"
},

{
id: "coinbase",
nom: "Coinbase",
categorie: "Crypto",
emoji: "₿",
couleur: "#0052FF",
bonus: "20€",
bonusFilleul: "20€ en Bitcoin",
bonusParrain: "20€",
description: "Coinbase est la plateforme de reference pour acheter et vendre des cryptomonnaies.",
conditions: [
"S inscrire via le lien",
"Valider son identite",
"Deposer 20€",
"Acheter 20€ de Bitcoin"
],
type: "lien",
lien: "https://coinbase.com"
}
];

const CATEGORIES = ["Tout", "Banque", "Crypto"];

function PageParrainage() {

const [filtre, setFiltre] = useState("Tout");
const [selected, setSelected] = useState(null);

const filtrees = filtre === "Tout"
? OFFRES
: OFFRES.filter(o => o.categorie === filtre);

if (selected) {
const o = selected;

return (
<div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>

<button onClick={() => setSelected(null)} style={{
background: "none",
border: "none",
color: "#4FFFA0",
marginBottom: 20,
cursor: "pointer"
}}>
← Retour
</button>

<div style={{
background: "#111318",
borderRadius: 20,
padding: 20,
border: "1px solid #1A1E2A"
}}>

<div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
<div style={{
width: 50,
height: 50,
borderRadius: 14,
background: o.couleur + "22",
border: "2px solid " + o.couleur,
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 24
}}>
{o.emoji}
</div>

<div>
<div style={{ fontSize: 12, color: "#4A5568" }}>{o.categorie}</div>
<h2 style={{ margin: 0, color: "#E8EDF5" }}>{o.nom}</h2>
</div>
</div>

<p style={{ color: "#8A95AA", fontSize: 14, marginBottom: 20 }}>
{o.description}
</p>

<div style={{ marginBottom: 20 }}>
{o.conditions.map((c, i) => (
<div key={i} style={{ marginBottom: 6, color: "#8A95AA", fontSize: 13 }}>
✓ {c}
</div>
))}
</div>

{o.type === "lien" && (
<a href={o.lien} target="_blank" rel="noreferrer" style={{
display: "block",
textAlign: "center",
background: "linear-gradient(135deg, #4FFFA0, #2ECC71)",
padding: 14,
borderRadius: 12,
color: "#0A0B0F",
fontWeight: 800,
textDecoration: "none"
}}>
S inscrire avec mon lien
</a>
)}

</div>
</div>
);
}

return (
<div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>

<div style={{ marginBottom: 14, display: "flex", gap: 8, overflowX: "auto" }}>
{CATEGORIES.map(cat => (
<button key={cat}
onClick={() => setFiltre(cat)}
style={{
background: filtre === cat ? "#4FFFA0" : "#111318",
border: "1px solid #1A1E2A",
color: filtre === cat ? "#000" : "#8A95AA",
padding: "6px 14px",
borderRadius: 20,
cursor: "pointer",
fontSize: 12,
fontWeight: 700
}}>
{cat}
</button>
))}
</div>

<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

{filtrees.map(o => (
<button key={o.id}
onClick={() => setSelected(o)}
style={{
background: "#111318",
border: "1px solid #1A1E2A",
borderRadius: 16,
padding: 16,
cursor: "pointer",
textAlign: "left"
}}>

<div style={{
width: 44,
height: 44,
borderRadius: 12,
background: o.couleur + "22",
border: "1.5px solid " + o.couleur,
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 22,
marginBottom: 10
}}>
{o.emoji}
</div>

<div style={{ fontSize: 11, color: "#4A5568", marginBottom: 4 }}>
{o.categorie}
</div>

<div style={{ fontSize: 15, fontWeight: 800, color: "#E8EDF5", marginBottom: 6 }}>
{o.nom}
</div>

<div style={{ fontSize: 14, fontWeight: 900, color: o.couleur }}>
{o.bonus}
</div>

</button>
))}

</div>
</div>
);
}

export default function App() {

const [onglet, setOnglet] = useState("parrainage");

return (
<div style={{ minHeight: "100vh", background: "#0A0B0F", color: "#E8EDF5", paddingBottom: 80 }}>

<div style={{
background: "linear-gradient(180deg, #111318 0%, #0A0B0F 100%)",
borderBottom: "1px solid #1A1E2A",
padding: "18px 20px 16px",
textAlign: "center"
}}>
<div style={{ fontSize: 10, color: "#4FFFA0", letterSpacing: "0.2em", textTransform: "uppercase" }}>
HUB FINANCIER
</div>

<h1 style={{
fontSize: 24,
fontWeight: 900,
background: "linear-gradient(90deg, #4FFFA0, #A8FFD8)",
WebkitBackgroundClip: "text",
WebkitTextFillColor: "transparent"
}}>
Parrain 4P
</h1>
</div>

{onglet === "parrainage" && <PageParrainage />}

<div style={{
position: "fixed",
bottom: 0,
left: 0,
right: 0,
background: "#111318",
borderTop: "1px solid #1A1E2A",
display: "flex"
}}>

<button onClick={() => setOnglet("parrainage")} style={{
flex: 1,
background: "none",
border: "none",
padding: 12,
cursor: "pointer",
color: "#4FFFA0",
fontWeight: 700
}}>
🎁 Parrainages
</button>

</div>

</div>
);
}