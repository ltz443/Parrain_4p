import { useState, useEffect } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const SEED = [
{ id: "d27ef9db-d431-4168-b3b0-14d80690c162", nom: "Noa",     note: 5, texte: "Merci pour myfin",                                                                                          created_at: "2026-05-02 11:43:06.885476" },
{ id: "548d3e58-f8b4-44ea-aab5-2f6564a0cd0f", nom: "Many",    note: 5, texte: "Bourso 👌",                                                                                                  created_at: "2026-05-02 11:25:51.656685" },
{ id: "280a3d39-a486-4b4d-b885-5cc6f6d78bf3", nom: "Leo",     note: 5, texte: "Boursorama valider",                                                                                        created_at: "2026-05-01 22:43:34.103534" },
{ id: "228890fe-61af-4522-af69-6acb64a3b464", nom: "Diego",   note: 5, texte: "Prime hellobank reçus se matin",                                                                            created_at: "2026-04-29 00:17:16.722697" },
{ id: "da6e08fc-cf38-4d24-8b93-717d6847db1e", nom: "Laetitia",note: 5, texte: "5/5 joko",                                                                                                  created_at: "2026-04-27 22:51:54.42524"  },
{ id: "1d2805d6-28f9-4110-bd75-ea8f5358b228", nom: "Mathis",  note: 5, texte: "Rapide efficace merci chef ( winnamax )",                                                                   created_at: "2026-04-26 22:14:56.33427"  },
{ id: "edb9cb52-bffa-437f-b635-488c89180364", nom: "Thomas",  note: 5, texte: "Site très simple à comprendre avec des offres vérifiées qui fonctionnent vraiment !\nJe recommande fortement si vous voulez faire de l’argent rapidement", created_at: "2026-04-26 22:13:45.543419" },
{ id: "def4e26c-8d7f-44ce-b173-14b15e9ed08f", nom: "Kerry",   note: 5, texte: "Franchement très bon cite n’hésitez pas🔥",                                                                 created_at: "2026-04-26 21:22:23.065196" },
{ id: "896a85ef-6131-4b4b-8650-99106c1acf48", nom: "Koro",    note: 5, texte: "Trading 212 40€ en 10 minutes merci bg",                                                                    created_at: "2026-04-24 20:34:29.114262" },
{ id: "a4566482-d264-40cc-a0ed-36804b771872", nom: "Lolo",    note: 5, texte: "50 sur trading 212 merci beaucoup ^",                                                                       created_at: "2026-04-18 18:12:38.041598" },
];

async function fetchAvis() {
const res = await fetch(`${SUPABASE_URL}/rest/v1/avis?order=created_at.desc`, {
headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
});
return res.json();
}

async function insertAvis({ nom, note, texte }) {
const res = await fetch(`${SUPABASE_URL}/rest/v1/avis`, {
method: "POST",
headers: {
apikey: SUPABASE_KEY,
Authorization: `Bearer ${SUPABASE_KEY}`,
"Content-Type": "application/json",
Prefer: "return=representation",
},
body: JSON.stringify({ nom, note, texte }),
});
return res.json();
}

function formatDate(iso) {
if (!iso) return "";
return new Date(iso).toLocaleDateString("fr-FR");
}

function Stars({ value, interactive = false, onChange }) {
const [hovered, setHovered] = useState(0);
return (
<div style={{ display: "flex", gap: 3 }}>
{[1, 2, 3, 4, 5].map((star) => (
<span
key={star}
onClick={() => interactive && onChange(star)}
onMouseEnter={() => interactive && setHovered(star)}
onMouseLeave={() => interactive && setHovered(0)}
style={{
fontSize: interactive ? 28 : 15,
cursor: interactive ? "pointer" : "default",
color: star <= (hovered || value) ? "#f5a623" : "#2a2a2a",
transition: "color 0.15s, transform 0.1s",
transform: interactive && star <= (hovered || value) ? "scale(1.2)" : "scale(1)",
display: "inline-block",
userSelect: "none",
}}
>★</span>
))}
</div>
);
}

function Avatar({ name }) {
const colors = ["#00c37a", "#00a8e8", "#f5a623", "#e056fd", "#ff6b6b"];
const color = colors[(name || "?").charCodeAt(0) % colors.length];
return (
<div style={{
width: 36, height: 36, borderRadius: "50%",
background: color + "22", border: `1.5px solid ${color}55`,
display: "flex", alignItems: "center", justifyContent: "center",
fontSize: 14, fontWeight: 700, color, flexShrink: 0,
}}>
{(name || "?").slice(0, 1).toUpperCase()}
</div>
);
}

function RatingBar({ count, total, star }) {
const pct = total > 0 ? (count / total) * 100 : 0;
return (
<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
<span style={{ fontSize: 12, color: "#888", width: 8 }}>{star}</span>
<span style={{ fontSize: 11, color: "#f5a623" }}>★</span>
<div style={{ flex: 1, height: 5, background: "#1e1e1e", borderRadius: 99, overflow: "hidden" }}>
<div style={{ width: `${pct}%`, height: "100%", background: "#00c37a", borderRadius: 99, transition: "width 0.6s ease" }} />
</div>
<span style={{ fontSize: 11, color: "#555", width: 20, textAlign: "right" }}>{count}</span>
</div>
);
}

