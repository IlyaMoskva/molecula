import {
  normalizeComposition,
  type AtomComposition,
} from '../domain/composition';
import type { Molecule, MoleculeRepository } from '../domain/molecule';
import { assertValidMolecules } from './validateMolecules';

export class LocalMoleculeRepository implements MoleculeRepository {
  readonly #moleculesByComposition: ReadonlyMap<string, Molecule>;

  constructor(molecules: readonly Molecule[]) {
    assertValidMolecules(molecules);
    this.#moleculesByComposition = new Map(
      molecules.map((molecule) => [
        normalizeComposition(molecule.composition),
        molecule,
      ]),
    );
  }

  findByComposition(composition: AtomComposition): Molecule | undefined {
    try {
      return this.#moleculesByComposition.get(
        normalizeComposition(composition),
      );
    } catch {
      return undefined;
    }
  }
}
