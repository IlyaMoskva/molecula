# Molecula — architecture

## Scope

MVP is a fully client-side PWA. It teaches basic molecule composition using a curated knowledge base and a simple SVG representation.

## L1

```text
┌───────────────────────────────────────────┐
│               Molecula PWA                │
│                                           │
│  Periodic Table      Training             │
│        │                 │                │
│        └───────┬─────────┘                │
│                ▼                          │
│        Application / MoleculeEngine       │
│                │                          │
│        ┌───────┴────────┐                 │
│        ▼                ▼                 │
│ KnowledgeRepository   SVG Renderer        │
│        │                                  │
│        ▼                                  │
│ Curated local data                        │
└───────────────────────────────────────────┘
```

No backend or runtime network dependency is required for MVP.

## L2 modules

### UI

Responsibilities:
- periodic table screen;
- selected atom tray/composition;
- molecule result card;
- training screen;
- navigation and responsive layout.

The UI calls application services/hooks and does not scan raw data directly.

### Domain

Pure TypeScript model and logic:
- chemical elements;
- atom composition;
- molecule graph;
- composition normalization;
- equality/comparison;
- bond types.

### Application

Use cases:
- add/remove/reset selected atoms;
- resolve a selected composition to a known molecule;
- validate a training answer;
- choose/advance training tasks.

### Data

Local repository implementation:
- elements dataset;
- molecule dataset;
- repository index keyed by canonical composition.

### Rendering

Reusable SVG renderer:
- atom circles/labels;
- single/double/triple bonds;
- responsive viewBox;
- consumes molecule graph and layout coordinates.

## Canonical composition

Composition lookup is order-independent.

Example:

```text
Input clicks: O, H, H
Counts: { O: 1, H: 2 }
Canonical key: H:2|O:1
```

Algorithm:
1. count symbols;
2. discard zero counts;
3. sort symbols deterministically;
4. serialize as `<symbol>:<count>` joined by `|`.

This is domain logic and must be tested independently of React.

## Molecule data shape

Illustrative shape:

```ts
interface Molecule {
  id: string;
  formula: string;
  names: {
    ru: string;
    en: string;
  };
  composition: Record<string, number>;
  atoms: Array<{
    id: string;
    element: string;
    x: number;
    y: number;
  }>;
  bonds: Array<{
    from: string;
    to: string;
    order: 1 | 2 | 3;
  }>;
}
```

The exact types may be improved by implementation, but responsibilities must remain separated.

## Initial delivery slices

### Slice 1 — foundation
- React + TypeScript + Vite;
- strict TS, lint, tests;
- PWA foundation;
- app shell;
- domain types and canonical composition tests.

### Slice 2 — knowledge base and matching
- supported elements;
- molecule dataset;
- repository abstraction;
- matching tests.

### Slice 3 — constructor UI
- periodic table;
- atom selection;
- current composition;
- result lookup;
- molecule SVG renderer.

### Slice 4 — training
- training task selection;
- answer validation;
- feedback;
- reset/next task.

### Slice 5 — hardening
- offline validation;
- responsive/accessibility pass;
- content validation;
- smoke/E2E coverage where useful.

## Deliberately out of scope for MVP

- backend;
- user accounts;
- cloud synchronization;
- arbitrary molecule generation;
- automatic chemical bond inference;
- reactions and equation balancing;
- 3D visualization;
- AI/LLM features;
- advanced chemistry correctness beyond the curated knowledge base.
