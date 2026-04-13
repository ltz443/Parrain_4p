export const fmt = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0);
export const pct = (n) => `${(n || 0).toFixed(1)}%`;

export function calcul(f) {
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

  let sante = 'Déficitaire';
  if (marge >= 20) {
    sante = 'Rentable';
  } else if (marge >= 0) {
    sante = 'Risqué';
  }

  return {
    prixVente,
    matieres,
    transport,
    outillage,
    autresFrais,
    coutMain,
    cotisations,
    totalCharges,
    beneficeNet,
    marge,
    sante,
  };
}
