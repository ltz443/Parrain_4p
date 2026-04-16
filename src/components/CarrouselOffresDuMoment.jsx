import React, { useState } from 'react';
import LogoOffre from './LogoOffre';
import Timer from './Timer'; // ✅ correction ici (chemin local)

// ─── CAROUSEL OFFRES DU MOMENT ────────────────────────────────────────────────
export function CarouselOffresDuMoment({ offres, onSelect }) {
  const offresBoostees = offres.filter(o => o.offresdumoment);

  if (offresBoostees.length === 0) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
          paddingLeft: 2,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#4FFFA0',
            boxShadow: '0 0 5px #4FFFA0',
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: '#4FFFA0',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Offres du moment
        </span>

        <div
          style={{
            flex: 1,
            height: 1,
            background: '#1A1E2A',
            marginLeft: 4,
          }}
        />

        <span style={{ fontSize: 10, color: '#4A5568', fontWeight: 600 }}>
          ⚡ Limité
        </span>
      </div>

      {/* Carousel */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          paddingBottom: 2,
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {offresBoostees.map(o => (
          <CarouselCard key={o.id} offre={o} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function CarouselCard({ offre, onSelect }) {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onClick={() => onSelect(offre)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        minWidth: 160,
        maxWidth: 160,
        scrollSnapAlign: 'start',
        background: '#111318',
        border: '1px solid #1A1E2A',
        borderRadius: 16,
        padding: '13px 12px',
        flexShrink: 0,
        cursor: 'pointer',
        transform: pressed ? 'scale(0.96)' : 'scale(1)',
        transition: 'transform 0.12s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: offre.couleur,
          opacity: 0.7,
          borderRadius: '16px 16px 0 0',
        }}
      />

      {/* Logo */}
      <div style={{ marginBottom: 8 }}>
        <LogoOffre
          id={offre.id}
          emoji={offre.emoji}
          couleur={offre.couleur}
          size={36}
          borderRadius={10}
        />
      </div>

      {/* Nom */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: '#E8EDF5',
          marginBottom: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {offre.nom}
      </div>

      {/* Bonus */}
      <div style={{ fontSize: 15, fontWeight: 900, color: '#4FFFA0' }}>
        {offre.boostLabel || offre.bonus}
      </div>

      {/* Timer */}
      {offre.dateFin && <Timer dateFin={offre.dateFin} />}

      {/* CTA */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(offre);
        }}
        style={{
          width: '100%',
          background: 'rgba(79,255,160,0.1)',
          border: '1px solid rgba(79,255,160,0.25)',
          borderRadius: 8,
          color: '#4FFFA0',
          fontSize: 12,
          fontWeight: 800,
          padding: '7px 0',
          cursor: 'pointer',
          marginTop: 8,
          display: 'block',
          fontFamily: 'inherit',
        }}
      >
        Profiter →
      </button>
    </div>
  );
}