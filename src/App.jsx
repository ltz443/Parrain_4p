import React, { useState, useEffect, useCallback, useReducer, createContext, useContext } from ‘react’;
import { createRoot } from ‘react-dom/client’;

// ─────────────────────────────────────────────────────────────
// DESIGN SYSTEM — Maison de Haute Finance
// ─────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url(‘https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700;800&display=swap’);

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

:root {
–bg:        #08080A;
–s1:        #0E0E11;
–s2:        #141418;
–s3:        #1C1C22;
–s4:        #242430;
–v1:        rgba(255,255,255,0.04);
–v2:        rgba(255,255,255,0.08);
–v3:        rgba(255,255,255,0.13);
–gold:      #C9A96E;
–gold2:     #E8CB96;
–gold-bg:   rgba(201,169,110,0.10);
–gold-bd:   rgba(201,169,110,0.25);
–green:     #3DFFA0;
–green-bg:  rgba(61,255,160,0.08);
–green-bd:  rgba(61,255,160,0.25);
–red:       #FF5C5C;
–amber:     #FFBE32;
–parch:     #F0EBE3;
–silver:    #9898A8;
–mist:      #666676;
–fog:       #3E3E4E;
–f-serif:   ‘Cormorant Garamond’, Georgia, serif;
–f-sans:    ‘Montserrat’, sans-serif;
–r:         14px;
–r-sm:      8px;
–r-xs:      6px;
–safe-b:    env(safe-area-inset-bottom, 24px);
}

html, body { min-height: 100vh; background: var(–bg); color: var(–parch); font-family: var(–f-sans); }
#root { min-height: 100vh; }

