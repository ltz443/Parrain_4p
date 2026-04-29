import React, { useState, useEffect, useCallback } from 'react';

const STRIPE_LINK = 'https://buy.stripe.com/14A8wPadZ2MmbRF0A4a3u00';
const TAUX_OPTIONS = [
  { label: "Auto-entrepreneur - Prestation (21.2%)", value: 21.2 },
  { label: "Auto-entrepreneur - Vente (12.8%)", value: 12.8 },
  { label: "EIRL / EI au réel (est. 45%)", value: 45 },
  { label: "Personnalisé", value: null },
];

const fmt = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0);
const pct = (n) => `${(n || 0).toFixed(1)}%`;

function calcul(f) {
  const prixVente = parseFloat(f.prixVente) || 0;
  const matieres = parseFloat(f.matieres) || 0;
  const transport = parseFloat(f.transport) || 0;
  const outillage = parseFloat(f.outillage) || 0;
  const autresFrais = parseFloat(f.autresFrais) || 0;
  const heures = parseFloat(f.heures) || 0;
  const tauxHoraire = parseFloat(f.tauxHoraire) || 0;
  const taux = parseFloat(f.tauxCotisations) || 0;
  const coutMain = heures * tauxHoraire;
  const cotisations = (prixVente * taux) / 100;
  const totalCharges = matieres + transport + outillage + autresFrais + coutMain + cotisations;
  const beneficeNet = prixVente - totalCharges;
  const marge = prixVente > 0 ? (beneficeNet / prixVente) * 100 : 0;
  let sante = "Déficitaire";
  if (marge >= 20) sante = "Rentable";
  else if (marge >= 0) sante = "Risqué";
  return { prixVente, matieres, transport, outillage, autresFrais, coutMain, cotisations, totalCharges, beneficeNet, marge, sante };
}

