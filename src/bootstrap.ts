import { createTrainingTasks } from './application';
import { molecules } from './data';

/** Application composition root: wires use cases to the curated local data source. */
export const trainingTasks = createTrainingTasks(molecules);
