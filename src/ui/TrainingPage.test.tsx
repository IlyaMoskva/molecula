import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TrainingPage } from './TrainingPage';

function add(name: RegExp, times = 1) {
  const button = screen.getByRole('button', { name });
  for (let click = 0; click < times; click += 1) fireEvent.click(button);
}

describe('TrainingPage', () => {
  it('hides chemistry facts until an order-independent correct submission', () => {
    render(<TrainingPage />);

    expect(
      screen.getByRole('heading', { name: 'Соберите воду' }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('H2O')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    add(/Кислород, O, атомный номер 8, добавить атом/);
    add(/Водород, H, атомный номер 1, добавить атом/, 2);
    fireEvent.click(screen.getByRole('button', { name: 'Проверить' }));

    expect(screen.getByText('Правильно!')).toBeInTheDocument();
    expect(screen.getByLabelText('H2O')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Структура: Вода, H2O' }),
    ).toBeInTheDocument();
  });

  it('keeps a wrong selection editable and allows correction', () => {
    render(<TrainingPage />);

    add(/Водород, H, атомный номер 1, добавить атом/, 2);
    fireEvent.click(screen.getByRole('button', { name: 'Проверить' }));
    expect(screen.getByText('Пока не совпадает')).toBeInTheDocument();
    expect(screen.queryByLabelText('H2O')).not.toBeInTheDocument();

    add(/Кислород, O, атомный номер 8, добавить атом/);
    expect(screen.queryByText('Пока не совпадает')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Проверить' }));
    expect(screen.getByText('Правильно!')).toBeInTheDocument();
  });

  it('moves to the next task with a clean selection and result', () => {
    render(<TrainingPage />);

    add(/Водород, H, атомный номер 1, добавить атом/, 2);
    add(/Кислород, O, атомный номер 8, добавить атом/);
    fireEvent.click(screen.getByRole('button', { name: 'Проверить' }));
    fireEvent.click(screen.getByRole('button', { name: 'Следующее' }));

    expect(
      screen.getByRole('heading', { name: 'Соберите вещество «Водород»' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Пока ничего')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Проверить' })).toBeDisabled();
    expect(screen.queryByText('Правильно!')).not.toBeInTheDocument();
  });

  it('resets the current answer without changing the task', () => {
    render(<TrainingPage />);

    add(/Водород, H, атомный номер 1, добавить атом/);
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }));

    expect(
      screen.getByRole('heading', { name: 'Соберите воду' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Пока ничего')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Проверить' })).toBeDisabled();
  });
});
