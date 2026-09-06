import { useState } from 'react';

type Destination = 'constructor' | 'training';

const destinations = [
  { id: 'constructor', label: 'Конструктор', icon: '⚛' },
  { id: 'training', label: 'Тренировка', icon: '◇' },
] as const satisfies readonly {
  id: Destination;
  label: string;
  icon: string;
}[];

const content: Record<
  Destination,
  { eyebrow: string; title: string; text: string }
> = {
  constructor: {
    eyebrow: 'Исследуй состав веществ',
    title: 'Собирай молекулы из атомов',
    text: 'Выбирай элементы и смотри, какое вещество получится. Скоро здесь появится интерактивный конструктор.',
  },
  training: {
    eyebrow: 'Проверь свои знания',
    title: 'Тренируйся в своём темпе',
    text: 'Собирай заданные молекулы и получай понятную обратную связь. Упражнения появятся в следующем обновлении.',
  },
};

export function App() {
  const [destination, setDestination] = useState<Destination>('constructor');
  const current = content[destination];

  return (
    <div className="app-shell">
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

      <main id="main" className="main-content">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">{current.eyebrow}</p>
            <h1 id="page-title">{current.title}</h1>
            <p className="intro">{current.text}</p>
            <div className="coming-soon" role="status">
              <span aria-hidden="true">✦</span>
              Раздел готовится
            </div>
          </div>

          <div className="molecule-scene" aria-hidden="true">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <span className="bond bond-one" />
            <span className="bond bond-two" />
            <span className="atom atom-o">O</span>
            <span className="atom atom-h atom-h-one">H</span>
            <span className="atom atom-h atom-h-two">H</span>
          </div>
        </section>
      </main>

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
