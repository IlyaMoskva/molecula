import {
  countAtoms,
  type AtomComposition,
  type ElementSymbol,
} from '../domain/composition';
import type { Molecule, MoleculeRepository } from '../domain/molecule';

export interface AtomSelection {
  readonly atoms: readonly ElementSymbol[];
}

export type AtomSelectionAction =
  | { readonly type: 'add'; readonly symbol: ElementSymbol }
  | { readonly type: 'remove'; readonly symbol: ElementSymbol }
  | { readonly type: 'undo' }
  | { readonly type: 'clear' };

export const emptyAtomSelection: AtomSelection = { atoms: [] };

export function atomSelectionReducer(
  state: AtomSelection,
  action: AtomSelectionAction,
): AtomSelection {
  switch (action.type) {
    case 'add':
      return { atoms: [...state.atoms, action.symbol] };
    case 'remove': {
      const index = state.atoms.lastIndexOf(action.symbol);
      return index < 0
        ? state
        : { atoms: state.atoms.filter((_, atomIndex) => atomIndex !== index) };
    }
    case 'undo':
      return state.atoms.length === 0
        ? state
        : { atoms: state.atoms.slice(0, -1) };
    case 'clear':
      return emptyAtomSelection;
  }
}

export function getSelectionComposition(
  selection: AtomSelection,
): AtomComposition {
  return countAtoms(selection.atoms);
}

export function resolveSelection(
  repository: MoleculeRepository,
  selection: AtomSelection,
): Molecule | undefined {
  if (selection.atoms.length === 0) return undefined;
  return repository.findByComposition(getSelectionComposition(selection));
}
