import { describe, expect, it } from 'vitest';
import { calcul } from './calcul';

describe('calcul', () => {
  it('calcule correctement la rentabilité d’un projet rentable', () => {
    const result = calcul({
      prixVente: '1000',
      matieres: '150',
      transport: '50',
      outillage: '25',
      autresFrais: '75',
      heures: '10',
      tauxHoraire: '30',
      tauxCotisations: '12.8',
    });

    expect(result.coutMain).toBe(300);
    expect(result.cotisations).toBe(128);
    expect(result.totalCharges).toBe(728);
    expect(result.beneficeNet).toBe(272);
    expect(result.marge).toBeCloseTo(27.2, 5);
    expect(result.sante).toBe('Rentable');
  });

  it('retourne un projet déficitaire quand les charges dépassent le prix de vente', () => {
    const result = calcul({
      prixVente: '200',
      matieres: '80',
      transport: '20',
      outillage: '10',
      autresFrais: '20',
      heures: '5',
      tauxHoraire: '30',
      tauxCotisations: '20',
    });

    expect(result.totalCharges).toBe(320);
    expect(result.beneficeNet).toBe(-120);
    expect(result.sante).toBe('Déficitaire');
  });
});
