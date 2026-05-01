import React, { useState } from 'react';

const LOGO_DOMAINS = {
  hellobank: 'hellobank.fr',
  joko: 'joko.com',
  okx: 'okx.com',
  veracash: 'veracash.com',
  robinhood: 'robinhood.com',
  winamax: 'winamax.fr',
  betsson: 'betsson.fr',
  engie: 'engie.fr',
  nordvpn: 'nordvpn.com',
  myfin: 'myfin.fr',
  scrambly: 'scrambly.io',
  kraken: 'kraken.com',
  fortuneo: 'fortuneo.fr',
  trading212: 'trading212.com',
  unibet: 'unibet.fr',
  boursorama: 'boursorama.com',
  bankin: 'bankin.com',
  poulpeo: 'poulpeo.com',
};

const LogoOffre = ({ id, emoji, couleur, size = 44, borderRadius = 12 }) => {
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
    return (
      <div style={{ ...wrapperStyle, fontSize: size * 0.5 }}>
        {emoji}
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <img
        src={`https://img.logo.dev/${domain}?token=pk_BXZXZrJITlWofFOzS8oAoA&size=128`}
        alt={id}
        onError={(e) => {
          e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
          setError(false);
        }}
        style={{
          width: '80%',
          height: '80%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export default LogoOffre;
