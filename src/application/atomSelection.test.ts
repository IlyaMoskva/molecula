import { describe, expect, it } from 'vitest';
import { moleculeRepository, molecules } from '../data';
import {
  atomSelectionReducer,
  emptyAtomSelection,
  getSelectionComposition,
  resolveSelection,
  type AtomSelection,
} from './atomSelection';

describe('atom selection', () => {
  it('adds atoms and derives counts', () => {
    const selection = (['H', 'H', 'O'] as const).reduce<AtomSelection>(
      (state, symbol) => atomSelectionReducer(state, { type: 'add', symbol }),
      emptyAtomSelection,
    );

    expect(getSelectionComposition(selection)).toEqual({ H: 2, O: 1 });
    expect(resolveSelection(moleculeRepository, selection)?.id).toBe('water');
  });

  it('resolves water independently of selection order', () => {
    const selection: AtomSelection = { atoms: ['O', 'H', 'H'] };
    expect(resolveSelection(moleculeRepository, selection)?.id).toBe('water');
  });

  it('can resolve every curated molecule from its atoms', () => {
    for (const molecule of molecules) {
      const selection: AtomSelection = {
        atoms: molecule.atoms.map(({ element }) => element).reverse(),
      };
      expect(resolveSelection(moleculeRepository, selection)?.id).toBe(
        molecule.id,
      );
    }
  });

  it('removes the latest matching atom, undoes, and clears', () => {
    const selection: AtomSelection = { atoms: ['H', 'O', 'H'] };
    const removed = atomSelectionReducer(selection, {
      type: 'remove',
      symbol: 'H',
    });
    expect(removed.atoms).toEqual(['H', 'O']);
    expect(atomSelectionReducer(removed, { type: 'undo' }).atoms).toEqual([
      'H',
    ]);
    expect(atomSelectionReducer(removed, { type: 'clear' })).toEqual(
      emptyAtomSelection,
    );
  });

  it('returns no molecule for an unknown composition', () => {
    expect(
      resolveSelection(moleculeRepository, { atoms: ['Xe', 'Xe'] }),
    ).toBeUndefined();
  });
});
