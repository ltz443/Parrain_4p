import React from 'react';

const Skeleton = ({ width, height, borderRadius = 8, marginBottom = 10 }) => {
  return (
    <div style={{
      width: width || '100%',
      height: height || 20,
      borderRadius: borderRadius,
      marginBottom: marginBottom,
      background: 'linear-gradient(90deg, #1A1E2A 25%, #2D3748 50%, #1A1E2A 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-loading 1.5s infinite linear',
    }} />
  );
};

export const OffreSkeleton = () => {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <Skeleton width={60} height={20} marginBottom={20} /> {/* Bouton Retour */}
      <div style={{ background: '#111318', borderRadius: 20, padding: '24px 20px', border: '1px solid #1A1E2A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <Skeleton width={56} height={56} borderRadius={16} /> {/* Logo */}
          <div style={{ flex: 1 }}>
            <Skeleton width="40%" height={12} marginBottom={8} /> {/* Catégorie */}
            <Skeleton width="80%" height={24} /> {/* Titre */}
          </div>
        </div>
        <Skeleton width="100%" height={60} marginBottom={20} /> {/* Description */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <Skeleton height={60} borderRadius={10} /> {/* Prime 1 */}
          <Skeleton height={60} borderRadius={10} /> {/* Prime 2 */}
        </div>
        <Skeleton width="100%" height={100} borderRadius={12} marginBottom={12} /> {/* Checklist */}
        <Skeleton width="100%" height={50} borderRadius={12} /> {/* Bouton CTA */}
      </div>
    </div>
  );
};

export default Skeleton;
