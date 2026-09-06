import { describe, expect, it } from 'vitest';
import { molecules } from '../data/molecules';
import {
  createTrainingTasks,
  getNextTrainingTask,
  validateTrainingAnswer,
} from './training';

describe('training use cases', () => {
  const tasks = createTrainingTasks(molecules);
  const waterTask = tasks[0];

  it('references curated molecules without duplicating chemistry facts', () => {
    expect(waterTask?.instruction).toBe('Соберите воду');
    expect(waterTask?.target).toBe(molecules.find(({ id }) => id === 'water'));
    expect(tasks).toHaveLength(molecules.length);
  });

  it.each([
    { H: 2, O: 1 },
    { O: 1, H: 2 },
  ] as const)(
    'accepts an exact water composition regardless of order',
    (answer) => {
      if (!waterTask) throw new Error('Missing water task');
      expect(validateTrainingAnswer(waterTask, answer)).toBe('correct');
    },
  );

  it('rejects a wrong composition', () => {
    if (!waterTask) throw new Error('Missing water task');
    expect(validateTrainingAnswer(waterTask, { H: 2 })).toBe('incorrect');
  });

  it('advances through the pool and wraps around', () => {
    const first = tasks[0];
    const second = tasks[1];
    const last = tasks.at(-1);
    if (!first || !second || !last) throw new Error('Incomplete training pool');

    expect(getNextTrainingTask(tasks, first)).toBe(second);
    expect(getNextTrainingTask(tasks, last)).toBe(first);
  });
});
