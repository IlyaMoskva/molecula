import { describe, expect, it } from 'vitest';
import { elementSymbols } from '../domain/composition';
import { periodicTableElements } from './periodicTable';

describe('periodic table data', () => {
  it('positions all 118 elements exactly once', () => {
    const symbols = periodicTableElements.map(({ symbol }) => symbol);
    expect(symbols).toHaveLength(118);
    expect(new Set(symbols).size).toBe(118);
    expect(new Set(symbols)).toEqual(new Set(elementSymbols));
  });

  it('uses recognizable conventional positions', () => {
    expect(
      periodicTableElements.find(({ symbol }) => symbol === 'H'),
    ).toMatchObject({
      atomicNumber: 1,
      row: 1,
      column: 1,
    });
    expect(
      periodicTableElements.find(({ symbol }) => symbol === 'He'),
    ).toMatchObject({
      atomicNumber: 2,
      row: 1,
      column: 18,
    });
    expect(
      periodicTableElements.find(({ symbol }) => symbol === 'La'),
    ).toMatchObject({
      atomicNumber: 57,
      row: 8,
      column: 3,
    });
  });
});
