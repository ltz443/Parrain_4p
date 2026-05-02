import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoOffre from './components/LogoOffre';
import CarouselOffresDuMoment from './components/CarrouselOffresDuMoment';
import Timer from './components/Timer';
import { useOffres } from './hooks/useOffres';

const CATEGORIES = ['Tout', 'Énergie', 'Banque', 'Cashback', 'Crypto', 'Or & Épargne', 'Play to Earn', 'Paris Sportifs'];

// ─── RUBAN DIAGONAL ──────────────────────────────────────────────────
function RubanIndisponible() {
  return (
    <div style={{
      position: 'absolute',
      width: '160%',
      padding: '8px 0',
      top: '38%',
      left: '-30%',
      transform: 'rotate(-45deg)',
      background: 'rgba(60,60,60,0.93)',
      backdropFilter: 'blur(4px)',
      textAlign: 'center',
      borderTop: '1px solid rgba(255,255,255,0.12)',
      borderBottom: '1px solid rgba(255,255,255,0.12)',
      zIndex: 10,
      pointerEvents: 'none',
    }}>
      <span style={{ color: '#aaa', fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>
        Indisponible
      </span>
    </div>
  );
}

// ─── COMPOSANT BOUTON PARTAGE (RÉ-INTÉGRÉ) ──────────────────────────
function BoutonPartage({ offre }) {
  const partager = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: offre.nom + ' - ' + offre.bonus,
          text: offre.shareText,
          url: offre.shareUrl,
        });
      } catch (e) { }
    } else {
      navigator.clipboard.writeText(offre.shareText + ' ' + offre.shareUrl);
      alert("Lien copié !");
    }
  };
  return (
    <button onClick={partager} style={{ width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 12, color: '#8A95AA', fontSize: 14, fontWeight: 700, padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, fontFamily: 'inherit' }}>
      📤 Partager cette offre
    </button>
  );
}

