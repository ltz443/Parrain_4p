import { useState } from 'react';
import { LOGO_DOMAINS } from '../data/logoDomains';

export default function LogoOffre({ id, emoji, couleur, size = 44, borderRadius = 12 }) {
  const [error, setError] = useState(false);
  const domain = LOGO_DOMAINS[id];

  const wrapperStyle = {
    width: size,
    height: size,
    borderRadius,
    background: `${couleur}22`,
    border: `1.5px solid ${couleur}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  };

  if (!domain || error) {
    return <div style={{ ...wrapperStyle, fontSize: size * 0.5 }}>{emoji}</div>;
  }

  return (
    <div style={wrapperStyle}>
      <img
        src={`https://img.logo.dev/${domain}?token=pk_BXZXZrJITlWofFOzS8oAoA&size=128`}
        alt={id}
        onError={(event) => {
          if (!error) {
            event.currentTarget.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
            setError(true);
          }
        }}
        style={{ width: '80%', height: '80%', objectFit: 'contain' }}
      />
    </div>
  );
}
