import React, { useEffect, useState, useRef } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const DEFAULT_AVIS = [
  { nom: "Noa", texte: "Merci pour myfin", note: 5 },
  { nom: "Many", texte: "Bourso 👌", note: 5 },
  { nom: "Leo", texte: "Boursorama valider", note: 5 },
  { nom: "Diego", texte: "Prime hellobank reçus se matin", note: 5 },
  { nom: "Laetitia", texte: "5/5 joko", note: 5 },
  { nom: "Mathis", texte: "Rapide efficace merci chef", note: 5 },
];

export default function AvisMarquee() {
  const [avis, setAvis] = useState(DEFAULT_AVIS);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function loadAvis() {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/avis?select=nom,texte,note&order=created_at.desc&limit=10`, {
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        });
        const data = await res.json();
        if (data && data.length > 0) {
          setAvis(data);
        }
      } catch (e) {
        console.error("Erreur chargement avis marquee:", e);
      }
    }
    loadAvis();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId;
    let pos = 0;

    const scroll = () => {
      pos += 0.4; // Vitesse lente pour lisibilité
      if (pos >= container.scrollWidth / 2) {
        pos = 0;
      }
      container.scrollLeft = pos;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [avis]);

  // Doubler pour boucle infinie
  const items = [...avis, ...avis];

  return (
    <div style={{ 
      marginTop: 30, 
      marginBottom: 10, 
      overflow: 'hidden', 
      position: 'relative' 
    }}>
      <div 
        ref={scrollRef}
        style={{ 
          display: 'flex', 
          gap: 20, 
          overflowX: 'hidden', 
          whiteSpace: 'nowrap',
          padding: '10px 0'
        }}
      >
        {items.map((a, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            background: '#111318', 
            border: '1px solid #1A1E2A', 
            borderRadius: 12, 
            padding: '8px 16px',
            flexShrink: 0
          }}>
            <span style={{ color: '#4FFFA0', fontWeight: 900, fontSize: 13 }}>{a.nom}</span>
            <div style={{ width: 1, height: 12, background: '#1A1E2A' }} />
            <span style={{ color: '#8A95AA', fontSize: 13 }}>{a.texte}</span>
            <span style={{ fontSize: 11 }}>⭐</span>
          </div>
        ))}
      </div>
      {/* Gradients pour fondu sur les côtés */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 40, background: 'linear-gradient(to right, #0A0B0F, transparent)', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 40, background: 'linear-gradient(to left, #0A0B0F, transparent)', zIndex: 1 }} />
    </div>
  );
}
