import { useCallback, useEffect, useState } from 'react';

export default function Timer({ dateFin }) {
  const calcRemaining = useCallback(() => {
    const now = Date.now();
    const end = new Date(dateFin).getTime();
    const diff = end - now;

    if (diff <= 0) {
      return null;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return { days, hours, minutes };
  }, [dateFin]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(calcRemaining());
    }, 60000);

    return () => clearInterval(interval);
  }, [calcRemaining]);

  if (!remaining) {
    return null;
  }

  const label = remaining.days > 0 ? `${remaining.days}j ${remaining.hours}h` : `${remaining.hours}h ${remaining.minutes}m`;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        background: 'rgba(255,80,80,0.12)',
        border: '1px solid rgba(255,80,80,0.35)',
        borderRadius: 5,
        padding: '2px 5px',
        marginTop: 4,
        width: 'fit-content',
        maxWidth: 'fit-content',
        flexShrink: 0,
        alignSelf: 'flex-start',
        whiteSpace: 'nowrap',
        lineHeight: 1,
      }}
    >
      <span style={{ fontSize: 9 }}>⏱️</span>
      <span style={{ fontSize: 9, fontWeight: 800, color: '#FF5050', letterSpacing: '0.03em' }}>{label}</span>
    </span>
  );
}
