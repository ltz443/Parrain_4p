import React from 'react';
import { Link } from 'react-router-dom';

const Step = ({ number, title, description, isLast }) => (
  <div style={{ display: 'flex', gap: 20, position: 'relative', marginBottom: isLast ? 0 : 30 }}>
    {!isLast && (
      <div style={{
        position: 'absolute',
        left: 17,
        top: 34,
        bottom: -30,
        width: 2,
        background: '#4FFFA0',
        zIndex: 0
      }} />
    )}
    <div style={{
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: '#4FFFA0',
      color: '#0A0B0F',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      fontWeight: 900,
      flexShrink: 0,
      zIndex: 1
    }}>
      {number}
    </div>
    <div style={{
      background: '#111318',
      border: '1px solid #1A1E2A',
      borderRadius: 16,
      padding: '16px 20px',
      flex: 1
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#E8EDF5', margin: '0 0 8px 0' }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#8A95AA', lineHeight: 1.5, margin: 0 }}>{description}</p>
    </div>
  </div>
);

export default function PageGuideScrambly() {
  const steps = [
    {
      number: 1,
      title: "Inscris-toi avec mon code",
      description: "Inscris-toi avec le code de parrainage G3HK9FA"
    },
    {
      number: 2,
      title: "Active le suivi",
      description: "Vérifie que tu es en Wi-Fi et que le suivi des applications est activé"
    },
    {
      number: 3,
      title: "Télécharge l'app FDJ",
      description: "Dans Scrambly, télécharge l'application FDJ si tu ne l'as jamais téléchargée. Elle doit être téléchargée via Scrambly, pas l'App Store directement"
    },
    {
      number: 4,
      title: "Crée ton compte FDJ",
      description: "Crée un compte, vérifie tes infos et dépose 5€ retirables immédiatement. Tu reçois +21€ sur Scrambly"
    },
    {
      number: 5,
      title: "Déjà un compte FDJ ?",
      description: "Si tu as déjà un compte ou l'app FDJ, utilise l'offre Audible à la place. Prends les 1 mois offerts qui valide le parrainage"
    }
  ];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
      <Link to="/offres/scrambly" style={{ color: '#4FFFA0', fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
        ← Retour
      </Link>
      
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#E8EDF5', marginBottom: 8, lineHeight: 1.2 }}>
          Comment valider ton parrainage Scrambly
        </h1>
        <p style={{ fontSize: 14, color: '#4A5568', margin: 0 }}>
          5 étapes pour réussir
        </p>
      </div>

      <div style={{ paddingLeft: 4 }}>
        {steps.map((s, i) => (
          <Step 
            key={i} 
            number={s.number} 
            title={s.title} 
            description={s.description} 
            isLast={i === steps.length - 1} 
          />
        ))}
      </div>
    </div>
  );
}
