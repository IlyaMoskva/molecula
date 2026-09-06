import type { AtomComposition, ElementSymbol } from './composition';

export interface LocalizedName {
  readonly ru: string;
  readonly en: string;
}

export interface Element {
  readonly symbol: ElementSymbol;
  readonly atomicNumber: number;
  readonly names: LocalizedName;
}

export interface MoleculeAtom {
  readonly id: string;
  readonly element: ElementSymbol;
  readonly x: number;
  readonly y: number;
}

export type BondOrder = 1 | 2 | 3;

export interface Bond {
  readonly from: string;
  readonly to: string;
  readonly order: BondOrder;
}

export interface Molecule {
  readonly id: string;
  readonly formula: string;
  readonly names: LocalizedName;
  readonly composition: AtomComposition;
  readonly atoms: readonly MoleculeAtom[];
  readonly bonds: readonly Bond[];
}

export interface MoleculeRepository {
  findByComposition(composition: AtomComposition): Molecule | undefined;
}