// ─── COMPOSANT CHALLENGE 3-EN-1 (NOUVEAU) ──────────────────────────
function Challenge3en1() {
  const [pseudo, setPseudo] = useState("");
  const [offres, setOffres] = useState("");
  const [methode, setMethode] = useState("revolut");
  const [compte, setCompte] = useState("");
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState(null);
  const [sent, setSent] = useState(false);
  const [spoilerProof, setSpoilerProof] = useState(false);
  const [spoilerMineur, setSpoilerMineur] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const isValid = pseudo.trim() && offres.trim() && compte.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("pseudo", pseudo);
    formData.append("offres", offres);
    formData.append("pay", methode);
    formData.append("id_paiement", compte);
    try {
      const res = await fetch("https://formspree.io/f/mreojpvq", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (res.ok) setSent(true);
    } catch (_) {
      setSent(true);
    }
  };

  return (
    <div style={{
      background: "#0d0d0d",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "28px 0",
      fontFamily: "'Outfit', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        .c3card {
          width: 100%;
          max-width: 390px;
          background: #141414;
          border: 1px solid rgba(74, 222, 128, 0.18);
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.5), 0 24px 60px rgba(0,0,0,0.5);
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .c3card.in { opacity: 1; transform: translateY(0); }

        .c3top-glow {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #4ade80 40%, #22c55e 60%, transparent 100%);
          opacity: 0.7;
        }

        .c3inner { padding: 26px 24px 28px; }

        .c3header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .c3label-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4ade80;
          opacity: 0.7;
          margin-bottom: 6px;
        }

        .c3main-title {
          font-size: 26px;
          font-weight: 800;
          color: #f0f0f0;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .c3main-title em { font-style: normal; color: #4ade80; }

        .c3trophy {
          font-size: 28px;
          line-height: 1;
          margin-top: 2px;
          filter: drop-shadow(0 0 8px rgba(74,222,128,0.3));
        }

        .c3reward-band {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(74, 222, 128, 0.06);
          border: 1px solid rgba(74, 222, 128, 0.14);
          border-radius: 14px;
          padding: 14px 18px;
          margin-bottom: 24px;
        }
        .c3reward-icon { font-size: 22px; flex-shrink: 0; }
        .c3reward-amount { font-size: 22px; font-weight: 800; color: #4ade80; letter-spacing: -0.02em; line-height: 1; margin-bottom: 2px; }
        .c3reward-main { font-size: 13px; color: #888; line-height: 1.4; }
        .c3reward-main strong { color: #4ade80; font-weight: 700; }

        .c3steps-row { display: flex; align-items: center; margin-bottom: 24px; }
        .c3step-item { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }

        .c3step-bubble {
          width: 26px; height: 26px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
          border: 1.5px solid #252525; color: #333; background: #1a1a1a;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(.22,1,.36,1);
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .c3step-bubble:hover {
          border-color: rgba(74,222,128,0.3);
          color: rgba(74,222,128,0.5);
          background: rgba(74,222,128,0.04);
        }
        .c3step-bubble.active {
          border-color: #4ade80; color: #4ade80;
          background: rgba(74,222,128,0.08);
          box-shadow: 0 0 10px rgba(74,222,128,0.25);
          transform: scale(1.1);
        }
        .c3step-bubble.done {
          border-color: rgba(74,222,128,0.45); color: #4ade80;
          background: rgba(74,222,128,0.05);
        }

        .c3step-text { font-size: 10.5px; font-weight: 500; color: #2e2e2e; letter-spacing: 0.04em; transition: color 0.2s; }
        .c3step-text.active { color: #4ade80; opacity: 0.85; }
        .c3step-text.done { color: rgba(74,222,128,0.5); }

        .c3step-line { flex: 1; height: 1px; background: #1e1e1e; margin: 0 8px; transition: background 0.3s; }
        .c3step-line.done { background: rgba(74,222,128,0.25); }

        .c3step-hint { display: none; }

        .c3field-wrap { margin-bottom: 12px; }
        .c3field-label {
          font-size: 11.5px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #666; margin-bottom: 6px; display: block;
        }

        .c3field-input {
          width: 100%;
          background: #1a1a1a;
          border: 1.5px solid #252525;
          border-radius: 10px;
          padding: 7px 8px;
          font-size: 13px;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          color: #e8e8e8;
          outline: none;
          text-align: center;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          -webkit-appearance: none;
        }
        .c3field-input::placeholder { color: #2c2c2c; font-weight: 400; }
        .c3field-input.focused {
          border-color: rgba(74, 222, 128, 0.45);
          background: rgba(74, 222, 128, 0.04);
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.07);
        }

        .c3method-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
        .c3method-card {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 9px 12px; border-radius: 10px;
          border: 1.5px solid #252525; background: #1a1a1a;
          cursor: pointer; transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .c3method-card.selected {
          border-color: rgba(74, 222, 128, 0.45);
          background: rgba(74, 222, 128, 0.05);
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.07);
        }
        .c3method-radio {
          width: 14px; height: 14px; border-radius: 50%;
          border: 1.5px solid #2e2e2e; background: transparent;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s;
        }
        .c3method-radio.on { border-color: #4ade80; background: #4ade80; }
        .c3method-radio.on::after { content: ''; width: 4px; height: 4px; border-radius: 50%; background: #0d0d0d; }
        .c3method-label { font-size: 13px; font-weight: 600; color: #999; transition: color 0.2s; }
        .c3method-card.selected .c3method-label { color: #e0e0e0; }

        .c3sep { height: 1px; background: linear-gradient(90deg, transparent, #1e1e1e, transparent); margin: 16px 0; }

        .c3cta-btn {
          width: 100%; padding: 12px;
          background: #4ade80; border: none; border-radius: 11px;
          font-family: 'Outfit', sans-serif; font-size: 14px;
          font-weight: 700; letter-spacing: 0.02em; color: #030f06;
          cursor: pointer; transition: all 0.22s ease; margin-top: 4px;
        }
        .c3cta-btn:hover:not(:disabled) {
          background: #22c55e; transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(74, 222, 128, 0.22);
        }
        .c3cta-btn:active:not(:disabled) { transform: translateY(0); }
        .c3cta-btn:disabled { background: #1c1c1c; color: #2a2a2a; cursor: not-allowed; }

        .c3spoilers-stack { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }

        .c3spoiler {
          border: 1.5px solid #1e1e1e;
          border-radius: 13px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .c3spoiler.open { border-color: rgba(74,222,128,0.2); }

        .c3spoiler-trigger {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 16px; cursor: pointer;
          background: #191919;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.2s;
          gap: 10px;
        }
        .c3spoiler.open .c3spoiler-trigger { background: rgba(74,222,128,0.04); }

        .c3spoiler-trigger-left { display: flex; align-items: center; gap: 9px; flex: 1; min-width: 0; }
        .c3spoiler-trigger-icon { font-size: 15px; flex-shrink: 0; }

        .c3spoiler-trigger-title {
          font-size: 12.5px; font-weight: 600; color: #555;
          letter-spacing: 0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .c3spoiler.open .c3spoiler-trigger-title { color: #aaa; }

        .c3spoiler.gold { border-color: rgba(251,191,36,0.15); }
        .c3spoiler.gold.open { border-color: rgba(251,191,36,0.28); }
        .c3spoiler.gold.open .c3spoiler-trigger { background: rgba(251,191,36,0.04); }
        .c3spoiler.gold.open .c3spoiler-trigger-title { color: #f5d060; }

        .c3spoiler-arrow {
          font-size: 10px; color: #333; flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(.22,1,.36,1);
        }
        .c3spoiler.open .c3spoiler-arrow { transform: rotate(180deg); color: #4ade80; }
        .c3spoiler.gold.open .c3spoiler-arrow { color: #f5d060; }

        .c3spoiler-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(.22,1,.36,1); }
        .c3spoiler.open .c3spoiler-body { max-height: 600px; }

        .c3spoiler-content { padding: 16px 16px 18px; border-top: 1px solid #1e1e1e; }
        .c3spoiler.gold .c3spoiler-content { border-top-color: rgba(251,191,36,0.1); }

        .c3spoiler-text { font-size: 13px; color: #555; line-height: 1.65; }
        .c3spoiler-text strong { color: #e0e0e0; font-weight: 600; }

        .c3insta-link {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          margin-top: 10px;
          background: rgba(74,222,128,0.07); border: 1px solid rgba(74,222,128,0.2);
          border-radius: 9px; padding: 8px 12px;
          font-size: 12px; font-weight: 700; color: #4ade80;
          text-decoration: none; transition: all 0.2s;
          width: auto;
        }
        .c3insta-link:hover { background: rgba(74,222,128,0.12); box-shadow: 0 4px 16px rgba(74,222,128,0.1); }

        .c3mineur-hook {
          font-size: 13.5px; color: #888; line-height: 1.65;
          margin-bottom: 16px;
          font-style: italic;
        }
        .c3mineur-hook strong { color: #f5d060; font-style: normal; font-weight: 700; }

        .c3mineur-steps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }

        .c3mineur-step {
          display: flex; align-items: flex-start; gap: 12px;
          background: rgba(251,191,36,0.04);
          border: 1px solid rgba(251,191,36,0.1);
          border-radius: 11px;
          padding: 12px 14px;
        }

        .c3mineur-step-num {
          width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
          background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: #f5d060;
          margin-top: 1px;
        }

        .c3mineur-step-text { font-size: 13px; color: #888; line-height: 1.55; }
        .c3mineur-step-text strong { color: #ddd; font-weight: 600; }

        .c3mineur-cta {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(251,191,36,0.07); border: 1px solid rgba(251,191,36,0.2);
          border-radius: 11px; padding: 13px 16px;
        }
        .c3mineur-cta-label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #a08800; margin-bottom: 2px; }
        .c3mineur-cta-value { font-size: 20px; font-weight: 800; color: #f5d060; letter-spacing: -0.02em; }
        .c3mineur-cta-right { font-size: 22px; }

        .c3success { padding: 36px 24px 40px; text-align: center; animation: c3fadeUp 0.45s ease forwards; }
        .c3success-circle {
          width: 64px; height: 64px; border-radius: 50%;
          background: rgba(74,222,128,0.1); border: 1.5px solid rgba(74,222,128,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; margin: 0 auto 18px;
        }
        .c3success-title { font-size: 22px; font-weight: 800; color: #f0f0f0; margin-bottom: 10px; letter-spacing: -0.01em; }
        .c3success-body { font-size: 13.5px; color: #444; line-height: 1.65; }
        .c3success-body strong { color: #4ade80; font-weight: 600; }

        @keyframes c3fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className={`c3card ${mounted ? "in" : ""}`}>
        <div className="c3top-glow" />

        {!sent ? (
          <div className="c3inner">

            <div className="c3header">
              <div>
                <span className="c3label-tag">Parrain 4P</span>
                <div className="c3main-title">Challenge <em>3-en-1</em></div>
              </div>
              <div className="c3trophy">🏆</div>
            </div>

            <div className="c3reward-band">
              <div className="c3reward-icon">🎁</div>
              <div>
                <div className="c3reward-amount">+10 €</div>
                <div className="c3reward-main">versés après <strong>3 offres</strong> validées</div>
              </div>
            </div>

            <div className="c3steps-row">
              {["Offre 1", "Offre 2", "Offre 3"].map((s, i) => {
                const stepNum = i + 1;
                const isActive = activeStep === stepNum;
                const isDone = activeStep > stepNum;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}>
                    <div className="c3step-item">
                      <div
                        className={`c3step-bubble${isActive ? " active" : isDone ? " done" : ""}`}
                        onClick={() => setActiveStep(stepNum)}
                      >
                        {isDone ? "✓" : isActive ? "✦" : stepNum}
                      </div>
                      <span className={`c3step-text${isActive ? " active" : isDone ? " done" : ""}`}>{s}</span>
                    </div>
                    {i < 2 && <div className={`c3step-line${isDone ? " done" : ""}`} />}
                  </div>
                );
              })}
            </div>



            <form onSubmit={handleSubmit}>

              <div className="c3field-wrap">
                <span className="c3field-label">Pseudo Instagram</span>
                <input
                  className={`c3field-input${focused === "pseudo" ? " focused" : ""}`}
                  placeholder="@ton_pseudo"
                  name="pseudo"
                  value={pseudo}
                  onChange={e => setPseudo(e.target.value)}
                  onFocus={() => setFocused("pseudo")}
                  onBlur={() => setFocused(null)}
                  required
                />
              </div>

              <div className="c3field-wrap">
                <span className="c3field-label">Les 3 offres choisies</span>
                <input
                  className={`c3field-input${focused === "offres" ? " focused" : ""}`}
                  placeholder="Ex : Boursorama, Lydia, Trade Republic"
                  name="offres"
                  value={offres}
                  onChange={e => setOffres(e.target.value)}
                  onFocus={() => setFocused("offres")}
                  onBlur={() => setFocused(null)}
                  required
                />
              </div>

              <div className="c3field-wrap">
                <span className="c3field-label">Méthode de versement</span>
                <div className="c3method-row">
                  {[
                    { id: "revolut", label: "Revolut" },
                    { id: "rib", label: "RIB" },
                  ].map(m => (
                    <div
                      key={m.id}
                      className={`c3method-card ${methode === m.id ? "selected" : ""}`}
                      onClick={() => setMethode(m.id)}
                    >
                      <div className={`c3method-radio ${methode === m.id ? "on" : ""}`} />
                      <span className="c3method-label">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="c3field-wrap">
                <span className="c3field-label">
                  {methode === "revolut" ? "Tag Revolut (@)" : "IBAN / RIB"}
                </span>
                <input
                  className={`c3field-input${focused === "compte" ? " focused" : ""}`}
                  placeholder={methode === "revolut" ? "@ton_tag" : "FR76..."}
                  name="id_paiement"
                  value={compte}
                  onChange={e => setCompte(e.target.value)}
                  onFocus={() => setFocused("compte")}
                  onBlur={() => setFocused(null)}
                  required
                />
              </div>

              <div className="c3sep" />

              <button type="submit" className="c3cta-btn" disabled={!isValid}>
                Envoyer ma demande →
              </button>

            </form>

            <div className="c3spoilers-stack">

              <div className={`c3spoiler ${spoilerProof ? "open" : ""}`}>
                <div className="c3spoiler-trigger" onClick={() => setSpoilerProof(!spoilerProof)}>
                  <div className="c3spoiler-trigger-left">
                    <span className="c3spoiler-trigger-icon">📸</span>
                    <span className="c3spoiler-trigger-title">Comment envoyer mes preuves ?</span>
                  </div>
                  <span className="c3spoiler-arrow">▼</span>
                </div>
                <div className="c3spoiler-body">
                  <div className="c3spoiler-content">
                    <p className="c3spoiler-text">
                      Une fois tes <strong>3 offres</strong> complétées, envoie-moi les captures d'écran de validation directement en DM sur Instagram.
                    </p>
                    <a
                      className="c3insta-link"
                      href="https://www.instagram.com/parrain_4p"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📩 Instagram · <strong>@parrain_4p</strong>
                    </a>
                  </div>
                </div>
              </div>

              <div className={`c3spoiler gold ${spoilerMineur ? "open" : ""}`}>
                <div className="c3spoiler-trigger" onClick={() => setSpoilerMineur(!spoilerMineur)}>
                  <div className="c3spoiler-trigger-left">
                    <span className="c3spoiler-trigger-icon">⚡</span>
                    <span className="c3spoiler-trigger-title">Tu es mineur ? Voici ta voie</span>
                  </div>
                  <span className="c3spoiler-arrow">▼</span>
                </div>
                <div className="c3spoiler-body">
                  <div className="c3spoiler-content">
                    <p className="c3mineur-hook">
                      Tu es motivé, débrouillard, mais limité par ton âge pour générer des revenus ?<br />
                      <strong>Ne laisse pas ça te freiner</strong> — il existe une alternative simple pour commencer.
                    </p>
                    <div className="c3mineur-steps">
                      {[
                        { n: 1, text: <React.Fragment>Tu partages <strong>mon lien ou code de parrainage</strong> (amis, famille, entourage)</React.Fragment> },
                        { n: 2, text: <React.Fragment>Ils s'inscrivent via l'une des offres que je propose et <strong>complètent les étapes</strong> jusqu'à l'obtention de la prime</React.Fragment> },
                        { n: 3, text: <React.Fragment>Tu me transmets les infos <strong>(prénom + offre utilisée)</strong></React.Fragment> },
                        { n: 4, text: <React.Fragment>Je te reverse <strong>25 % de la commission</strong> que je perçois</React.Fragment> },
                      ].map(s => (
                        <div className="c3mineur-step" key={s.n}>
                          <div className="c3mineur-step-num">{s.n}</div>
                          <div className="c3mineur-step-text">{s.text}</div>
                        </div>
                      ))}
                    </div>
                    <div className="c3mineur-cta">
                      <div>
                        <div className="c3mineur-cta-label">Ta part reversée</div>
                        <div className="c3mineur-cta-value">25 %</div>
                      </div>
                      <div className="c3mineur-cta-right">💰</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="c3success">
            <div className="c3success-circle">✅</div>
            <div className="c3success-title">Demande envoyée !</div>
            <p className="c3success-body">
              Tes <strong>3 offres</strong> sont en cours de vérification.<br />
              Tu recevras ton bonus de <strong>+10 €</strong> dès validation.<br /><br />
              N'oublie pas d'envoyer tes preuves sur<br />
              <strong>Instagram @parrain_4p</strong> 📸
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMPOSANT CHECKLIST (RÉ-INTÉGRÉ) ───────────────────────────────
function Checklist({ offreId, conditions }) {
  const storageKey = 'checklist_' + offreId;
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  const toggle = (i) => {
    const next = { ...checked, [i]: !checked[i] };
    setChecked(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const done = Object.values(checked).filter(Boolean).length;
  const total = conditions ? conditions.length : 0;

  if (total === 0) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#4FFFA0', textTransform: 'uppercase' }}>Progression</div>
        <div style={{ fontSize: 11, color: '#8A95AA' }}>{done}/{total}</div>
      </div>
      <div style={{ background: '#0A0B0F', height: 4, borderRadius: 2, marginBottom: 15, overflow: 'hidden' }}>
        <div style={{ background: '#4FFFA0', height: '100%', width: `${(done / total) * 100}%`, transition: '0.3s' }} />
      </div>
      {conditions.map((c, i) => (
        <div key={i} onClick={() => toggle(i)} style={{ display: 'flex', gap: 10, marginBottom: 8, cursor: 'pointer', alignItems: 'flex-start' }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, border: '2px solid ' + (checked[i] ? '#4FFFA0' : '#1E2230'), background: checked[i] ? '#4FFFA0' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {checked[i] && <span style={{ color: '#0A0B0F', fontSize: 10, fontWeight: 900 }}>✓</span>}
          </div>
          <span style={{ fontSize: 13, color: checked[i] ? '#4A5568' : '#8A95AA', textDecoration: checked[i] ? 'line-through' : 'none' }}>{c}</span>
        </div>
      ))}
    </div>
  );
}

// ─── COMPOSANT FAVBUTTON (RÉ-INTÉGRÉ) ──────────────────────────────
function FavButton({ id, isFav, toggle }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); toggle(id); }} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
      <span style={{ fontSize: 16, color: isFav ? '#FF4B4B' : '#FFF' }}>{isFav ? '❤️' : '🤍'}</span>
    </button>
  );
}

// ─── PAGE PRINCIPALE ────────────────────────────────────────────────
export default function PageParrainage({ favState }) {
  const { isFav, toggle, favOnly } = favState;
  const { offres, loading, error } = useOffres();
  const [filtre, setFiltre] = useState('Tout');
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const filtrees = offres.filter(o => {
    const matchCat = filtre === 'Tout' || o.categorie === filtre;
    const matchFav = !favOnly || isFav(o.id);
    return matchCat && matchFav;
  });

  const copier = (texte) => {
    navigator.clipboard.writeText(texte).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#4FFFA0', fontWeight: 700 }}>
        Chargement des offres...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#FF4B4B', fontWeight: 700 }}>
        Erreur: {error}
      </div>
    );
  }

  if (selected) {
    const o = selected;
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#4FFFA0', fontSize: 14, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>← Retour</button>
        <div style={{ background: '#111318', borderRadius: 20, padding: '24px 20px', border: '1px solid #1A1E2A', position: 'relative', overflow: 'hidden' }}>
          {o.Disponible_actuellement === false && <RubanIndisponible />}
          <FavButton id={o.id} isFav={isFav(o.id)} toggle={toggle} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <LogoOffre id={o.id} emoji={o.emoji} couleur={o.couleur} size={56} borderRadius={16} />
            <div>
              <div style={{ fontSize: 11, color: '#4A5568', textTransform: 'uppercase' }}>{o.categorie}</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#E8EDF5' }}>{o.nom}</h2>
            </div>
          </div>
          <p style={{ fontSize: 14, color: '#8A95AA', lineHeight: 1.6, marginBottom: 20 }}>{o.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            <div style={{ background: '#0A0B0F', borderRadius: 10, padding: '12px', textAlign: 'center', border: '1px solid #1A1E2A' }}>
              <div style={{ fontSize: 10, color: '#4A5568', textTransform: 'uppercase' }}>Prime parrain</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#4FFFA0' }}>{o.bonusParrain}</div>
            </div>
            <div style={{ background: '#0A0B0F', borderRadius: 10, padding: '12px', textAlign: 'center', border: '1px solid #1A1E2A' }}>
              <div style={{ fontSize: 10, color: '#4A5568', textTransform: 'uppercase' }}>Filleul reçoit</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#E8EDF5' }}>{o.bonusFilleul}</div>
            </div>
          </div>
          <Checklist offreId={o.id} conditions={o.conditions} />
          {o.type === 'code' && (
            <div style={{ background: '#0A0B0F', borderRadius: 12, padding: '16px', border: '1px dashed #4FFFA0', textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#4FFFA0', fontFamily: 'monospace' }}>{o.code}</div>
              <button onClick={() => copier(o.code)} style={{ marginTop: 10, background: '#4FFFA0', border: 'none', borderRadius: 8, color: '#0A0B0F', fontSize: 13, fontWeight: 700, padding: '8px 20px', cursor: 'pointer' }}>
                {copied ? "Copié !" : "Copier le code"}
              </button>
            </div>
          )}
          {o.type === 'lien' && (
            <a href={o.lien} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #4FFFA0, #2ECC71)', borderRadius: 12, color: '#0A0B0F', fontSize: 15, fontWeight: 800, padding: '14px', textDecoration: 'none', marginBottom: 10 }}>S'inscrire avec mon lien →</a>
          )}
          {o.id === 'hellobank' && (
            <a href="https://www.instagram.com/parrain_4p?igsh=bjFpNHJtNjM4MGs3" target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 12, color: '#8A95AA', fontSize: 14, fontWeight: 700, padding: '12px', cursor: 'pointer', textDecoration: 'none', textAlign: 'center', marginBottom: 10, fontFamily: 'inherit' }}>📸 Me contacter sur Instagram</a>
          )}
          <BoutonPartage offre={o} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
      <CarouselOffresDuMoment offres={offres} onSelect={(o) => navigate('/offres/' + o.id)} />
      <div style={{ marginBottom: 16, overflowX: 'auto', display: 'flex', gap: 8, paddingBottom: 4 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFiltre(cat)} style={{ background: filtre === cat ? '#4FFFA0' : '#111318', border: '1px solid ' + (filtre === cat ? '#4FFFA0' : '#1A1E2A'), borderRadius: 20, color: filtre === cat ? '#0A0B0F' : '#8A95AA', fontSize: 12, fontWeight: 700, padding: '6px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{cat}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtrees.map(o => (
          <div key={o.id} style={{ position: 'relative' }}>
            <FavButton id={o.id} isFav={isFav(o.id)} toggle={toggle} />
            <button
              onClick={() => navigate('/offres/' + o.id)}
              style={{ width: '100%', background: '#111318', border: '1px solid #1A1E2A', borderRadius: 16, padding: '16px 12px 12px', cursor: 'pointer', textAlign: 'left', minHeight: 180, position: 'relative', display: 'flex', flexDirection: 'column', fontFamily: 'inherit', overflow: 'hidden', justifyContent: 'space-between', opacity: o.Disponible_actuellement === false ? 0.7 : 1 }}
            >
              {o.Disponible_actuellement === false && <RubanIndisponible />}
              <LogoOffre id={o.id} emoji={o.emoji} couleur={o.couleur} size={40} borderRadius={10} />
              <div style={{ fontSize: 10, color: '#4A5568', marginTop: 10 }}>{o.categorie}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#E8EDF5' }}>{o.nom}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: o.couleur }}>{o.bonus}</div>
              {o.dateFin && <Timer dateFin={o.dateFin} />}
              <div style={{ alignSelf: 'flex-end', background: 'rgba(79, 255, 160, 0.05)', border: '1px solid #4FFFA0', borderRadius: 8, color: '#4FFFA0', fontSize: 11, fontWeight: 800, padding: '6px 12px', marginTop: 10, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Détail →</div>
            </button>
          </div>
        ))}
      </div>
      <Challenge3en1 />
    </div>
  );
}
