import { useId } from 'react';
import type { BondOrder, Molecule, MoleculeAtom } from '../domain/molecule';

export interface MoleculeSvgProps {
  readonly molecule: Molecule;
}

function offsetsForBond(order: BondOrder): readonly number[] {
  switch (order) {
    case 1:
      return [0];
    case 2:
      return [-5, 5];
    case 3:
      return [-7, 0, 7];
  }
}

function chargeLabel(atom: MoleculeAtom): string | undefined {
  if (atom.charge === undefined || atom.charge === 0) return undefined;
  const magnitude = Math.abs(atom.charge);
  return `${magnitude === 1 ? '' : String(magnitude)}${atom.charge > 0 ? '+' : '−'}`;
}

export function MoleculeSvg({ molecule }: MoleculeSvgProps) {
  const titleId = useId();
  const atomsById = new Map(molecule.atoms.map((atom) => [atom.id, atom]));

  return (
    <svg
      className="molecule-svg"
      viewBox="-150 -115 300 230"
      role="img"
      aria-labelledby={titleId}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={titleId}>
        Структура: {molecule.names.ru}, {molecule.formula}
      </title>
      <g className="molecule-bonds" aria-hidden="true">
        {molecule.bonds.flatMap((moleculeBond, bondIndex) => {
          const from = atomsById.get(moleculeBond.from);
          const to = atomsById.get(moleculeBond.to);
          if (!from || !to) return [];

          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const length = Math.hypot(dx, dy);
          if (length === 0) return [];

          const normalX = -dy / length;
          const normalY = dx / length;
          return offsetsForBond(moleculeBond.order).map((offset, lineIndex) => (
            <line
              key={`${String(bondIndex)}-${String(lineIndex)}`}
              x1={from.x + normalX * offset}
              y1={from.y + normalY * offset}
              x2={to.x + normalX * offset}
              y2={to.y + normalY * offset}
            />
          ));
        })}
      </g>
      <g className="molecule-atoms">
        {molecule.atoms.map((atom) => {
          const charge = chargeLabel(atom);
          return (
            <g
              key={atom.id}
              className="molecule-atom"
              data-element={atom.element}
            >
              <circle cx={atom.x} cy={atom.y} r="28" />
              <text x={atom.x} y={atom.y} className="atom-symbol">
                {atom.element}
              </text>
              {charge ? (
                <text x={atom.x + 22} y={atom.y - 21} className="atom-charge">
                  {charge}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
