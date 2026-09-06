/** Element symbols supported by the initial curated learning content. */
export const elementSymbols = ['H', 'O', 'N', 'Cl', 'C', 'Na', 'S'] as const;

export type ElementSymbol = (typeof elementSymbols)[number];

/** Atom counts indexed by element symbol. Zero counts are allowed at boundaries. */
export type AtomComposition = Readonly<Partial<Record<ElementSymbol, number>>>;

export function isValidAtomCount(count: number): boolean {
  return Number.isSafeInteger(count) && count >= 0;
}

export function countAtoms(symbols: readonly ElementSymbol[]): AtomComposition {
  const counts: Partial<Record<ElementSymbol, number>> = {};

  for (const symbol of symbols) {
    counts[symbol] = (counts[symbol] ?? 0) + 1;
  }

  return counts;
}

export function normalizeComposition(composition: AtomComposition): string {
  const entries = Object.entries(composition) as [ElementSymbol, number][];

  if (entries.some(([, count]) => !isValidAtomCount(count))) {
    throw new RangeError('Atom counts must be non-negative safe integers');
  }

  return entries
    .filter(([, count]) => count > 0)
    .sort(([left], [right]) => left.localeCompare(right, 'en'))
    .map(([symbol, count]) => `${symbol}:${String(count)}`)
    .join('|');
}

export function normalizeAtoms(symbols: readonly ElementSymbol[]): string {
  return normalizeComposition(countAtoms(symbols));
}
