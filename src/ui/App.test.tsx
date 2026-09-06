import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

function add(symbolName: RegExp, times = 1) {
  const button = screen.getByRole('button', { name: symbolName });
  for (let click = 0; click < times; click += 1) fireEvent.click(button);
}

describe('molecule constructor', () => {
  it('builds and renders water from H, H, O', () => {
    render(<App />);

    add(/Водород, H, атомный номер 1, добавить атом/, 2);
    add(/Кислород, O, атомный номер 8, добавить атом/);

    expect(screen.getByText('Вещество найдено')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'H2O' })).toBeInTheDocument();
    expect(screen.getByText('Вода')).toBeInTheDocument();
    expect(screen.getByText('Выбрано: H ×2, O ×1')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Структура: Вода, H2O' }),
    ).toBeInTheDocument();
  });

  it('resolves the same molecule in a different click order', () => {
    render(<App />);

    add(/Кислород, O, атомный номер 8, добавить атом/);
    add(/Водород, H, атомный номер 1, добавить атом/, 2);

    expect(screen.getByText('Вода')).toBeInTheDocument();
  });

  it('shows no invented result and supports undo and clear', () => {
    render(<App />);

    add(/Водород, H, атомный номер 1, добавить атом/, 3);
    expect(
      screen.getByRole('heading', {
        name: 'Такого вещества пока нет в нашей базе',
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Отменить' }));
    expect(screen.getByText('Водород')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Очистить' }));
    expect(
      screen.getByRole('heading', { name: 'Собери вещество' }),
    ).toBeInTheDocument();
  });

  it('keeps unsupported periodic-table elements visible but disabled', () => {
    render(<App />);
    expect(
      screen.getByRole('button', {
        name: 'He, атомный номер 2, пока недоступен',
      }),
    ).toBeDisabled();
  });

  it('keeps the future training destination available', () => {
    render(<App />);
    const trainingButton = screen
      .getAllByRole('button', { name: 'Тренировка' })
      .at(0);
    expect(trainingButton).toBeDefined();
    if (trainingButton) fireEvent.click(trainingButton);
    expect(
      screen.getByRole('heading', { name: 'Тренировка скоро появится' }),
    ).toBeInTheDocument();
  });
});