export default function PageAvis() {
const [allReviews, setAllReviews] = useState(SEED);
const [name, setName] = useState("");
const [rating, setRating] = useState(5);
const [text, setText] = useState("");
const [submitting, setSubmitting] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
fetchAvis()
.then((data) => { if (Array.isArray(data) && data.length > 0) setAllReviews(data); })
.catch(() => {});
}, []);

const ratingCounts = [5, 4, 3, 2, 1].map((s) => allReviews.filter((r) => r.note === s).length);
const currentAvg = allReviews.length
? (allReviews.reduce((s, r) => s + r.note, 0) / allReviews.length).toFixed(1)
: "0.0";

const handleSubmit = async () => {
if (!name.trim()) { setError("Entre ton prénom."); return; }
if (!text.trim()) { setError("Décris ton expérience."); return; }
setError(""); setSubmitting(true);
try {
const result = await insertAvis({ nom: name.trim(), note: rating, texte: text.trim() });
if (Array.isArray(result) && result[0]) setAllReviews([result[0], ...allReviews]);
else setAllReviews([{ id: Date.now(), nom: name.trim(), note: rating, texte: text.trim(), created_at: new Date().toISOString() }, ...allReviews]);
setName(""); setRating(5); setText("");
setSubmitted(true);
setTimeout(() => setSubmitted(false), 3000);
} catch {
setError("Erreur lors de l’envoi. Réessaie.");
}
setSubmitting(false);
};

return (
<div style={{ minHeight: "100vh", background: "#0d0d0d", fontFamily: "'DM Sans','Helvetica Neue',sans-serif", color: "#f0f0f0", padding: "0 0 80px" }}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap'); *{box-sizing:border-box;margin:0;padding:0} input,textarea{font-family:'DM Sans',sans-serif;outline:none} textarea{resize:none} .rc{animation:fadeUp 0.35s ease both} @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} .sb:active{transform:scale(0.97)} input:focus,textarea:focus{border-color:#00c37a!important}`}</style>

  {/* Header */}
  <div style={{ padding: "28px 20px 24px", borderBottom: "1px solid #1a1a1a" }}>
    <p style={{ fontSize: 11, fontWeight: 600, color: "#00c37a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Parrain 4P</p>
    <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
      Avis de la<br /><span style={{ color: "#00c37a" }}>Communauté</span>
    </h1>
  </div>

  {/* Stats */}
  <div style={{ padding: "20px 20px 0" }}>
    <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20, display: "flex", gap: 20 }}>
      <div style={{ textAlign: "center", minWidth: 72 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 46, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{currentAvg}</div>
        <Stars value={Math.round(parseFloat(currentAvg))} />
        <div style={{ fontSize: 11, color: "#555", marginTop: 5 }}>{allReviews.length} avis</div>
      </div>
      <div style={{ flex: 1, paddingTop: 4 }}>
        {[5, 4, 3, 2, 1].map((star, i) => (
          <RatingBar key={star} star={star} count={ratingCounts[i]} total={allReviews.length} />
        ))}
      </div>
    </div>
  </div>

  {/* Form */}
  <div style={{ padding: "16px 20px 0" }}>
    <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 14 }}>Partager mon expérience</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ton prénom"
        style={{ width: "100%", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 10, padding: "12px 14px", color: "#f0f0f0", fontSize: 14, marginBottom: 14, transition: "border-color 0.2s" }} />
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 11, color: "#555", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Note</p>
        <Stars value={rating} interactive onChange={setRating} />
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Décris ton expérience avec Parrain 4P…" rows={3}
        style={{ width: "100%", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 10, padding: "12px 14px", color: "#f0f0f0", fontSize: 14, marginBottom: 14, transition: "border-color 0.2s" }} />
      {error && <p style={{ fontSize: 12, color: "#ff6b6b", marginBottom: 10 }}>{error}</p>}
      {submitted ? (
        <div style={{ background: "#00c37a18", border: "1px solid #00c37a44", borderRadius: 10, padding: "12px 16px", textAlign: "center", fontSize: 13, color: "#00c37a", fontWeight: 600 }}>
          ✓ Avis publié — merci !
        </div>
      ) : (
        <button className="sb" onClick={handleSubmit} disabled={submitting}
          style={{ width: "100%", padding: "14px", background: submitting ? "#00c37a88" : "#00c37a", border: "none", borderRadius: 10, color: "#000", fontSize: 14, fontWeight: 700, cursor: submitting ? "default" : "pointer", transition: "opacity 0.15s, transform 0.1s" }}>
          {submitting ? "Envoi…" : "Publier mon avis"}
        </button>
      )}
    </div>
  </div>

  {/* Reviews */}
  <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
    {allReviews.map((r, i) => (
      <div key={r.id} className="rc" style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: 16, animationDelay: `${Math.min(i, 6) * 0.05}s` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Avatar name={r.nom} />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", display: "block", marginBottom: 3 }}>{r.nom}</span>
            <Stars value={r.note} />
          </div>
          <span style={{ fontSize: 11, color: "#444" }}>{formatDate(r.created_at)}</span>
        </div>
        <p style={{ fontSize: 13.5, color: "#bbb", lineHeight: 1.55, borderTop: "1px solid #1a1a1a", paddingTop: 10, whiteSpace: "pre-line" }}>
          {r.texte}
        </p>
      </div>
    ))}
  </div>
</div>

);
}
