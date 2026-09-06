import {
  countAtoms,
  elementSymbols,
  isValidAtomCount,
  normalizeComposition,
  type AtomComposition,
  type ElementSymbol,
} from '../domain/composition';
import type { Molecule } from '../domain/molecule';

const formulaToken = /([A-Z][a-z]?)(\d*)/g;

function isElementSymbol(value: string): value is ElementSymbol {
  return elementSymbols.some((symbol) => symbol === value);
}

function compositionFromFormula(formula: string): AtomComposition | undefined {
  const composition: Partial<Record<ElementSymbol, number>> = {};
  let consumedCharacters = 0;

  for (const match of formula.matchAll(formulaToken)) {
    if (match.index !== consumedCharacters) return undefined;

    const symbol = match[1];
    const rawCount = match[2];
    if (!symbol || !isElementSymbol(symbol)) {
      return undefined;
    }

    const count = rawCount ? Number(rawCount) : 1;
    if (!isValidAtomCount(count) || count === 0) return undefined;

    composition[symbol] = (composition[symbol] ?? 0) + count;
    consumedCharacters += match[0].length;
  }

  return consumedCharacters === formula.length ? composition : undefined;
}

export function validateMolecules(
  molecules: readonly Molecule[],
): readonly string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const compositionKeys = new Set<string>();

  for (const molecule of molecules) {
    if (ids.has(molecule.id))
      errors.push(`${molecule.id}: duplicate molecule id`);
    ids.add(molecule.id);

    let compositionKey: string | undefined;
    try {
      compositionKey = normalizeComposition(molecule.composition);
    } catch {
      errors.push(`${molecule.id}: invalid atom counts`);
    }

    if (!compositionKey) {
      errors.push(`${molecule.id}: composition must not be empty`);
    } else if (compositionKeys.has(compositionKey)) {
      errors.push(`${molecule.id}: duplicate composition ${compositionKey}`);
    } else {
      compositionKeys.add(compositionKey);
    }

    const formulaComposition = compositionFromFormula(molecule.formula);
    if (
      !formulaComposition ||
      normalizeComposition(formulaComposition) !== compositionKey
    ) {
      errors.push(`${molecule.id}: formula and composition do not agree`);
    }

    if (!molecule.names.ru.trim() || !molecule.names.en.trim()) {
      errors.push(`${molecule.id}: Russian and English names are required`);
    }

    const atomIds = new Set<string>();
    for (const moleculeAtom of molecule.atoms) {
      if (atomIds.has(moleculeAtom.id)) {
        errors.push(`${molecule.id}: duplicate atom id ${moleculeAtom.id}`);
      }
      atomIds.add(moleculeAtom.id);

      if (
        !Number.isFinite(moleculeAtom.x) ||
        !Number.isFinite(moleculeAtom.y)
      ) {
        errors.push(
          `${molecule.id}: atom ${moleculeAtom.id} has invalid coordinates`,
        );
      }
    }

    const atomCompositionKey = normalizeComposition(
      countAtoms(molecule.atoms.map(({ element }) => element)),
    );
    if (atomCompositionKey !== compositionKey) {
      errors.push(`${molecule.id}: atoms and composition do not agree`);
    }

    for (const moleculeBond of molecule.bonds) {
      if (!atomIds.has(moleculeBond.from) || !atomIds.has(moleculeBond.to)) {
        errors.push(`${molecule.id}: bond references an unknown atom`);
      }
      if (moleculeBond.from === moleculeBond.to) {
        errors.push(`${molecule.id}: bond cannot connect an atom to itself`);
      }
      if (![1, 2, 3].includes(moleculeBond.order)) {
        errors.push(`${molecule.id}: invalid bond order`);
      }
    }
  }

  return errors;
}

export function assertValidMolecules(molecules: readonly Molecule[]): void {
  const errors = validateMolecules(molecules);
  if (errors.length > 0) {
    throw new Error(`Invalid molecule dataset:\n${errors.join('\n')}`);
  }
}
