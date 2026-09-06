import { useState } from 'react';
import { ConstructorPage } from './ConstructorPage';
import { TrainingPage } from './TrainingPage';

type Destination = 'constructor' | 'training';

const destinations = [
  { id: 'constructor', label: 'Конструктор', icon: '⚛' },
  { id: 'training', label: 'Тренировка', icon: '◇' },
] as const;

export function App() {
  const [destination, setDestination] = useState<Destination>('constructor');

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        К основному содержимому
      </a>
      <header className="topbar">
        <a className="brand" href="#main" aria-label="Молекула — на главную">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
          </span>
          <span>Молекула</span>
        </a>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {destinations.map((item) => (
            <button
              className={
                destination === item.id ? 'nav-item active' : 'nav-item'
              }
              key={item.id}
              type="button"
              aria-current={destination === item.id ? 'page' : undefined}
              onClick={() => {
                setDestination(item.id);
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {destination === 'constructor' ? <ConstructorPage /> : <TrainingPage />}

      <nav className="mobile-nav" aria-label="Основная навигация">
        {destinations.map((item) => (
          <button
            className={
              destination === item.id
                ? 'mobile-nav-item active'
                : 'mobile-nav-item'
            }
            key={item.id}
            type="button"
            aria-current={destination === item.id ? 'page' : undefined}
            onClick={() => {
              setDestination(item.id);
            }}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
