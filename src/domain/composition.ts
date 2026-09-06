/** A chemical element's standard symbol, for example H or Na. */
export type ElementSymbol = string;

/** Atom counts indexed by element symbol. Zero counts are allowed at boundaries. */
export type AtomComposition = Readonly<Record<ElementSymbol, number>>;

export function countAtoms(symbols: readonly ElementSymbol[]): AtomComposition {
  return symbols.reduce<Record<ElementSymbol, number>>((counts, symbol) => {
    counts[symbol] = (counts[symbol] ?? 0) + 1;
    return counts;
  }, {});
}

export function normalizeComposition(composition: AtomComposition): string {
  return Object.entries(composition)
    .filter(([, count]) => count > 0)
    .sort(([left], [right]) => left.localeCompare(right, 'en'))
    .map(([symbol, count]) => `${symbol}:${String(count)}`)
    .join('|');
}

export function normalizeAtoms(symbols: readonly ElementSymbol[]): string {
  return normalizeComposition(countAtoms(symbols));
}
