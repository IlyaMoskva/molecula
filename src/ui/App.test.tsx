import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('switches between future destinations', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Собирай молекулы из атомов' }),
    ).toBeInTheDocument();
    const trainingButtons = screen.getAllByRole('button', {
      name: 'Тренировка',
    });
    const trainingButton = trainingButtons.at(0);
    expect(trainingButton).toBeDefined();
    if (trainingButton) {
      fireEvent.click(trainingButton);
    }
    expect(
      screen.getByRole('heading', { name: 'Тренируйся в своём темпе' }),
    ).toBeInTheDocument();
  });
});
