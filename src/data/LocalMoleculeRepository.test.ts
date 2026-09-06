import { describe, expect, it } from 'vitest';
import type { Molecule } from '../domain/molecule';
import { LocalMoleculeRepository } from './LocalMoleculeRepository';
import { molecules } from './molecules';
import { validateMolecules } from './validateMolecules';

describe('LocalMoleculeRepository', () => {
  const repository = new LocalMoleculeRepository(molecules);

  it('resolves water by exact composition', () => {
    expect(repository.findByComposition({ H: 2, O: 1 })).toMatchObject({
      id: 'water',
      formula: 'H2O',
      names: { ru: 'Вода', en: 'Water' },
    });
  });

  it('uses canonical composition rather than property insertion order', () => {
    expect(repository.findByComposition({ O: 1, H: 2 })?.id).toBe('water');
  });

  it('does not infer an unknown molecule', () => {
    expect(repository.findByComposition({ C: 2, H: 6 })).toBeUndefined();
  });

  it('does not match a partial composition', () => {
    expect(repository.findByComposition({ H: 2 })).toMatchObject({
      id: 'hydrogen',
    });
    expect(repository.findByComposition({ H: 2, O: 2 })).toMatchObject({
      id: 'hydrogen-peroxide',
    });
  });

  it('does not resolve invalid atom counts', () => {
    expect(repository.findByComposition({ H: -1 })).toBeUndefined();
  });
});

describe('curated molecule data', () => {
  it('contains every molecule required for the initial knowledge base', () => {
    expect(molecules.map(({ formula }) => formula)).toEqual([
      'H2',
      'O2',
      'N2',
      'Cl2',
      'H2O',
      'CO2',
      'CO',
      'NH3',
      'CH4',
      'HCl',
      'NaCl',
      'H2O2',
      'SO2',
      'SO3',
      'NO2',
    ]);
  });

  it('has valid formulas, localized names, atoms, bonds, and unique compositions', () => {
    expect(validateMolecules(molecules)).toEqual([]);
  });

  it('provides renderable graph data for a representative molecule', () => {
    const carbonDioxide = molecules.find(({ id }) => id === 'carbon-dioxide');
    expect(carbonDioxide).toMatchObject({
      atoms: [
        { id: 'o1', element: 'O', x: -85, y: 0 },
        { id: 'c1', element: 'C', x: 0, y: 0 },
        { id: 'o2', element: 'O', x: 85, y: 0 },
      ],
      bonds: [
        { from: 'o1', to: 'c1', order: 2 },
        { from: 'c1', to: 'o2', order: 2 },
      ],
    });
  });

  it('reports duplicate compositions and invalid bond references', () => {
    const invalidMolecule: Molecule = {
      ...molecules[0],
      id: 'invalid-hydrogen-copy',
      bonds: [{ from: 'h1', to: 'missing', order: 1 }],
    };
    const errors = validateMolecules([molecules[0], invalidMolecule]);

    expect(errors).toContain(
      'invalid-hydrogen-copy: duplicate composition H:2',
    );
    expect(errors).toContain(
      'invalid-hydrogen-copy: bond references an unknown atom',
    );
  });

  it('reports disagreement between the formula, graph, and composition', () => {
    const invalidMolecule: Molecule = {
      ...molecules[4],
      id: 'invalid-water',
      formula: 'H3O',
      atoms: molecules[4].atoms.slice(0, 2),
    };

    expect(validateMolecules([invalidMolecule])).toEqual([
      'invalid-water: formula and composition do not agree',
      'invalid-water: atoms and composition do not agree',
      'invalid-water: bond references an unknown atom',
    ]);
  });
});
