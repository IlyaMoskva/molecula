import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { molecules } from '../data/molecules';
import { MoleculeSvg } from './MoleculeSvg';

function molecule(id: string) {
  const result = molecules.find((candidate) => candidate.id === id);
  if (!result) throw new Error(`Missing test molecule: ${id}`);
  return result;
}

describe('MoleculeSvg', () => {
  it('renders single and double bonds from graph data', () => {
    const { container, rerender } = render(
      <MoleculeSvg molecule={molecule('water')} />,
    );
    expect(container.querySelectorAll('line')).toHaveLength(2);

    rerender(<MoleculeSvg molecule={molecule('carbon-dioxide')} />);
    expect(container.querySelectorAll('line')).toHaveLength(4);
  });

  it('preserves triple-bond rendering', () => {
    const { container } = render(
      <MoleculeSvg molecule={molecule('nitrogen')} />,
    );
    expect(container.querySelectorAll('line')).toHaveLength(3);
  });

  it('renders an ionic pair with charges and no invented bond', () => {
    const { container } = render(
      <MoleculeSvg molecule={molecule('sodium-chloride')} />,
    );
    expect(container.querySelectorAll('line')).toHaveLength(0);
    expect(container).toHaveTextContent('+');
    expect(container).toHaveTextContent('−');
  });

  it('has an accessible molecule label', () => {
    render(<MoleculeSvg molecule={molecule('water')} />);
    expect(
      screen.getByRole('img', { name: 'Структура: Вода, H2O' }),
    ).toBeInTheDocument();
  });
});
