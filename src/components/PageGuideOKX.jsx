import React from 'react';
import { Link } from 'react-router-dom';

const Step = ({ number, title, description, isLast, isCritical }) => (
  <div style={{ display: 'flex', gap: 20, position: 'relative', marginBottom: isLast ? 0 : 30 }}>
    {!isLast && (
      <div style={{
        position: 'absolute',
        left: 17,
        top: 34,
        bottom: -30,
        width: 2,
        background: isCritical ? '#FF4B4B' : '#4FFFA0',
        zIndex: 0
      }} />
    )}
    <div style={{
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: isCritical ? '#FF4B4B' : '#4FFFA0',
      color: '#0A0B0F',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      fontWeight: 900,
      flexShrink: 0,
      zIndex: 1,
      boxShadow: isCritical ? '0 0 15px rgba(255, 75, 75, 0.4)' : 'none'
    }}>
      {number}
    </div>
    <div style={{
      background: isCritical ? 'rgba(255, 75, 75, 0.05)' : '#111318',
      border: isCritical ? '1px solid rgba(255, 75, 75, 0.3)' : '1px solid #1A1E2A',
      borderRadius: 16,
      padding: '16px 20px',
      flex: 1,
      position: 'relative'
    }}>
      {isCritical && (
        <div style={{ 
          position: 'absolute', 
          top: -10, 
          right: 10, 
          background: '#FF4B4B', 
          color: '#fff', 
          fontSize: 9, 
          fontWeight: 900, 
          padding: '2px 8px', 
          borderRadius: 4,
          textTransform: 'uppercase'
        }}>
          Critique
        </div>
      )}
      <h3 style={{ fontSize: 16, fontWeight: 800, color: isCritical ? '#FF4B4B' : '#E8EDF5', margin: '0 0 8px 0' }}>{title}</h3>
      <div style={{ fontSize: 13, color: '#8A95AA', lineHeight: 1.5, margin: 0 }}>{description}</div>
    </div>
  </div>
);

export default function PageGuideOKX() {
  const steps = [
    {
      number: 1,
      title: "S’inscrire via le lien de parrainage",
      description: "Créer un compte OKX en utilisant le lien de parrainage. Obligatoire pour être éligible aux bonus."
    },
    {
      number: 2,
      title: "Valider son identité (KYC)",
      description: "Compléter la vérification d’identité (pièce d’identité + selfie). Nécessaire avant tout dépôt."
    },
    {
      number: 3,
      title: "Déposer 1 050 € par SEPA",
      description: "Effectuer un virement SEPA de 1 050 €. Cela permet de trader jusqu’à 10 000 € de volume en faisant tourner la même somme."
    },
    {
      number: 4,
      title: "⚠️ Passer en mode ÉCHANGE (CRITIQUE)",
      isCritical: true,
      description: "En haut de l’écran, basculer sur ÉCHANGE (interface avec graphiques et livre de commandes). NE PAS utiliser le mode Simple, sinon tu ne seras PAS éligible aux bonus."
    },
    {
      number: 5,
      title: "Trader du BTC : acheter → vendre → répéter",
      description: "Acheter du BTC puis le revendre immédiatement. Les achats ET les ventes comptent pour le volume. Exemple : acheter 500 € + vendre 500 € = 1 000 € de volume. Tu n’as pas besoin de 10 000 € : tu fais tourner tes 1 050 € autant de fois que nécessaire."
    },
    {
      number: 6,
      title: "Atteindre les paliers de bonus",
      description: (
        <ul style={{ margin: '8px 0 0 0', paddingLeft: 18 }}>
          <li>200 € de volume → 20 € de BTC gratuit</li>
          <li>2 000 € de volume → 80 € de BTC gratuit supplémentaires</li>
          <li>10 000 € de volume → 200 € de BTC gratuit supplémentaires</li>
          <li style={{ marginTop: 5, color: '#4FFFA0', fontWeight: 700 }}>Total possible : 300 € de BTC gratuit</li>
          <li style={{ fontSize: 11, marginTop: 5, listStyle: 'none', marginLeft: -18 }}>Le bonus est crédité environ 30 minutes après le trade.</li>
        </ul>
      )
    },
    {
      number: 7,
      title: "Retirer ses gains",
      description: "Le dépôt initial (1 050 €) est retirable immédiatement sur ton compte bancaire. Les récompenses (bonus BTC) sont retirables après 30 jours."
    }
  ];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
      <Link to="/offres/okx" style={{ color: '#4FFFA0', fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
        ← Retour
      </Link>
      
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#E8EDF5', marginBottom: 8, lineHeight: 1.2 }}>
          Comment valider ton parrainage OKX
        </h1>
        <p style={{ fontSize: 14, color: '#4A5568', margin: 0 }}>
          7 étapes pour réussir et gagner 300€
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
            isCritical={s.isCritical}
          />
        ))}
      </div>
    </div>
  );
}
