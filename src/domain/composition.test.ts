import { describe, expect, it } from 'vitest';
import { normalizeAtoms, normalizeComposition } from './composition';

describe('canonical atom composition', () => {
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