function InputField({ label, value, onChange, placeholder, prefix, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8A95AA', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4FFFA0', fontSize: 13, fontWeight: 700 }}>{prefix || '€'}</span>
        <input
          type="number" min="0" step="0.01" value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || '0'}
          inputMode="decimal"
          style={{ width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 8, color: '#E8EDF5', fontSize: 15, padding: '10px 12px 10px 30px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
        />
      </div>
      {hint && <p style={{ fontSize: 10, color: '#4A5568', marginTop: 3 }}>{hint}</p>}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ background: '#111318', borderRadius: 14, padding: '18px 16px', marginBottom: 12, border: '1px solid #1A1E2A' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h3 style={{ fontSize: 13, fontWeight: 800, color: '#4FFFA0', letterSpacing: '0.06em' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── GÉNÉRATION PDF ───────────────────────────────────────────────────────────
async function generatePDF(res, fields) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const couleurVerte = [79, 255, 160];
  const couleurNoire = [10, 11, 15];
  const couleurGrise = [138, 149, 170];
  const couleurTexte = [232, 237, 245];
  const W = 210;

  // Header
  doc.setFillColor(...couleurNoire);
  doc.rect(0, 0, W, 40, 'F');
  doc.setFillColor(...couleurVerte);
  doc.rect(0, 0, 4, 40, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...couleurVerte);
  doc.text('Parrain 4P', 14, 16);

  doc.setFontSize(11);
  doc.setTextColor(...couleurGrise);
  doc.text('ProfitMaster - Bilan financier', 14, 25);

  doc.setFontSize(9);
  doc.setTextColor(...couleurGrise);
  doc.text(`Généré le ${date}`, W - 14, 25, { align: 'right' });

  // Statut rentabilité
  const santeColor = res.sante === 'Rentable' ? [79, 255, 160] : res.sante === 'Risqué' ? [255, 200, 50] : [255, 80, 80];
  doc.setFillColor(...santeColor);
  doc.roundedRect(W - 50, 10, 36, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(10, 11, 15);
  doc.text(res.sante.toUpperCase(), W - 32, 16.5, { align: 'center' });

  // KPIs
  let y = 50;
  doc.setFillColor(17, 19, 24);
  doc.roundedRect(14, y, 85, 24, 3, 3, 'F');
  doc.setFillColor(17, 19, 24);
  doc.roundedRect(111, y, 85, 24, 3, 3, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...couleurGrise);
  doc.text('BÉNÉFICE NET', 56.5, y + 7, { align: 'center' });
  doc.text('MARGE NETTE', 153.5, y + 7, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...couleurVerte);
  doc.text(fmt(res.beneficeNet), 56.5, y + 18, { align: 'center' });
  doc.setTextColor(...couleurTexte);
  doc.text(pct(res.marge), 153.5, y + 18, { align: 'center' });

  // Tableau détail
  y = 84;
  doc.setFillColor(...couleurNoire);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...couleurVerte);
  doc.text('POSTE', 18, y + 5.5);
  doc.text('MONTANT', 175, y + 5.5, { align: 'right' });

  const lignes = [
    { label: 'Prix de vente', valeur: res.prixVente, highlight: true },
    { label: '- Matières premières', valeur: -res.matieres },
    { label: '- Transport / Essence', valeur: -res.transport },
    { label: '- Outillage', valeur: -res.outillage },
    { label: '- Autres frais', valeur: -res.autresFrais },
    { label: `- Main d'œuvre (${fields.heures}h x ${fields.tauxHoraire}€)`, valeur: -res.coutMain },
    { label: `- Cotisations (${fields.tauxCotisations}%)`, valeur: -res.cotisations },
    { label: 'TOTAL CHARGES', valeur: -res.totalCharges, bold: true },
    { label: 'BÉNÉFICE NET', valeur: res.beneficeNet, bold: true, highlight: true },
  ];

  y = 96;
  lignes.forEach((ligne, i) => {
    const bg = i % 2 === 0 ? [17, 19, 24] : [13, 14, 18];
    doc.setFillColor(...bg);
    doc.rect(14, y, 182, 9, 'F');

    if (ligne.bold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    doc.setFontSize(9);

    if (ligne.highlight) {
      doc.setTextColor(...couleurVerte);
    } else if (ligne.valeur < 0) {
      doc.setTextColor(255, 100, 100);
    } else {
      doc.setTextColor(...couleurTexte);
    }

    doc.text(ligne.label, 18, y + 6);
    doc.text(fmt(Math.abs(ligne.valeur)), 175, y + 6, { align: 'right' });
    y += 9;
  });

  // Section fiscalité
  y += 10;
  doc.setFillColor(...couleurNoire);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...couleurVerte);
  doc.text('RÉGIME FISCAL', 18, y + 5.5);

  y += 8;
  doc.setFillColor(17, 19, 24);
  doc.rect(14, y, 182, 9, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...couleurTexte);
  const tauxLabel = TAUX_OPTIONS.find(o => String(o.value) === fields.tauxOption)?.label || `Taux personnalisé (${fields.tauxCotisations}%)`;
  doc.text(tauxLabel, 18, y + 6);
  doc.text(`${fields.tauxCotisations}%`, 175, y + 6, { align: 'right' });

  // Footer
  y = 272;
  doc.setFillColor(...couleurNoire);
  doc.rect(0, y, W, 25, 'F');
  doc.setFillColor(...couleurVerte);
  doc.rect(0, y, W, 1, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...couleurGrise);
  doc.text('Généré par ProfitMaster - parrain-4p.vercel.app', W / 2, y + 8, { align: 'center' });
  doc.text('Document non contractuel - à titre indicatif uniquement', W / 2, y + 14, { align: 'center' });
  doc.setTextColor(...couleurVerte);
  doc.text('@parrain_4p', W / 2, y + 20, { align: 'center' });

  doc.save(`bilan-profitmaster-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function PageProfitMaster() {
  const [fields, setFields] = useState({
    prixVente: '', matieres: '', transport: '', outillage: '', autresFrais: '',
    heures: '', tauxHoraire: '', tauxCotisations: '21.2', tauxPersonnalise: '', tauxOption: '21.2',
  });
  const [showPaywall, setShowPaywall] = useState(false);
  const [pdfPaid, setPdfPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const setField = (key) => (val) => setFields((prev) => ({ ...prev, [key]: val }));
  const res = calcul(fields);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') === 'true') setPdfPaid(true);
  }, []);

  const handlePDFClick = useCallback(async () => {
    if (pdfPaid) {
      setLoading(true);
      try {
        await generatePDF(res, fields);
      } catch (err) {
        console.error('Erreur PDF :', err);
        alert('Erreur lors de la génération du PDF. Réessaie.');
      } finally {
        setLoading(false);
      }
    } else {
      setShowPaywall(true);
    }
  }, [pdfPaid, res, fields]);

  const handlePay = () => {
    window.open(STRIPE_LINK, '_blank');
    setShowPaywall(false);
  };

  const tauxActuel = fields.tauxOption === 'custom' ? (parseFloat(fields.tauxPersonnalise) || 0) : parseFloat(fields.tauxOption);
  useEffect(() => {
    setFields((prev) => ({ ...prev, tauxCotisations: String(tauxActuel) }));
  }, [tauxActuel]);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
      <Section title="REVENUS" icon="💰">
        <InputField label="Prix de vente estimé" value={fields.prixVente} onChange={setField('prixVente')} hint="Le montant facturé au client" />
      </Section>
      <Section title="COÛTS DIRECTS" icon="📦">
        <InputField label="Matières premières" value={fields.matieres} onChange={setField('matieres')} />
        <InputField label="Transport / Essence" value={fields.transport} onChange={setField('transport')} />
        <InputField label="Outillage" value={fields.outillage} onChange={setField('outillage')} />
        <InputField label="Autres frais" value={fields.autresFrais} onChange={setField('autresFrais')} />
      </Section>
      <Section title="TEMPS PASSÉ" icon="🕐">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <InputField label="Heures" prefix="h" value={fields.heures} onChange={setField('heures')} />
          <InputField label="Taux/heure" value={fields.tauxHoraire} onChange={setField('tauxHoraire')} />
        </div>
      </Section>
      <Section title="FISCALITÉ" icon="🏛️">
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <select value={fields.tauxOption} onChange={(e) => setFields((prev) => ({ ...prev, tauxOption: e.target.value }))}
            style={{ width: '100%', background: '#0A0B0F', border: '1.5px solid #1E2230', borderRadius: 8, color: '#E8EDF5', fontSize: 13, padding: '10px 12px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            {TAUX_OPTIONS.map((o) => (
              <option key={o.label} value={o.value === null ? 'custom' : String(o.value)}>{o.label}</option>
            ))}
          </select>
        </div>
        {fields.tauxOption === 'custom' && <InputField label="Taux (%)" prefix="%" value={fields.tauxPersonnalise} onChange={setField('tauxPersonnalise')} />}
      </Section>

      {res.prixVente > 0 && (
        <div style={{ marginTop: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div style={{ background: 'rgba(79,255,160,0.07)', border: '1.5px solid #4FFFA0', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: '#8A95AA', textTransform: 'uppercase', marginBottom: 3 }}>Bénéfice Net</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#4FFFA0', fontFamily: 'monospace' }}>{fmt(res.beneficeNet)}</div>
            </div>
            <div style={{ background: '#111318', border: '1.5px solid #1E2230', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: '#8A95AA', textTransform: 'uppercase', marginBottom: 3 }}>Marge Nette</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#E8EDF5', fontFamily: 'monospace' }}>{pct(res.marge)}</div>
            </div>
          </div>
          <button
            onClick={handlePDFClick}
            disabled={loading}
            style={{
              width: '100%',
              background: pdfPaid ? 'linear-gradient(135deg, #4FFFA0, #2ECC71)' : '#111318',
              border: '2px solid #4FFFA0',
              borderRadius: 12,
              color: pdfPaid ? '#0A0B0F' : '#4FFFA0',
              fontSize: 14,
              fontWeight: 800,
              padding: '14px',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'inherit',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '⏳ Génération en cours...' : pdfPaid ? '📄 Télécharger mon Bilan PDF' : '🔒 Télécharger le Bilan PDF - 2,00 €'}
          </button>
        </div>
      )}

      {showPaywall && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(5,6,10,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#111318', border: '1.5px solid #4FFFA0', borderRadius: 20, maxWidth: 400, width: '100%', padding: '32px 28px', position: 'relative' }}>
            <button onClick={() => setShowPaywall(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#4A5568', fontSize: 22, cursor: 'pointer' }}>✕</button>
            <h2 style={{ color: '#E8EDF5', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Sécurisez votre projet</h2>
            <button onClick={handlePay} style={{ width: '100%', background: 'linear-gradient(135deg, #4FFFA0, #2ECC71)', border: 'none', borderRadius: 12, color: '#0A0B0F', fontSize: 16, fontWeight: 800, padding: '15px', cursor: 'pointer', fontFamily: 'inherit' }}>
              Payer et Télécharger
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
