import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error, already_subscribed
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      setMessage('Email invalide');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'community_reviews' }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status === 'already_subscribed') {
          setStatus('already_subscribed');
          setMessage('Tu es déjà inscrit !');
        } else {
          setStatus('success');
          setMessage('Bienvenue dans la communauté !');
          setEmail('');
        }
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Impossible de rejoindre pour le moment');
    }
  };

  return (
    <div style={{ padding: "16px 20px 0" }}>
      <div style={{ 
        background: "#111", 
        border: "1px solid #1e1e1e", 
        borderRadius: 16, 
        padding: 24,
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background Accent */}
        <div style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          background: "#00c37a15",
          borderRadius: "50%",
          filter: "blur(30px)"
        }} />

        <h3 style={{ 
          fontFamily: "'Syne', sans-serif", 
          fontSize: 20, 
          fontWeight: 800, 
          color: "#fff", 
          marginBottom: 8 
        }}>
          Rejoins la <span style={{ color: "#00c37a" }}>Newsletter</span>
        </h3>
        <p style={{ 
          fontSize: 13, 
          color: "#888", 
          lineHeight: 1.5, 
          marginBottom: 20 
        }}>
          Reçois les meilleurs plans de parrainage et les nouveaux avis directement par email.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              disabled={status === 'loading' || status === 'success'}
              style={{
                width: "100%",
                background: "#0d0d0d",
                border: "1px solid #1e1e1e",
                borderRadius: 10,
                padding: "14px 16px",
                color: "#f0f0f0",
                fontSize: 14,
                transition: "all 0.2s ease",
                outline: "none"
              }}
            />
          </div>

          {message && (
            <p style={{ 
              fontSize: 12, 
              color: status === 'success' || status === 'already_subscribed' ? "#00c37a" : "#ff6b6b",
              fontWeight: 500
            }}>
              {status === 'success' ? '✓ ' : ''}{message}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            style={{
              width: "100%",
              padding: "14px",
              background: status === 'success' ? "#00c37a22" : "#00c37a",
              border: status === 'success' ? "1px solid #00c37a44" : "none",
              borderRadius: 10,
              color: status === 'success' ? "#00c37a" : "#000",
              fontSize: 14,
              fontWeight: 700,
              cursor: (status === 'loading' || status === 'success') ? "default" : "pointer",
              transition: "all 0.2s ease",
              opacity: status === 'loading' ? 0.7 : 1
            }}
          >
            {status === 'loading' ? 'Inscription...' : status === 'success' ? 'Inscrit !' : 'Rejoindre maintenant'}
          </button>
        </form>
        
        <p style={{ fontSize: 10, color: "#444", marginTop: 12, textAlign: "center" }}>
          Pas de spam. Désinscription en un clic.
        </p>
      </div>
    </div>
  );
}
