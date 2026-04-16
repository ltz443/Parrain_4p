import React, { useState, useEffect } from 'react';
import LogoOffre from './LogoOffre';

function Timer({ dateFin }) {
  const calcRemaining = () => {
    const diff = new Date(dateFin).getTime() - Date.now();
    if (diff <= 0) return null;
    const s = Math.floor(diff / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    return { days, hours, minutes };
  };

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const i = setInterval(() => setRemaining(calcRemaining()), 60000);
    return () => clearInterval(i);
  }, [dateFin]);

  if (!remaining) return null;

  const label = remaining.days > 0 
    ? `${remaining.days}j ${remaining.hours}h` 
    : `${remaining.hours}h ${remaining.minutes}m`;

  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: 3, 
      background: 'rgba(255, 80, 80, 0.12)', 
      border: '1px solid rgba(255, 80, 80, 0.35)', 
      borderRadius: 5, 
      padding: '2px 5px', 
      marginTop: 4, 
      whiteSpace: 'nowrap', 
      lineHeight: 1 
    }}>
      <span style={{ fontSize: 9 }}>⏱️</span>
      <span style={{ fontSize: 9, fontWeight: 800, color: '#FF5050' }}>{label}</span>
    </span>
  );
}

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
        overflow: 'hidden' 
      }}
    >
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: 2, 
        background: offre.couleur, 
        opacity: 0.7, 
        borderRadius: '16px 16px 0 0' 
      }} />
      <div style={{ marginBottom: 8 }}>
        <LogoOffre id={offre.id} emoji={offre.emoji} couleur={offre.couleur} size={36} borderRadius={10} />
      </div>
      <div style={{ 
        fontSize: 13, 
        fontWeight: 800, 
        color: '#E8EDF5', 
        marginBottom: 2, 
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis' 
      }}>
        {offre.nom}
      </div>
      <div style={{ fontSize: 15, fontWeight: 900, color: '#4FFFA0' }}>
        {offre.boostLabel || offre.bonus}
      </div>
      {offre.dateFin && <Timer dateFin={offre.dateFin} />}
      <button 
        onClick={(e) => { e.stopPropagation(); onSelect(offre); }}
        style={{ 
          width: '100%', 
          background: 'rgba(79, 255, 160, 0.1)', 
          border: '1px solid rgba(79, 255, 160, 0.25)', 
          borderRadius: 8, 
          color: '#4FFFA0', 
          fontSize: 12, 
          fontWeight: 800, 
          padding: '7px 0', 
          cursor: 'pointer', 
          marginTop: 8, 
          display: 'block', 
          fontFamily: 'inherit' 
        }}
      >
        Profiter →
      </button>
    </div>
  );
}

export default function CarouselOffresDuMoment({ offres, onSelect }) {
  const offresBoostees = offres.filter(o => o.offresdumoment);
  if (offresBoostees.length === 0) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingLeft: 2 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4FFFA0', boxShadow: '0 0 5px #4FFFA0' }} />
        <span style={{ 
          fontSize: 11, 
          fontWeight: 800, 
          color: '#4FFFA0', 
          letterSpacing: '0.14em', 
          textTransform: 'uppercase' 
        }}>
          Offres du moment
        </span>
        <div style={{ flex: 1, height: 1, background: '#1A1E2A', marginLeft: 4 }} />
        <span style={{ fontSize: 10, color: '#4A5568', fontWeight: 600 }}>⚡ Limité</span>
      </div>
      <div style={{ 
        display: 'flex', 
        gap: 10, 
        overflowX: 'auto', 
        paddingBottom: 2, 
        scrollSnapType: 'x mandatory', 
        WebkitOverflowScrolling: 'touch', 
        scrollbarWidth: 'none' 
      }}>
        {offresBoostees.map(o => <CarouselCard key={o.id} offre={o} onSelect={onSelect} />)}
      </div>
    </div>
  );
}
