import { useReducer, useState } from 'react';
import {
  atomSelectionReducer,
  emptyAtomSelection,
  getNextTrainingTask,
  getSelectionComposition,
  validateTrainingAnswer,
  type TrainingResult,
  type TrainingTask,
} from '../application';
import { trainingTasks } from '../bootstrap';
import type { ElementSymbol } from '../domain/composition';
import { MoleculeSvg } from '../rendering';
import { Formula } from './Formula';
import { PeriodicTable } from './PeriodicTable';
import { SelectionTray } from './SelectionTray';

function getFirstTrainingTask(): TrainingTask {
  const task = trainingTasks[0];
  if (!task) throw new Error('Training requires at least one task');
  return task;
}

const firstTrainingTask = getFirstTrainingTask();

export function TrainingPage() {
  const [task, setTask] = useState<TrainingTask>(firstTrainingTask);
  const [selection, dispatch] = useReducer(
    atomSelectionReducer,
    emptyAtomSelection,
  );
  const [result, setResult] = useState<TrainingResult>('not-submitted');
  const composition = getSelectionComposition(selection);
  const hasSelection = selection.atoms.length > 0;
  const completed = result === 'correct';
  const taskNumber = trainingTasks.findIndex(({ id }) => id === task.id) + 1;

  const editSelection = (
    action:
      | { readonly type: 'add'; readonly symbol: ElementSymbol }
      | { readonly type: 'remove'; readonly symbol: ElementSymbol }
      | { readonly type: 'undo' },
  ) => {
    if (completed) return;
    dispatch(action);
    if (result === 'incorrect') setResult('not-submitted');
  };

  const reset = () => {
    dispatch({ type: 'clear' });
    setResult('not-submitted');
  };

  const next = () => {
    setTask(getNextTrainingTask(trainingTasks, task));
    reset();
  };

  return (
    <main id="main" className="training-page">
      <section
        className={`training-card training-${result}`}
        aria-labelledby="training-title"
      >
        <div className="training-copy">
          <p className="eyebrow">
            Задание {taskNumber} из {trainingTasks.length}
          </p>
          <h1 id="training-title">{task.instruction}</h1>
          {result === 'not-submitted' ? (
            <p className="training-guidance">
              Выберите нужные атомы. Формула откроется после правильного ответа.
            </p>
          ) : null}
          {result === 'incorrect' ? (
            <div className="training-feedback incorrect" role="status">
              <strong>Пока не совпадает</strong>
              <span>
                Проверьте количество выбранных атомов и попробуйте ещё раз.
              </span>
            </div>
          ) : null}
          {result === 'correct' ? (
            <div className="training-feedback correct" role="status">
              <strong>Правильно!</strong>
              <span className="training-formula">
                <Formula value={task.target.formula} /> · {task.target.names.ru}
              </span>
            </div>
          ) : null}
          <div className="training-actions">
            {!completed ? (
              <button
                className="primary-button"
                type="button"
                disabled={!hasSelection}
                onClick={() => {
                  setResult(validateTrainingAnswer(task, composition));
                }}
              >
                Проверить
              </button>
            ) : (
              <button className="primary-button" type="button" onClick={next}>
                Следующее
              </button>
            )}
            <button
              className="secondary-button"
              type="button"
              disabled={!hasSelection}
              onClick={reset}
            >
              Сбросить
            </button>
          </div>
        </div>
        <div className="training-visual">
          {completed ? (
            <MoleculeSvg molecule={task.target} />
          ) : (
            <div className="hidden-formula" aria-hidden="true">
              <span>?</span>
            </div>
          )}
        </div>
      </section>

      <SelectionTray
        composition={composition}
        canUndo={hasSelection && !completed}
        showClear={false}
        onRemove={(symbol) => {
          editSelection({ type: 'remove', symbol });
        }}
        onUndo={() => {
          editSelection({ type: 'undo' });
        }}
        onClear={reset}
      />
      <PeriodicTable
        selectedCounts={composition}
        interactionDisabled={completed}
        onSelect={(symbol) => {
          editSelection({ type: 'add', symbol });
        }}
      />
    </main>
  );
}
