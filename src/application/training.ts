import {
  normalizeComposition,
  type AtomComposition,
} from '../domain/composition';
import type { Molecule } from '../domain/molecule';

export type TrainingResult = 'not-submitted' | 'correct' | 'incorrect';

export interface TrainingTask {
  readonly id: string;
  /** The source of all chemistry facts for this exercise. */
  readonly target: Molecule;
  readonly instruction: string;
}

export function createTrainingTasks(
  molecules: readonly Molecule[],
): readonly TrainingTask[] {
  const water = molecules.find(({ id }) => id === 'water');
  const orderedMolecules = water
    ? [water, ...molecules.filter(({ id }) => id !== water.id)]
    : [...molecules];

  return orderedMolecules.map((target, index) => ({
    id: `composition-${target.id}`,
    target,
    instruction:
      index === 0 ? 'Соберите воду' : `Соберите вещество «${target.names.ru}»`,
  }));
}

export function validateTrainingAnswer(
  task: TrainingTask,
  answer: AtomComposition,
): TrainingResult {
  return normalizeComposition(answer) ===
    normalizeComposition(task.target.composition)
    ? 'correct'
    : 'incorrect';
}

export function getNextTrainingTask(
  tasks: readonly TrainingTask[],
  currentTask: TrainingTask,
): TrainingTask {
  if (tasks.length === 0)
    throw new Error('Training task pool must not be empty');
  const currentIndex = tasks.findIndex(({ id }) => id === currentTask.id);
  const nextTask = tasks[(currentIndex + 1) % tasks.length];
  if (!nextTask) throw new Error('Training task pool must not be empty');
  return nextTask;
}
