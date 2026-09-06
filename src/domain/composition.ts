/** IUPAC symbols for all 118 currently named chemical elements. */
export const elementSymbols = [
  'H',
  'He',
  'Li',
  'Be',
  'B',
  'C',
  'N',
  'O',
  'F',
  'Ne',
  'Na',
  'Mg',
  'Al',
  'Si',
  'P',
  'S',
  'Cl',
  'Ar',
  'K',
  'Ca',
  'Sc',
  'Ti',
  'V',
  'Cr',
  'Mn',
  'Fe',
  'Co',
  'Ni',
  'Cu',
  'Zn',
  'Ga',
  'Ge',
  'As',
  'Se',
  'Br',
  'Kr',
  'Rb',
  'Sr',
  'Y',
  'Zr',
  'Nb',
  'Mo',
  'Tc',
  'Ru',
  'Rh',
  'Pd',
  'Ag',
  'Cd',
  'In',
  'Sn',
  'Sb',
  'Te',
  'I',
  'Xe',
  'Cs',
  'Ba',
  'La',
  'Ce',
  'Pr',
  'Nd',
  'Pm',
  'Sm',
  'Eu',
  'Gd',
  'Tb',
  'Dy',
  'Ho',
  'Er',
  'Tm',
  'Yb',
  'Lu',
  'Hf',
  'Ta',
  'W',
  'Re',
  'Os',
  'Ir',
  'Pt',
  'Au',
  'Hg',
  'Tl',
  'Pb',
  'Bi',
  'Po',
  'At',
  'Rn',
  'Fr',
  'Ra',
  'Ac',
  'Th',
  'Pa',
  'U',
  'Np',
  'Pu',
  'Am',
  'Cm',
  'Bk',
  'Cf',
  'Es',
  'Fm',
  'Md',
  'No',
  'Lr',
  'Rf',
  'Db',
  'Sg',
  'Bh',
  'Hs',
  'Mt',
  'Ds',
  'Rg',
  'Cn',
  'Nh',
  'Fl',
  'Mc',
  'Lv',
  'Ts',
  'Og',
] as const;

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
