import { describe, expect, it } from 'vitest';
import {
  elementSymbols,
  normalizeAtoms,
  normalizeComposition,
} from './composition';

describe('canonical atom composition', () => {
  it('defines every currently named chemical element symbol exactly once', () => {
    expect(elementSymbols).toHaveLength(118);
    expect(new Set(elementSymbols).size).toBe(118);
  });

  it('supports elements outside the initial knowledge base', () => {
    expect(normalizeAtoms(['Xe', 'F', 'F'])).toBe('F:2|Xe:1');
  });

  it.each([
    ['H, H, O', ['H', 'H', 'O'] as const],
    ['O, H, H', ['O', 'H', 'H'] as const],
    ['H, O, H', ['H', 'O', 'H'] as const],
  ])('is independent of click order: %s', (_label, atoms) => {
    expect(normalizeAtoms(atoms)).toBe('H:2|O:1');
  });

  it('normalizes a single element', () => {
    expect(normalizeAtoms(['Na'])).toBe('Na:1');
  });

  it('sorts multiple elements deterministically', () => {
    expect(normalizeAtoms(['O', 'C', 'H'])).toBe('C:1|H:1|O:1');
  });

  it('preserves repeated counts', () => {
    expect(normalizeAtoms(['C', 'H', 'H', 'H', 'H'])).toBe('C:1|H:4');
  });

  it('normalizes an empty composition', () => {
    expect(normalizeAtoms([])).toBe('');
  });

  it('discards zero counts', () => {
    expect(normalizeComposition({ H: 2, O: 0 })).toBe('H:2');
  });

  it.each([-1, 1.5, Number.NaN])(
    'rejects an invalid atom count: %s',
    (count) => {
      expect(() => normalizeComposition({ H: count })).toThrow(RangeError);
    },
  );
});