/* Grain overlay */
body::after {
content: ‘’;
position: fixed; inset: 0;
background-image: url(“data:image/svg+xml,%3Csvg viewBox=‘0 0 200 200’ xmlns=‘http://www.w3.org/2000/svg’%3E%3Cfilter id=‘n’%3E%3CfeTurbulence type=‘fractalNoise’ baseFrequency=‘0.85’ numOctaves=‘4’ stitchTiles=‘stitch’/%3E%3C/filter%3E%3Crect width=‘100%25’ height=‘100%25’ filter=‘url(%23n)’ opacity=‘0.035’/%3E%3C/svg%3E”);
pointer-events: none; z-index: 9999; opacity: .7;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
select { -webkit-appearance: none; appearance: none; }
::-webkit-scrollbar { width: 3px; height: 3px; }
::-webkit-scrollbar-track { background: var(–bg); }
::-webkit-scrollbar-thumb { background: var(–s4); border-radius: 2px; }

/* Animations */
@keyframes fadeRise { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes favBurst { 0%{transform:scale(1)} 40%{transform:scale(1.5)} 75%{transform:scale(.9)} 100%{transform:scale(1)} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

.fr { animation: fadeRise .35s cubic-bezier(.2,.8,.3,1) both; }
.fr1 { animation-delay:.05s; }
.fr2 { animation-delay:.1s; }
.fr3 { animation-delay:.15s; }
.fr4 { animation-delay:.2s; }
`;

// ─────────────────────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────────────────────
const Store = {
get: (k, fb = null) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ─────────────────────────────────────────────────────────────
// FAVORITES HOOK
// ─────────────────────────────────────────────────────────────
function useFavorites() {
const [favs, setFavs] = useState(() => Store.get(‘p4_favs’, []));
const [favOnly, setFavOnly] = useState(false);

useEffect(() => {
const h = (e) => { if (e.key === ‘p4_favs’) setFavs(Store.get(‘p4_favs’, [])); };
window.addEventListener(‘storage’, h);
return () => window.removeEventListener(‘storage’, h);
}, []);

const toggle = useCallback((id) => {
setFavs(prev => {
const next = prev.includes(id) ? prev.filter(x => x !== id) : […prev, id];
Store.set(‘p4_favs’, next);
return next;
});
}, []);

const isFav = useCallback((id) => favs.includes(id), [favs]);
const toggleFavOnly = useCallback(() => setFavOnly(v => !v), []);

return { favs, isFav, toggle, favOnly, toggleFavOnly, count: favs.length };
}

// ─────────────────────────────────────────────────────────────
// LOGO COMPONENT
// ─────────────────────────────────────────────────────────────
const LOGO_DOMAINS = {
hellobank:‘hellobank.fr’, joko:‘joko.com’, okx:‘okx.com’, veracash:‘veracash.com’,
robinhood:‘robinhood.com’, winamax:‘winamax.fr’, betsson:‘betsson.fr’,
Unibet:‘unibet.fr’, engie:‘engie.fr’, nordvpn:‘nordvpn.com’, myfin:‘myfin.eu’,
};

function LogoOffre({ id, emoji, couleur, size = 44 }) {
const [err, setErr] = useState(false);
const domain = LOGO_DOMAINS[id];
const s = {
width: size, height: size, borderRadius: size * 0.25,
background: couleur + ‘18’, border: ’1px solid ’ + couleur + ‘40’,
display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’,
overflow: ‘hidden’, flexShrink: 0,
};
if (!domain || err) return <div style={{ …s, fontSize: size * 0.48 }}>{emoji}</div>;
return (
<div style={s}>
<img
src={`https://img.logo.dev/${domain}?token=pk_BXZXZrJITlWofFOzS8oAoA&size=128`}
alt={id}
onError={e => { e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`; setErr(false); }}
style={{ width: ‘78%’, height: ‘78%’, objectFit: ‘contain’ }}
/>
</div>
);
}

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const OFFRES = [
{ id:‘hellobank’, nom:“Hello Bank”, categorie:“Banque”, emoji:“🏦”, couleur:’#00B4FF’, bonus:“80€”, bonusFilleul:“40€ + 40€”, bonusParrain:“80€”, description:“Ouvre un compte Hello One et reçois 40€ sans dépôt, puis 40€ de plus dès le 10e achat carte.”, conditions:[“Première ouverture d’un compte Hello One”,“40€ offerts sans dépôt minimum”,“40€ supplémentaires au 10e achat carte”], type:‘contact’, contact:’@parrain_4p’, note:“Envoie ton prénom + adresse email sur Instagram”, shareText:“Ouvre un compte Hello Bank et reçois 80€ ! Contacte @parrain_4p sur Instagram.”, shareUrl:‘https://parrain-4p.vercel.app’, featured:true },
{ id:‘joko’, nom:“Joko”, categorie:“Cashback”, emoji:“💸”, couleur:’#FF6B35’, bonus:“1€ + cashback”, bonusFilleul:“1€ à l’inscription”, bonusParrain:“3€ + 10% cashback filleul”, description:“Joko transforme tes achats quotidiens en micro-économies automatiques.”, conditions:[“Télécharger l’app Joko”,“Utilise mon code de parrainage”,“Connecte ton compte bancaire”,“1€ offert à l’inscription — instantané”], type:‘code’, code:‘skevdw’, shareText:“Rejoins Joko avec mon code skevdw et gagne 1€ + cashback auto !”, shareUrl:‘https://parrain-4p.vercel.app’ },
{ id:‘okx’, nom:“OKX”, categorie:“Crypto”, emoji:“₿”, couleur:’#0052FF’, bonus:“40€”, bonusFilleul:“40€ en Bitcoin”, bonusParrain:“60€”, description:“OKX est la plateforme de référence pour acheter, vendre et stocker des cryptomonnaies.”, conditions:[“S’inscrire via le lien de parrainage”,“Valider son identité (KYC)”,“Déposer 200€”,“Acheter 200€ de Bitcoin (BTC)”,“Reçois 40€ de Bitcoin après 24h — retirable”], type:‘lien’, lien:‘https://my.okx.com/fr-fr/join/90527625’, shareText:“Inscris-toi sur OKX via mon lien et reçois 40€ en Bitcoin !”, shareUrl:‘https://my.okx.com/fr-fr/join/90527625’, featured:true },
{ id:‘veracash’, nom:“VeraCash”, categorie:“Or & Épargne”, emoji:“🥇”, couleur:’#FFD700’, bonus:“10€”, bonusFilleul:“Frais réduits”, bonusParrain:“10€”, description:“Épargne et paye avec de l’or et de l’argent physique. Alternative solide aux banques.”, conditions:[“S’inscrire via le lien de parrainage”,“Vérifier son identité”,“Déposer 10€ (retirable immédiatement)”], type:‘lien’, lien:‘https://www.veracash.com/fr/inscription?sponsorMemberPseudo=DEVOMIZO’, shareText:“Épargne en or avec VeraCash ! Inscris-toi via mon lien pour des frais réduits à vie.”, shareUrl:‘https://www.veracash.com/fr/inscription?sponsorMemberPseudo=DEVOMIZO’ },
{ id:‘robinhood’, nom:“Robinhood”, categorie:“Crypto Exchange”, emoji:“🏹”, couleur:’#00C805’, bonus:“10€”, bonusFilleul:“10€”, bonusParrain:“10€”, description:“Exchange crypto simple et intuitif, sans frais cachés.”, conditions:[“S’inscrire via le lien de parrainage”,“Valider son identité”,“Déposer 10€ (retirable immédiatement)”,“Délai : 6 mois”], type:‘lien’, lien:‘https://join.robinhood.com/eu_crypto/leot-ad308a260/’, shareText:“Rejoins Robinhood et reçois 10€ ! Dépôt retirable immédiatement.”, shareUrl:‘https://join.robinhood.com/eu_crypto/leot-ad308a260/’ },
{ id:‘winamax’, nom:“Winamax”, categorie:“Paris Sportifs”, emoji:“⚽”, couleur:’#E8002D’, bonus:“40€”, bonusFilleul:“40€”, bonusParrain:“40€”, description:“Winamax est la référence des paris sportifs en France.”, conditions:[“S’inscrire avec le code parrainage”,“Valider son inscription”,“Déposer 10€”], type:‘code’, code:‘LTZXVU’, shareText:“Inscris-toi sur Winamax avec le code LTZXVU et reçois 40€ !”, shareUrl:‘https://parrain-4p.vercel.app’ },
{ id:‘betsson’, nom:“Betsson”, categorie:“Paris Sportifs”, emoji:“🎯”, couleur:’#FF4500’, bonus:“10€ BB”, bonusFilleul:“10€ Betboost”, bonusParrain:“10€ Betboost”, description:“Plateforme de paris sportifs internationale. 10€ Betboost à l’activation.”, conditions:[“S’inscrire via le lien”,“Vérifier son compte”,“Déposer 10€”], type:‘lien’, lien:‘https://betsson.fr/fr/%23register?language=fr&referralCode=8LAFsK’, shareText:“Inscris-toi sur Betsson via mon lien et reçois 10€ Betboost !”, shareUrl:‘https://betsson.fr/fr/%23register?language=fr&referralCode=8LAFsK’ },
{ id:‘Unibet’, nom:“Unibet”, categorie:“Paris Sportifs”, emoji:“💰”, couleur:’#FF4500’, bonus:“30€”, bonusFilleul:“30€ Freebets”, bonusParrain:“30€ Freebets”, description:“Paris sportifs international. 30€ en Freebets à l’inscription.”, conditions:[“S’inscrire via le lien”,“Vérifier son compte”,“Déposer 10€”], type:‘lien’, lien:‘https://www.unibet.fr/inscription/?campaign=240326&parrain=AC1330D7A4D09111’, shareText:“Inscris-toi sur Unibet via mon lien et reçois 30€ en Freebets !”, shareUrl:‘https://www.unibet.fr/inscription/?campaign=240326&parrain=AC1330D7A4D09111’ },
{ id:‘engie’, nom:“Engie”, categorie:“Énergie”, emoji:“⚡”, couleur:’#00B4FF’, bonus:“20€”, bonusFilleul:“20€ sur la facture”, bonusParrain:“20€”, description:“Groupe énergétique axé sur les énergies renouvelables.”, conditions:[“S’inscrire avec le code de parrainage”,“Souscription offre électricité ou gaz”], type:‘code’, code:‘ZUA255872’, shareText:“Rejoins Engie avec mon code parrainage ZUA255872 !”, shareUrl:‘https://parrain-4p.vercel.app’ },
{ id:‘nordvpn’, nom:“NordVPN”, categorie:“VPN”, emoji:“🔒”, couleur:’#4687FF’, bonus:“3 Mois”, bonusFilleul:“1 à 3 mois offerts”, bonusParrain:“3 mois offerts”, description:“Protégez votre vie privée avec le VPN leader du marché.”, conditions:[“S’inscrire via le lien de parrainage”,“Abonnement 1 an : 3 mois offerts”,“Abonnement mensuel : 1 mois offert”], type:‘lien’, lien:‘https://refer-nordvpn.com/jFCxwAkTEVV’, shareText:“Protège ta connexion avec NordVPN via mon lien !”, shareUrl:‘https://parrain-4p.vercel.app’ },
{ id:‘myfin’, nom:“Myfin”, categorie:“Banque”, emoji:“💳”, couleur:’#22c55e’, bonus:“10€”, bonusFilleul:“10€”, bonusParrain:“10€”, description:“Solution digitale de gestion financière personnelle.”, conditions:[“S’inscrire avec le code parrainage”,“Vérifier son compte”,“Déposer 10€”,“Utiliser la carte virtuelle sur Betclic”,“Retirer tes 10€ sur Betclic”], type:‘code’, code:‘LE00BB5I’, shareText:“Rejoins Myfin avec le code LE00BB5I !”, shareUrl:‘https://parrain-4p.vercel.app’ },
];

const CATEGORIES = [‘Tout’,‘Énergie’,‘Banque’,‘Cashback’,‘Crypto’,‘Or & Épargne’,‘Crypto Exchange’,‘Paris Sportifs’,‘VPN’];
const STRIPE_LINK = ‘https://buy.stripe.com/14A8wPadZ2MmbRF0A4a3u00’;
const TAUX_OPTIONS = [
{ label:“Auto-entrepreneur — Prestation de services (21.2%)”, value:21.2 },
{ label:“Auto-entrepreneur — Vente de marchandises (12.8%)”, value:12.8 },
{ label:“EIRL / EI au réel (estimation 45%)”, value:45 },
{ label:“Personnalisé”, value:null },
];

// ─────────────────────────────────────────────────────────────
// UI PRIMITIVES
// ─────────────────────────────────────────────────────────────
const styles = {
// Layout
page: { maxWidth: 480, margin: ‘0 auto’, padding: ‘0 16px 100px’ },

// Cards
card: { background:‘var(–s1)’, border:‘1px solid var(–v2)’, borderRadius:‘var(–r)’, overflow:‘hidden’ },
cardGold: { background:‘var(–s1)’, border:‘1px solid var(–gold-bd)’, borderRadius:‘var(–r)’, overflow:‘hidden’, position:‘relative’ },

// Section block
block: { background:‘var(–s1)’, border:‘1px solid var(–v2)’, borderRadius:‘var(–r)’, padding:‘18px 16px’, marginBottom:10 },
blockHdr: { display:‘flex’, alignItems:‘center’, gap:8, marginBottom:14 },
blockHdrTxt: { fontSize:10, fontWeight:700, color:‘var(–green)’, letterSpacing:‘3px’, textTransform:‘uppercase’, fontFamily:‘var(–f-sans)’ },
blockHdrRule: { flex:1, height:1, background:‘linear-gradient(90deg, var(–green-bd), transparent)’ },

// Typography
label: { fontSize:10, fontWeight:600, color:‘var(–silver)’, letterSpacing:‘2px’, textTransform:‘uppercase’, display:‘block’, marginBottom:5 },
serif: { fontFamily:‘var(–f-serif)’, fontWeight:300 },

// Buttons
btnGold: { width:‘100%’, padding:‘15px’, background:‘var(–gold)’, border:‘none’, borderRadius:‘var(–r-sm)’, color:‘var(–bg)’, fontFamily:‘var(–f-sans)’, fontSize:12, fontWeight:700, letterSpacing:‘2px’, textTransform:‘uppercase’, cursor:‘pointer’, transition:‘all .2s’ },
btnGhost: { width:‘100%’, padding:‘13px’, background:‘transparent’, border:‘1px solid var(–v3)’, borderRadius:‘var(–r-sm)’, color:‘var(–silver)’, fontFamily:‘var(–f-sans)’, fontSize:12, fontWeight:500, letterSpacing:‘1.5px’, textTransform:‘uppercase’, cursor:‘pointer’, transition:‘all .2s’ },
btnGreen: { width:‘100%’, padding:‘15px’, background:‘var(–green)’, border:‘none’, borderRadius:‘var(–r-sm)’, color:‘var(–bg)’, fontFamily:‘var(–f-sans)’, fontSize:12, fontWeight:800, letterSpacing:‘2px’, textTransform:‘uppercase’, cursor:‘pointer’ },

// Input
input: { width:‘100%’, background:‘var(–bg)’, border:‘1.5px solid var(–v3)’, borderRadius:‘var(–r-sm)’, color:‘var(–parch)’, fontSize:14, padding:‘11px 12px 11px 30px’, outline:‘none’, fontFamily:‘monospace’, boxSizing:‘border-box’ },
select: { width:‘100%’, background:‘var(–bg)’, border:‘1.5px solid var(–v3)’, borderRadius:‘var(–r-sm)’, color:‘var(–parch)’, fontSize:13, padding:‘11px 12px’, outline:‘none’, cursor:‘pointer’, fontFamily:‘var(–f-sans)’ },

// Split rows
splitRow: { display:‘flex’, justifyContent:‘space-between’, alignItems:‘center’, padding:‘9px 0’, borderBottom:‘1px solid var(–v1)’ },
splitL: { fontSize:12, color:‘var(–mist)’ },
splitR: { fontSize:13, fontWeight:600, color:‘var(–parch)’ },
};

// ─────────────────────────────────────────────────────────────
// FAVOR BUTTON
// ─────────────────────────────────────────────────────────────
function FavBtn({ id, isFav, onToggle, size = 18 }) {
const [burst, setBurst] = useState(false);
const handle = (e) => {
e.stopPropagation();
onToggle(id);
if (!isFav) { setBurst(true); setTimeout(() => setBurst(false), 450); }
};
return (
<button onClick={handle} aria-label={isFav ? ‘Retirer favori’ : ‘Ajouter favori’}
style={{ background:‘none’, border:‘none’, cursor:‘pointer’, padding:4, lineHeight:1, display:‘inline-flex’, alignItems:‘center’, justifyContent:‘center’ }}>
<span style={{ fontSize:size, color: isFav ? ‘var(–gold)’ : ‘var(–fog)’, opacity: isFav ? 1 : .6, transition:‘all .2s’, display:‘block’, animation: burst ? ‘favBurst .45s cubic-bezier(.36,.07,.19,.97) both’ : ‘none’ }}>
{isFav ? ‘♥’ : ‘♡’}
</span>
</button>
);
}

// ─────────────────────────────────────────────────────────────
// CHECKLIST
// ─────────────────────────────────────────────────────────────
function Checklist({ offreId, conditions }) {
const key = ‘checklist_’ + offreId;
const [checked, setChecked] = useState(() => Store.get(key, {}));
const toggle = (i) => { const next = { …checked, [i]: !checked[i] }; setChecked(next); Store.set(key, next); };
const done = conditions.filter((_, i) => checked[i]).length;
const pct = Math.round((done / conditions.length) * 100);

return (
<div style={{ marginBottom: 20 }}>
<div style={{ display:‘flex’, justifyContent:‘space-between’, alignItems:‘center’, marginBottom:8 }}>
<span style={{ fontSize:10, fontWeight:700, color:‘var(–green)’, letterSpacing:‘2px’, textTransform:‘uppercase’ }}>Progression</span>
<span style={{ fontSize:11, color: done === conditions.length ? ‘var(–green)’ : ‘var(–silver)’, fontWeight:700 }}>{done}/{conditions.length}</span>
</div>
<div style={{ background:‘var(–s3)’, borderRadius:3, height:3, marginBottom:14, overflow:‘hidden’ }}>
<div style={{ background:‘var(–green)’, height:‘100%’, width:pct+’%’, borderRadius:3, transition:‘width .3s ease’ }} />
</div>
{conditions.map((c, i) => (
<div key={i} onClick={() => toggle(i)} style={{ display:‘flex’, gap:10, alignItems:‘flex-start’, marginBottom:10, cursor:‘pointer’ }}>
<div style={{ width:20, height:20, borderRadius:5, border:’1.5px solid ’+(checked[i] ? ‘var(–green)’ : ‘var(–v3)’), background: checked[i] ? ‘var(–green)’ : ‘transparent’, display:‘flex’, alignItems:‘center’, justifyContent:‘center’, flexShrink:0, marginTop:1, transition:‘all .2s’ }}>
{checked[i] && <span style={{ fontSize:11, color:‘var(–bg)’, fontWeight:900 }}>✓</span>}
</div>
<span style={{ fontSize:13, color: checked[i] ? ‘var(–fog)’ : ‘var(–silver)’, lineHeight:1.55, textDecoration: checked[i] ? ‘line-through’ : ‘none’ }}>{c}</span>
</div>
))}
{done === conditions.length && (
<div style={{ background:‘var(–green-bg)’, border:‘1px solid var(–green-bd)’, borderRadius:‘var(–r-sm)’, padding:‘10px 14px’, textAlign:‘center’, marginTop:8 }}>
<span style={{ fontSize:13, color:‘var(–green)’, fontWeight:700 }}>🎉 Toutes les étapes complétées !</span>
</div>
)}
</div>
);
}

// ─────────────────────────────────────────────────────────────
// SHARE BUTTON
// ─────────────────────────────────────────────────────────────
function BoutonPartage({ offre }) {
const partager = async () => {
if (navigator.share) { try { await navigator.share({ title:offre.nom+’ — ‘+offre.bonus, text:offre.shareText, url:offre.shareUrl }); return; } catch {} }
try { await navigator.clipboard.writeText(offre.shareText+’ ’+offre.shareUrl); alert(‘Lien copié !’); } catch {}
};
return (
<button onClick={partager} style={{ …styles.btnGhost, display:‘flex’, alignItems:‘center’, justifyContent:‘center’, gap:8, marginTop:10 }}>
<span style={{ fontSize:15 }}>↗</span> Partager cette offre
</button>
);
}

// ─────────────────────────────────────────────────────────────
// FORMULAIRE CHALLENGE
// ─────────────────────────────────────────────────────────────
function FormulaireChallenge() {
const [method, setMethod] = useState(‘revolut’);
const inp = { width:‘100%’, background:‘var(–bg)’, border:‘1.5px solid var(–v3)’, borderRadius:‘var(–r-sm)’, color:‘var(–parch)’, padding:‘11px 12px’, outline:‘none’, fontSize:13, marginBottom:8, fontFamily:‘var(–f-sans)’ };
return (
<div style={{ background:‘var(–s1)’, border:‘1px solid var(–gold-bd)’, borderRadius:‘var(–r)’, padding:‘24px 20px’, marginTop:24 }}>
<div style={{ textAlign:‘center’, marginBottom:20 }}>
<div style={{ fontFamily:‘var(–f-serif)’, fontSize:32, fontWeight:300, color:‘var(–gold)’, marginBottom:6 }}>Challenge 3-en-1</div>
<p style={{ fontSize:12, color:‘var(–silver)’, lineHeight:1.6 }}>Complète 3 offres et reçois <strong style={{ color:‘var(–green)’ }}>10€ de bonus</strong> de ma part !</p>
</div>
<form action="https://formspree.io/f/mreojpvq" method="POST">
<div style={{ display:‘grid’, gridTemplateColumns:‘1fr 1fr’, gap:8 }}>
<input type="text" name="prenom" placeholder="Prénom" required style={inp} />
<input type="text" name="instagram" placeholder="@Pseudo Instagram" required style={inp} />
</div>
<input type="email" name="email" placeholder="Adresse email" required style={inp} />
<input type="text" name="offres" placeholder="Les 3 offres choisies" required style={inp} />
<div style={{ display:‘flex’, justifyContent:‘center’, gap:20, margin:‘12px 0’, flexWrap:‘wrap’ }}>
{[‘revolut’,‘rib’].map(m => (
<label key={m} style={{ fontSize:12, color:‘var(–silver)’, cursor:‘pointer’, display:‘flex’, alignItems:‘center’, gap:6 }}>
<input type=“radio” name=“pay_method” value={m} checked={method===m} onChange={() => setMethod(m)} />
{m === ‘revolut’ ? ‘Revolut’ : ‘RIB’}
</label>
))}
</div>
{method === ‘revolut’
? <input type="text" name="revolut_tag" placeholder="Ton @Tag Revolut" required style={inp} />
: <><input type="text" name="nom_famille" placeholder="Nom de famille" required style={inp} /><input type="text" name="iban" placeholder="Ton IBAN" required style={inp} /></>
}
<div style={{ background:‘var(–gold-bg)’, border:‘1px dashed var(–gold-bd)’, borderRadius:‘var(–r-sm)’, padding:‘12px 14px’, marginBottom:14 }}>
<p style={{ fontSize:11, color:‘var(–silver)’, textAlign:‘center’, lineHeight:1.6 }}>
📸 Envoie tes 3 preuves sur{’ ‘}
<a href=“https://www.instagram.com/parrain_4p?igsh=MXBnN2Z2bzdvM3Z6cg%3D%3D&utm_source=qr” target=”_blank” rel=“noreferrer” style={{ color:‘var(–gold)’, fontWeight:700 }}>Instagram</a>
{’ ’}pour valider le virement.
</p>
</div>
<button type="submit" style={styles.btnGreen}>Envoyer ma demande</button>
</form>
</div>
);
}

// ─────────────────────────────────────────────────────────────
// PAGE PARRAINAGE — LISTE
// ─────────────────────────────────────────────────────────────
function PageParrainage() {
const [filtre, setFiltre] = useState(‘Tout’);
const [selected, setSelected] = useState(null);
const [copied, setCopied] = useState(false);
const { favs, isFav, toggle, favOnly, toggleFavOnly, count } = useFavorites();

const filtrees = OFFRES.filter(o => {
if (favOnly && !isFav(o.id)) return false;
if (filtre !== ‘Tout’ && o.categorie !== filtre) return false;
return true;
});

const copier = (txt) => { navigator.clipboard.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };

// ── DETAIL VIEW ────────────────────────────────────────────
if (selected) {
const o = selected;
return (
<div style={styles.page}>
<div style={{ paddingTop:16 }}>
<button onClick={() => setSelected(null)} style={{ background:‘none’, border:‘none’, color:‘var(–gold)’, fontSize:11, cursor:‘pointer’, display:‘flex’, alignItems:‘center’, gap:6, marginBottom:20, letterSpacing:‘2px’, textTransform:‘uppercase’, fontFamily:‘var(–f-sans)’, fontWeight:600 }}>
← Retour
</button>

```
      {/* Hero card */}
      <div style={{ ...styles.cardGold, padding:'24px 20px', marginBottom:12 }} className="fr">
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, var(--gold-bg) 0%, transparent 60%)', pointerEvents:'none' }} />
        <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:18 }}>
          <LogoOffre id={o.id} emoji={o.emoji} couleur={o.couleur} size={58} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:'var(--mist)', textTransform:'uppercase', letterSpacing:'2px', marginBottom:3 }}>{o.categorie}</div>
            <div style={{ fontFamily:'var(--f-serif)', fontSize:34, fontWeight:300, color:'var(--parch)', lineHeight:1 }}>{o.nom}</div>
            <div style={{ width:28, height:1, background:'var(--gold)', margin:'8px 0' }} />
            <div style={{ fontFamily:'var(--f-serif)', fontSize:46, fontWeight:300, color:'var(--gold)', lineHeight:1 }}>{o.bonus}</div>
          </div>
          <FavBtn id={o.id} isFav={isFav(o.id)} onToggle={toggle} size={22} />
        </div>
        <p style={{ fontSize:13, color:'var(--silver)', lineHeight:1.7, marginBottom:18 }}>{o.description}</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
          <div style={{ background:'var(--bg)', borderRadius:'var(--r-sm)', padding:'12px', textAlign:'center', border:'1px solid var(--v2)' }}>
            <div style={{ fontSize:9, color:'var(--mist)', textTransform:'uppercase', letterSpacing:'2px', marginBottom:5 }}>Tu reçois</div>
            <div style={{ fontFamily:'var(--f-serif)', fontSize:24, fontWeight:300, color:'var(--gold)' }}>{o.bonusParrain}</div>
          </div>
          <div style={{ background:'var(--bg)', borderRadius:'var(--r-sm)', padding:'12px', textAlign:'center', border:'1px solid var(--v2)' }}>
            <div style={{ fontSize:9, color:'var(--mist)', textTransform:'uppercase', letterSpacing:'2px', marginBottom:5 }}>Filleul reçoit</div>
            <div style={{ fontFamily:'var(--f-serif)', fontSize:24, fontWeight:300, color:'var(--parch)' }}>{o.bonusFilleul}</div>
          </div>
        </div>

        <Checklist offreId={o.id} conditions={o.conditions} />

        {/* Action selon type */}
        {o.type === 'code' && (
          <div style={{ background:'var(--bg)', borderRadius:'var(--r-sm)', padding:'18px', marginBottom:12, border:'1px dashed var(--gold-bd)', textAlign:'center' }}>
            <div style={{ fontSize:9, color:'var(--mist)', marginBottom:8, textTransform:'uppercase', letterSpacing:'2px' }}>Code parrainage</div>
            <div style={{ fontFamily:'var(--f-serif)', fontSize:38, fontWeight:300, color:'var(--gold)', letterSpacing:'4px' }}>{o.code}</div>
            <button onClick={() => copier(o.code)} style={{ ...styles.btnGold, marginTop:12, padding:'10px 24px', width:'auto' }}>
              {copied ? '✓ Copié' : 'Copier le code'}
            </button>
          </div>
        )}
        {o.type === 'lien' && o.lien !== '#' && (
          <a href={o.lien} target="_blank" rel="noreferrer" style={{ ...styles.btnGold, display:'block', textAlign:'center', textDecoration:'none', padding:'15px', marginBottom:10 }}>
            S'inscrire avec mon lien →
          </a>
        )}
        {o.type === 'contact' && (
          <div style={{ background:'var(--bg)', borderRadius:'var(--r-sm)', padding:'16px', border:'1px dashed var(--gold-bd)', textAlign:'center', marginBottom:10 }}>
            <div style={{ fontSize:12, color:'var(--silver)', lineHeight:1.6, marginBottom:12 }}>{o.note}</div>
            <a href={'https://instagram.com/'+o.contact.replace('@','')} target="_blank" rel="noreferrer"
              style={{ display:'inline-block', background:'linear-gradient(135deg,#833AB4,#FD1D1D,#F56040)', borderRadius:'var(--r-sm)', color:'#fff', fontSize:13, fontWeight:700, padding:'12px 24px', textDecoration:'none' }}>
              Me contacter {o.contact}
            </a>
          </div>
        )}
        <BoutonPartage offre={o} />
      </div>
    </div>
  </div>
);
```

}

// ── LISTE VIEW ─────────────────────────────────────────────
return (
<div style={styles.page}>
<div style={{ paddingTop:16 }}>
{/* Filtres */}
<div style={{ display:‘flex’, gap:6, overflowX:‘auto’, paddingBottom:4, scrollbarWidth:‘none’, marginBottom:14 }}>
{CATEGORIES.map(cat => (
<button key={cat} onClick={() => setFiltre(cat)} style={{ flexShrink:0, padding:‘6px 14px’, borderRadius:20, border:’1px solid ’+(filtre===cat ? ‘var(–gold-bd)’ : ‘var(–v2)’), background: filtre===cat ? ‘var(–gold-bg)’ : ‘transparent’, color: filtre===cat ? ‘var(–gold)’ : ‘var(–mist)’, fontSize:10, fontWeight:600, letterSpacing:‘1.5px’, textTransform:‘uppercase’, cursor:‘pointer’, whiteSpace:‘nowrap’, transition:‘all .2s’, fontFamily:‘var(–f-sans)’ }}>
{cat}
</button>
))}
</div>

```
    {/* Offre vedette */}
    {!favOnly && filtre === 'Tout' && (() => {
      const feat = OFFRES.find(o => o.featured);
      if (!feat) return null;
      return (
        <div className="fr" style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, color:'var(--gold)', letterSpacing:'3px', textTransform:'uppercase', marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
            Offre vedette
            <div style={{ flex:1, height:1, background:'linear-gradient(90deg, var(--gold-bd), transparent)' }} />
          </div>
          <div onClick={() => setSelected(feat)} style={{ ...styles.cardGold, padding:'18px 16px', cursor:'pointer' }}>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, var(--gold-bg) 0%, transparent 55%)', pointerEvents:'none' }} />
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <LogoOffre id={feat.id} emoji={feat.emoji} couleur={feat.couleur} size={52} />
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'var(--f-serif)', fontSize:24, fontWeight:400, color:'var(--parch)' }}>{feat.nom}</div>
                <div style={{ fontSize:10, color:'var(--mist)', textTransform:'uppercase', letterSpacing:'1.5px', marginTop:2 }}>{feat.categorie}</div>
                <div style={{ fontSize:12, color:'var(--silver)', marginTop:5, lineHeight:1.5 }}>{feat.description.slice(0,56)}…</div>
              </div>
              <div style={{ fontFamily:'var(--f-serif)', fontSize:40, fontWeight:300, color:'var(--gold)', flexShrink:0 }}>{feat.bonus}</div>
            </div>
          </div>
        </div>
      );
    })()}

    {/* Header liste */}
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
      <div style={{ fontSize:10, color:'var(--mist)', letterSpacing:'3px', textTransform:'uppercase' }}>
        {favOnly ? 'Favoris' : 'Catalogue'} · {filtrees.length}
      </div>
      <button onClick={toggleFavOnly} style={{ position:'relative', width:36, height:36, borderRadius:'var(--r-sm)', background: favOnly ? 'var(--gold-bg)' : 'var(--s2)', border:'1px solid '+(favOnly ? 'var(--gold-bd)' : 'var(--v2)'), display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:15, color: favOnly ? 'var(--gold)' : 'var(--fog)', transition:'all .2s' }}>
        {favOnly ? '♥' : '♡'}
        {count > 0 && (
          <span style={{ position:'absolute', top:-5, right:-5, minWidth:15, height:15, borderRadius:8, background:'var(--gold)', color:'var(--bg)', fontSize:8, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px', fontFamily:'var(--f-sans)' }}>{count}</span>
        )}
      </button>
    </div>

    {/* Grille */}
    {filtrees.length === 0 ? (
      <div style={{ textAlign:'center', padding:'48px 0', color:'var(--fog)' }}>
        <div style={{ fontSize:36, marginBottom:12, opacity:.4 }}>{favOnly ? '♥' : '◎'}</div>
        <div style={{ fontSize:13 }}>{favOnly ? 'Aucun favori pour l\'instant' : 'Aucune offre trouvée'}</div>
      </div>
    ) : (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {filtrees.map((o, idx) => (
          <div key={o.id} className="fr" style={{ animationDelay: idx * 0.04 + 's' }}>
            <button onClick={() => setSelected(o)} style={{ ...styles.card, padding:'16px 12px', cursor:'pointer', textAlign:'left', width:'100%', position:'relative', display:'block', transition:'border-color .2s', borderColor: isFav(o.id) ? 'var(--gold-bd)' : 'var(--v2)' }}>
              <div style={{ position:'absolute', left:0, top:'20%', bottom:'20%', width:2, background: isFav(o.id) ? 'var(--gold)' : 'var(--fog)', borderRadius:2 }} />
              <div style={{ marginBottom:10 }}>
                <LogoOffre id={o.id} emoji={o.emoji} couleur={o.couleur} size={44} />
              </div>
              <div style={{ fontSize:9, color:'var(--mist)', textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:3 }}>{o.categorie}</div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--parch)', marginBottom:6, fontFamily:'var(--f-sans)' }}>{o.nom}</div>
              <div style={{ fontFamily:'var(--f-serif)', fontSize:22, fontWeight:300, color:'var(--gold)' }}>{o.bonus}</div>
              <div style={{ position:'absolute', top:10, right:10 }}>
                <FavBtn id={o.id} isFav={isFav(o.id)} onToggle={toggle} size={16} />
              </div>
            </button>
          </div>
        ))}
      </div>
    )}

    <FormulaireChallenge />
  </div>
</div>
```

);
}

// ─────────────────────────────────────────────────────────────
// PAGE AVIS
// ─────────────────────────────────────────────────────────────
function PageAvis() {
const avis = [
{ nom:“Lucas”, date:“Il y a 2 jours”, texte:“Super rapide pour Hello Bank, j’ai reçu mes 80€ comme prévu ! 🔥”, note:5 },
{ nom:“Sarah”, date:“La semaine dernière”, texte:“Le calculateur ProfitMaster est bluffant de précision.”, note:5 },
{ nom:“Tom”, date:“Il y a 1 mois”, texte:“Déjà 120€ de gains cumulés grâce aux offres crypto. Top !”, note:5 },
];
return (
<div style={styles.page}>
<div style={{ paddingTop:16 }}>
<div style={{ fontFamily:‘var(–f-serif)’, fontSize:42, fontWeight:300, color:‘var(–parch)’, marginBottom:4 }} className=“fr”>Avis</div>
<div style={{ fontSize:10, color:‘var(–mist)’, letterSpacing:‘3px’, textTransform:‘uppercase’, marginBottom:20 }} className=“fr fr1”>Communauté</div>
{avis.map((a, i) => (
<div key={i} className={`fr fr${i+1}`} style={{ …styles.card, padding:‘18px 16px’, marginBottom:10 }}>
<div style={{ display:‘flex’, justifyContent:‘space-between’, alignItems:‘flex-start’, marginBottom:10 }}>
<div>
<div style={{ fontWeight:600, color:‘var(–parch)’, fontSize:14 }}>{a.nom}</div>
<div style={{ fontSize:11, color:‘var(–mist)’, marginTop:2 }}>{a.date}</div>
</div>
<div style={{ color:‘var(–gold)’, fontSize:12, letterSpacing:1 }}>{‘★’.repeat(a.note)}</div>
</div>
<div style={{ width:20, height:1, background:‘var(–gold)’, marginBottom:10 }} />
<p style={{ fontSize:13, color:‘var(–silver)’, lineHeight:1.6, fontStyle:‘italic’ }}>”{a.texte}”</p>
</div>
))}
</div>
</div>
);
}

// ─────────────────────────────────────────────────────────────
// PAGE CALCULATEUR (ProfitMaster)
// ─────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat(‘fr-FR’, { style:‘currency’, currency:‘EUR’ }).format(n || 0);
const pct = (n) => `${(n || 0).toFixed(1)}%`;

function calcul(f) {
const prixVente  = parseFloat(f.prixVente)  || 0;
const matieres   = parseFloat(f.matieres)   || 0;
const transport  = parseFloat(f.transport)  || 0;
const outillage  = parseFloat(f.outillage)  || 0;
const autresFrais= parseFloat(f.autresFrais)|| 0;
const heures     = parseFloat(f.heures)     || 0;
const tauxH      = parseFloat(f.tauxHoraire)|| 0;
const taux       = parseFloat(f.tauxCotisations)|| 0;
const coutMain   = heures * tauxH;
const cotisations= (prixVente * taux) / 100;
const totalCharges = matieres + transport + outillage + autresFrais + coutMain + cotisations;
const beneficeNet  = prixVente - totalCharges;
const marge        = prixVente > 0 ? (beneficeNet / prixVente) * 100 : 0;
const sante        = marge >= 20 ? ‘Rentable’ : marge >= 0 ? ‘Risqué’ : ‘Déficitaire’;
return { prixVente, matieres, transport, outillage, autresFrais, coutMain, cotisations, totalCharges, beneficeNet, marge, sante };
}

function InputField({ label, value, onChange, placeholder, prefix }) {
return (
<div style={{ marginBottom:12 }}>
<label style={styles.label}>{label}</label>
<div style={{ position:‘relative’ }}>
<span style={{ position:‘absolute’, left:11, top:‘50%’, transform:‘translateY(-50%)’, color:‘var(–green)’, fontSize:12, fontWeight:700, pointerEvents:‘none’ }}>{prefix||‘€’}</span>
<input type=“number” min=“0” step=“0.01” value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder||‘0’} inputMode=“decimal” style={styles.input} />
</div>
</div>
);
}

function Bloc({ title, icon, children }) {
return (
<div style={styles.block}>
<div style={styles.blockHdr}>
<span style={{ fontSize:15 }}>{icon}</span>
<span style={styles.blockHdrTxt}>{title}</span>
<div style={styles.blockHdrRule} />
</div>
{children}
</div>
);
}

function PageCalculateur() {
const [fields, setFields] = useState({ prixVente:’’, matieres:’’, transport:’’, outillage:’’, autresFrais:’’, heures:’’, tauxHoraire:’’, tauxCotisations:‘21.2’, tauxPersonnalise:’’, tauxOption:‘21.2’ });
const [showPaywall, setShowPaywall] = useState(false);
const [pdfPaid, setPdfPaid] = useState(false);
const set = (k) => (v) => setFields(p => ({ …p, [k]: v }));
const res = calcul(fields);

useEffect(() => {
const params = new URLSearchParams(window.location.search);
if (params.get(‘paid’) === ‘true’) setPdfPaid(true);
}, []);

const tauxActuel = fields.tauxOption === ‘custom’ ? (parseFloat(fields.tauxPersonnalise) || 0) : parseFloat(fields.tauxOption);
useEffect(() => { setFields(p => ({ …p, tauxCotisations: String(tauxActuel) })); }, [tauxActuel]);

const santeColor = res.sante === ‘Rentable’ ? ‘var(–green)’ : res.sante === ‘Risqué’ ? ‘var(–amber)’ : ‘var(–red)’;
const santeIcon  = res.sante === ‘Rentable’ ? ‘↑’ : res.sante === ‘Risqué’ ? ‘~’ : ‘↓’;

return (
<div style={styles.page}>
<div style={{ paddingTop:16 }}>
<div style={{ fontFamily:‘var(–f-serif)’, fontSize:42, fontWeight:300, color:‘var(–parch)’, marginBottom:4 }} className=“fr”>Calculateur</div>
<div style={{ fontSize:10, color:‘var(–mist)’, letterSpacing:‘3px’, textTransform:‘uppercase’, marginBottom:20 }} className=“fr fr1”>Rentabilité en temps réel</div>

```
    <Bloc title="Revenus" icon="◈">
      <InputField label="Prix de vente estimé" value={fields.prixVente} onChange={set('prixVente')} />
    </Bloc>
    <Bloc title="Coûts Directs" icon="◆">
      <InputField label="Matières premières"  value={fields.matieres}    onChange={set('matieres')} />
      <InputField label="Transport / Essence"  value={fields.transport}   onChange={set('transport')} />
      <InputField label="Outillage"             value={fields.outillage}   onChange={set('outillage')} />
      <InputField label="Autres frais"          value={fields.autresFrais} onChange={set('autresFrais')} />
    </Bloc>
    <Bloc title="Temps Passé" icon="◉">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <InputField label="Heures" prefix="h" value={fields.heures}      onChange={set('heures')} />
        <InputField label="Taux/heure"         value={fields.tauxHoraire} onChange={set('tauxHoraire')} />
      </div>
      <div style={{ fontSize:11, color:'var(--mist)', marginTop:2 }}>Main d'œuvre : <span style={{ color:'var(--silver)' }}>{fmt(res.coutMain)}</span></div>
    </Bloc>
    <Bloc title="Fiscalité" icon="◇">
      <select value={fields.tauxOption} onChange={e => setFields(p => ({ ...p, tauxOption: e.target.value }))} style={styles.select}>
        {TAUX_OPTIONS.map(o => <option key={o.label} value={o.value === null ? 'custom' : String(o.value)}>{o.label}</option>)}
      </select>
      {fields.tauxOption === 'custom' && (
        <div style={{ marginTop:8 }}>
          <InputField label="Taux (%)" prefix="%" value={fields.tauxPersonnalise} onChange={set('tauxPersonnalise')} />
        </div>
      )}
      <div style={{ fontSize:11, color:'var(--mist)', marginTop:8 }}>Cotisations : <span style={{ color:'var(--silver)' }}>{fmt(res.cotisations)}</span></div>
    </Bloc>

    {res.prixVente > 0 && (
      <>
        {/* Santé */}
        <div style={{ background: res.sante === 'Rentable' ? 'rgba(61,255,160,.07)' : res.sante === 'Risqué' ? 'rgba(255,190,50,.07)' : 'rgba(255,92,92,.07)', border:'1.5px solid '+santeColor, borderRadius:'var(--r)', padding:'14px 18px', display:'flex', alignItems:'center', gap:14, marginBottom:10 }} className="fr">
          <div style={{ fontFamily:'var(--f-serif)', fontSize:48, color:santeColor, lineHeight:1 }}>{santeIcon}</div>
          <div>
            <div style={{ fontSize:9, color:'var(--mist)', textTransform:'uppercase', letterSpacing:'2px' }}>Santé du projet</div>
            <div style={{ fontFamily:'var(--f-serif)', fontSize:28, fontWeight:300, color:santeColor }}>{res.sante}</div>
          </div>
        </div>

        {/* Résultats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }} className="fr fr1">
          {[
            { l:'Bénéfice Net',    v:fmt(res.beneficeNet),  hi:true },
            { l:'Marge Nette',     v:pct(res.marge),        hi:false },
            { l:'Total Charges',   v:fmt(res.totalCharges), hi:false },
            { l:'Cotisations',     v:fmt(res.cotisations),  hi:false },
          ].map(({ l, v, hi }) => (
            <div key={l} style={{ background: hi ? 'var(--green-bg)' : 'var(--s1)', border:'1px solid '+(hi ? 'var(--green-bd)' : 'var(--v2)'), borderRadius:'var(--r-sm)', padding:'14px' }}>
              <div style={{ fontSize:9, color:'var(--mist)', textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:4 }}>{l}</div>
              <div style={{ fontFamily:'monospace', fontSize: hi ? 22 : 16, fontWeight:700, color: hi ? 'var(--green)' : 'var(--parch)' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Simulation mensuelle */}
        <Bloc title="Simulation Mensuelle" icon="↗">
          {[5,10,20,30,50].map(nb => (
            <div key={nb} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--bg)', borderRadius:'var(--r-sm)', padding:'10px 14px', marginBottom:6, border:'1px solid var(--v1)' }}>
              <span style={{ fontSize:12, color:'var(--silver)' }}><strong style={{ color:'var(--parch)' }}>{nb}</strong> clients / mois</span>
              <span style={{ fontFamily:'monospace', fontSize:14, fontWeight:700, color: res.beneficeNet*nb >= 2000 ? 'var(--green)' : 'var(--parch)' }}>{fmt(res.beneficeNet*nb)}</span>
            </div>
          ))}
        </Bloc>

        {/* PDF CTA */}
        <button onClick={() => pdfPaid ? alert('Fonctionnalité PDF disponible') : setShowPaywall(true)}
          style={{ ...styles.btnGold, marginTop:4, background: pdfPaid ? 'var(--green)' : 'var(--gold)', color: 'var(--bg)' }} className="fr fr2">
          {pdfPaid ? 'Télécharger mon Bilan PDF' : 'Bilan PDF — 2,00 €'}
        </button>
      </>
    )}

    {res.prixVente === 0 && (
      <div style={{ textAlign:'center', padding:'40px 0', color:'var(--fog)' }}>
        <div style={{ fontFamily:'var(--f-serif)', fontSize:64, fontWeight:300, opacity:.2, marginBottom:8 }}>◊</div>
        <p style={{ fontSize:13 }}>Renseignez votre prix de vente pour voir les résultats.</p>
      </div>
    )}
  </div>

  {/* Paywall Modal */}
  {showPaywall && (
    <div style={{ position:'fixed', inset:0, zIndex:998, background:'rgba(8,8,10,.9)', display:'flex', alignItems:'center', justifyContent:'center', padding:20, backdropFilter:'blur(10px)' }}>
      <div style={{ background:'var(--s1)', border:'1px solid var(--gold-bd)', borderRadius:'var(--r)', maxWidth:380, width:'100%', padding:'32px 28px', position:'relative' }}>
        <button onClick={() => setShowPaywall(false)} style={{ position:'absolute', top:14, right:14, background:'none', border:'none', color:'var(--mist)', fontSize:18, cursor:'pointer' }}>✕</button>
        <div style={{ fontFamily:'var(--f-serif)', fontSize:14, color:'var(--mist)', letterSpacing:'2px', textTransform:'uppercase', marginBottom:4 }}>Débloquer</div>
        <div style={{ fontFamily:'var(--f-serif)', fontSize:36, fontWeight:300, color:'var(--parch)', marginBottom:20 }}>Bilan PDF</div>
        <div style={{ background:'var(--bg)', borderRadius:'var(--r-sm)', padding:'18px', marginBottom:20, textAlign:'center', border:'1px solid var(--v2)' }}>
          <div style={{ fontFamily:'var(--f-serif)', fontSize:52, fontWeight:300, color:'var(--gold)' }}>2€</div>
          <div style={{ fontSize:11, color:'var(--mist)', marginTop:4 }}>Paiement sécurisé Stripe</div>
        </div>
        <button onClick={() => { window.open(STRIPE_LINK,'_blank'); setShowPaywall(false); }} style={styles.btnGold}>
          Payer et Télécharger →
        </button>
      </div>
    </div>
  )}
