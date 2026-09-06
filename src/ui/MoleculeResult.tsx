import type { AtomComposition, ElementSymbol } from '../domain/composition';
import type { Molecule } from '../domain/molecule';
import { MoleculeSvg } from '../rendering';
import { Formula } from './Formula';

export interface MoleculeResultProps {
  readonly molecule: Molecule | undefined;
  readonly composition: AtomComposition;
  readonly hasSelection: boolean;
}

function compositionLabel(composition: AtomComposition): string {
  return (Object.entries(composition) as [ElementSymbol, number][])
    .filter(([, count]) => count > 0)
    .map(([symbol, count]) => `${symbol} ×${String(count)}`)
    .join(', ');
}

export function MoleculeResult({
  molecule,
  composition,
  hasSelection,
}: MoleculeResultProps) {
  if (!hasSelection) {
    return (
      <section className="result-card result-empty" aria-live="polite">
        <div className="empty-orbit" aria-hidden="true">
          <span />
          <span />
        </div>
        <p className="eyebrow">Начни исследование</p>
        <h1>Собери молекулу</h1>
        <p>
          Нажимай на доступные элементы в таблице — выбранные атомы появятся
          здесь.
        </p>
      </section>
    );
  }

  if (!molecule) {
    return (
      <section className="result-card result-unknown" aria-live="polite">
        <span className="unknown-mark" aria-hidden="true">
          ?
        </span>
        <p className="eyebrow">Состав: {compositionLabel(composition)}</p>
        <h1>Такого вещества пока нет в нашей базе</h1>
        <p>
          Попробуй изменить набор атомов. Мы показываем только проверенные
          вещества.
        </p>
      </section>
    );
  }

  return (
    <section className="result-card result-known" aria-live="polite">
      <div className="result-copy">
        <p className="eyebrow">Молекула найдена</p>
        <h1>
          <Formula value={molecule.formula} />
        </h1>
        <p className="molecule-name">{molecule.names.ru}</p>
        <p className="composition-caption">
          Выбрано: {compositionLabel(composition)}
        </p>
      </div>
      <div className="molecule-view">
        <MoleculeSvg molecule={molecule} />
      </div>
    </section>
  );
}
