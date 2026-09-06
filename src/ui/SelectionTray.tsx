import type { AtomComposition, ElementSymbol } from '../domain/composition';

export interface SelectionTrayProps {
  readonly composition: AtomComposition;
  readonly canUndo: boolean;
  readonly onRemove: (symbol: ElementSymbol) => void;
  readonly onUndo: () => void;
  readonly onClear: () => void;
}

export function SelectionTray({
  composition,
  canUndo,
  onRemove,
  onUndo,
  onClear,
}: SelectionTrayProps) {
  const selected = (
    Object.entries(composition) as [ElementSymbol, number][]
  ).filter(([, count]) => count > 0);

  return (
    <section className="selection-tray" aria-labelledby="selection-title">
      <div>
        <p className="tray-label" id="selection-title">
          Выбрано атомов
        </p>
        <div className="selection-list" aria-live="polite">
          {selected.length === 0 ? (
            <span className="empty-selection">Пока ничего</span>
          ) : (
            selected.map(([symbol, count]) => (
              <button
                className="selection-chip"
                key={symbol}
                type="button"
                aria-label={`Убрать один атом ${symbol}`}
                onClick={() => {
                  onRemove(symbol);
                }}
              >
                <strong>{symbol}</strong>
                <span>×{count}</span>
                <span aria-hidden="true">−</span>
              </button>
            ))
          )}
        </div>
      </div>
      <div className="tray-actions">
        <button
          type="button"
          className="text-button"
          disabled={!canUndo}
          onClick={onUndo}
        >
          Отменить
        </button>
        <button
          type="button"
          className="text-button danger"
          disabled={!canUndo}
          onClick={onClear}
        >
          Очистить
        </button>
      </div>
    </section>
  );
}