</div>
```

);
}

// ─────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────
export default function App() {
const [onglet, setOnglet] = useState(‘parrainage’);

useEffect(() => {
const style = document.createElement(‘style’);
style.textContent = GLOBAL_CSS;
document.head.appendChild(style);
return () => document.head.removeChild(style);
}, []);

return (
<div style={{ minHeight:‘100vh’, background:‘var(–bg)’, paddingBottom:80 }}>

```
  {/* HEADER */}
  <div style={{ background:'var(--s1)', borderBottom:'1px solid var(--v2)', padding:'20px 20px 16px', textAlign:'center', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(12px)' }}>
    <div style={{ fontSize:9, color:'var(--gold)', letterSpacing:'4px', textTransform:'uppercase', marginBottom:4, fontFamily:'var(--f-sans)' }}>Hub Financier</div>
    <div style={{ fontFamily:'var(--f-serif)', fontSize:32, fontWeight:300, color:'var(--gold)', letterSpacing:4 }}>Parr4in</div>
    <div style={{ fontSize:10, color:'var(--mist)', marginTop:3, letterSpacing:'1.5px' }}>Parrainages · Calculateur de rentabilité</div>
  </div>

  {/* CONTENT */}
  {onglet === 'parrainage'  && <PageParrainage />}
  {onglet === 'avis'        && <PageAvis />}
  {onglet === 'calculateur' && <PageCalculateur />}

  {/* BOTTOM NAV */}
  <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'var(--s1)', borderTop:'1px solid var(--v2)', display:'flex', zIndex:100, paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
    {[
      { id:'parrainage',  ico:'◈', label:'Parrainages' },
      { id:'avis',        ico:'◉', label:'Avis' },
      { id:'calculateur', ico:'◆', label:'Calculateur' },
    ].map((tab, i, arr) => (
      <React.Fragment key={tab.id}>
        {i > 0 && <div style={{ width:1, background:'var(--v1)', alignSelf:'stretch', margin:'6px 0' }} />}
        <button onClick={() => setOnglet(tab.id)} style={{ flex:1, background:'none', border:'none', padding:'12px 0 10px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
          <span style={{ fontSize:16, color: onglet===tab.id ? 'var(--gold)' : 'var(--fog)', transition:'color .2s' }}>{tab.ico}</span>
          <span style={{ fontSize:9, fontWeight:600, color: onglet===tab.id ? 'var(--gold)' : 'var(--fog)', textTransform:'uppercase', letterSpacing:'1.5px', fontFamily:'var(--f-sans)', transition:'color .2s' }}>{tab.label}</span>
          {onglet===tab.id && <div style={{ width:16, height:1, background:'var(--gold)', borderRadius:1 }} />}
        </button>
      </React.Fragment>
    ))}
  </div>
</div>
```

);
}

const container = document.getElementById(‘root’);
if (container) {
const root = createRoot(container);
root.render(<App />);
}