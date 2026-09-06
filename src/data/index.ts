import { LocalMoleculeRepository } from './LocalMoleculeRepository';
import { molecules } from './molecules';

export { knowledgeBaseElements, knowledgeBaseElementSymbols } from './elements';
export { LocalMoleculeRepository } from './LocalMoleculeRepository';
export { molecules } from './molecules';
export { assertValidMolecules, validateMolecules } from './validateMolecules';

export const moleculeRepository = new LocalMoleculeRepository(molecules);
