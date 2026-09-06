# Molecula — UX direction

## Product feel

Molecula should feel like a small modern educational tool, not a chemistry database and not a developer dashboard.

Priorities:
1. immediately understandable interaction;
2. large touch targets;
3. visual feedback after every atom selection;
4. molecule/result is more visually important than explanatory text;
5. calm, clean presentation suitable for a school student.

## Main navigation

Two primary modes:

- `Конструктор`
- `Тренировка`

On mobile, a compact bottom navigation or equally obvious two-mode switch is acceptable. On wider screens it may become top navigation. Avoid nested navigation in MVP.

## Constructor screen

Recommended hierarchy:

```text
┌──────────────────────────────┐
│ Молекула                     │
│ Конструктор | Тренировка     │
├──────────────────────────────┤
│ Выбрано: H ×2   O ×1         │
│ [отменить] [очистить]        │
├──────────────────────────────┤
│                              │
│            H₂O               │
│            Вода              │
│                              │
│          H — O — H           │
│                              │
├──────────────────────────────┤
│ Периодическая таблица        │
│ [H] [He] ...                 │
│ ...                          │
└──────────────────────────────┘
```

Before a known molecule is found, the result area should remain useful rather than disappear. It may show a short instruction or `Такой молекулы пока нет в нашей базе` after a non-empty unknown composition.

## Periodic table

The conventional layout must remain recognizable.

Element cell:

```text
┌────────┐
│  8     │
│   O    │
│oxygen? │  optional if space allows
└────────┘
```

Required in MVP:
- atomic number;
- element symbol;
- supported/interactive state;
- disabled/muted state for unsupported learning content;
- obvious pressed/selected feedback.

The table must not become unreadably tiny merely to fit the full width on a phone. Horizontal scrolling is preferable to shrinking touch targets below practical size.

## Selected atoms

Show counts, not only a raw click history.

Preferred:

```text
H ×2   O ×1
```

A learner should be able to remove an accidental selection without clearing everything.

## Molecule graphic

Use simple SVG:
- atoms are circles;
- element symbol centered inside the atom;
- bonds are clean lines;
- double bond is two parallel lines;
- no pseudo-realistic 3D in MVP;
- subtle depth/shadow is fine if it does not reduce clarity.

The graphic should scale cleanly from phone to desktop.

Do not encode molecule identity in CSS or rendering conditions. Visual structure comes from molecule graph/layout data.

## Formula typography

Render numeric atom counts as subscripts visually (`H₂O`, `CO₂`) rather than exposing implementation-like strings such as `H2O` in the main visual result. Keep the canonical plain formula in data.

## Training screen

Recommended hierarchy:

```text
┌──────────────────────────────┐
│ Соберите воду                │
│                              │
│ Выбрано: H ×2  O ×1          │
│                              │
│ [Проверить]                  │
│ [Сбросить]                   │
├──────────────────────────────┤
│ Периодическая таблица        │
└──────────────────────────────┘
```

Before submission:
- do not show target formula;
- do not show target SVG structure.

After correct submission:
- show `Правильно!`;
- reveal formula;
- reveal molecule graphic;
- show `Следующее`.

After incorrect submission:
- keep the current selection editable;
- use neutral feedback;
- do not reset automatically.

## Motion

Small transitions/selection feedback are welcome, but learning must not depend on animation. Respect `prefers-reduced-motion`.

## Responsive behavior

### Mobile (~360px)
- one-column content;
- result card above periodic table;
- table may horizontally scroll;
- main actions reachable without precision tapping.

### Tablet
- larger molecule visualization;
- table remains central learning surface.

### Desktop
- result and table can use wider layout, but do not turn into a dense multi-panel dashboard.

## Accessibility

- interactive elements are actual buttons where appropriate;
- visible keyboard focus;
- color is not the only status indicator;
- SVG has useful accessible label/title;
- disabled elements remain understandable as unavailable learning content.
