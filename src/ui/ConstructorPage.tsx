import { useReducer } from 'react';
import {
  atomSelectionReducer,
  emptyAtomSelection,
  getSelectionComposition,
  resolveSelection,
} from '../application';
import { moleculeRepository } from '../data';
import type { ElementSymbol } from '../domain/composition';
import { MoleculeResult } from './MoleculeResult';
import { PeriodicTable } from './PeriodicTable';
import { SelectionTray } from './SelectionTray';

export function ConstructorPage() {
  const [selection, dispatch] = useReducer(
    atomSelectionReducer,
    emptyAtomSelection,
  );
  const composition = getSelectionComposition(selection);
  const molecule = resolveSelection(moleculeRepository, selection);
  const hasSelection = selection.atoms.length > 0;

  const selectAtom = (symbol: ElementSymbol) => {
    dispatch({ type: 'add', symbol });
  };

  return (
    <main id="main" className="constructor-page">
      <MoleculeResult
        molecule={molecule}
        composition={composition}
        hasSelection={hasSelection}
      />
      <SelectionTray
        composition={composition}
        canUndo={hasSelection}
        onRemove={(symbol) => {
          dispatch({ type: 'remove', symbol });
        }}
        onUndo={() => {
          dispatch({ type: 'undo' });
        }}
        onClear={() => {
          dispatch({ type: 'clear' });
        }}
      />
      <PeriodicTable onSelect={selectAtom} selectedCounts={composition} />
    </main>
  );
}
