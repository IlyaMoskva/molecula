import type { CSSProperties } from 'react';
import { knowledgeBaseElements, periodicTableElements } from '../data';
import type { ElementSymbol } from '../domain/composition';
import type { Element } from '../domain/molecule';

export interface PeriodicTableProps {
  readonly onSelect: (symbol: ElementSymbol) => void;
  readonly selectedCounts: Readonly<Partial<Record<ElementSymbol, number>>>;
}

const supportedElements: ReadonlyMap<ElementSymbol, Element> = new Map(
  knowledgeBaseElements.map((element) => [element.symbol, element]),
);

export function PeriodicTable({
  onSelect,
  selectedCounts,
}: PeriodicTableProps) {
  return (
    <section className="periodic-section" aria-labelledby="periodic-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Добавляй атомы</p>
          <h2 id="periodic-title">Периодическая таблица</h2>
        </div>
        <p className="table-hint">Доступные элементы выделены цветом</p>
      </div>
      <div
        className="periodic-scroll"
        tabIndex={0}
        aria-label="Прокручиваемая таблица элементов"
      >
        <div className="periodic-table">
          <div
            className="series-placeholder lanthanide-placeholder"
            aria-hidden="true"
          >
            57–71
          </div>
          <div
            className="series-placeholder actinide-placeholder"
            aria-hidden="true"
          >
            89–103
          </div>
          {periodicTableElements.map((element) => {
            const supported = supportedElements.get(element.symbol);
            const count = selectedCounts[element.symbol] ?? 0;
            const style: CSSProperties = {
              gridColumn: element.column,
              gridRow: element.row,
            };
            const description = supported
              ? `${supported.names.ru}, ${element.symbol}, атомный номер ${String(element.atomicNumber)}, добавить атом`
              : `${element.symbol}, атомный номер ${String(element.atomicNumber)}, пока недоступен`;

            return (
              <button
                key={element.symbol}
                className={
                  supported ? 'element-cell supported' : 'element-cell'
                }
                style={style}
                type="button"
                disabled={!supported}
                aria-label={description}
                onClick={() => {
                  onSelect(element.symbol);
                }}
              >
                <span className="atomic-number">{element.atomicNumber}</span>
                <strong>{element.symbol}</strong>
                {count > 0 ? (
                  <span className="element-count">×{count}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
