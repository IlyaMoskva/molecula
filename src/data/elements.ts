import type { Element } from '../domain/molecule';

export const elements = [
  { symbol: 'H', atomicNumber: 1, names: { ru: 'Водород', en: 'Hydrogen' } },
  { symbol: 'C', atomicNumber: 6, names: { ru: 'Углерод', en: 'Carbon' } },
  { symbol: 'N', atomicNumber: 7, names: { ru: 'Азот', en: 'Nitrogen' } },
  { symbol: 'O', atomicNumber: 8, names: { ru: 'Кислород', en: 'Oxygen' } },
  { symbol: 'Na', atomicNumber: 11, names: { ru: 'Натрий', en: 'Sodium' } },
  { symbol: 'S', atomicNumber: 16, names: { ru: 'Сера', en: 'Sulfur' } },
  { symbol: 'Cl', atomicNumber: 17, names: { ru: 'Хлор', en: 'Chlorine' } },
] as const satisfies readonly Element[];
