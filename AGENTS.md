# AGENTS.md

## Product

Molecula is an educational PWA for learning basic chemistry through atom selection and molecule construction.

Primary audience: school students. The UI must be simple, visual, touch-friendly, and understandable without instructions.

## Product rules

1. A user selects atoms from the periodic table.
2. Atom selection order does not matter. `H,H,O`, `O,H,H`, and `H,O,H` are the same composition.
3. The app matches the normalized composition against a local knowledge base.
4. If a known molecule is found, show:
   - formula,
   - localized name,
   - simple structural SVG,
   - selected atom counts.
5. If there is no exact match, do not invent chemistry. Show that the composition is not present in the knowledge base.
6. Training mode provides a target molecule and validates the normalized composition.
7. MVP is fully client-side and must work offline after the first successful load.
8. Do not add a backend, authentication, analytics, accounts, cloud database, or LLM unless a later task explicitly requires it.

## Architecture

Keep these responsibilities separate:

- `ui`: React components and pages.
- `domain`: chemistry-domain types and pure logic.
- `application`: use cases such as selecting atoms, matching composition, and validating training answers.
- `data`: local knowledge base and repository implementation.
- `rendering`: SVG molecule rendering.

Target dependency direction:

```text
UI -> application -> domain
          |
          -> repository interface <- local data implementation

UI -> molecule renderer -> domain molecule graph
```

The UI must not search raw JSON/data arrays directly.

## Core domain model

Use explicit TypeScript types. Suggested concepts:

- `ElementSymbol`
- `Element`
- `AtomComposition` (`Record<ElementSymbol, number>` or an equivalent safe structure)
- `Molecule`
- `MoleculeAtom`
- `Bond`
- `BondOrder`
- `MoleculeRepository`

A molecule is represented as a graph:

- atoms are vertices,
- bonds are edges,
- bond order is single/double/triple.

Do not attempt quantum chemistry, automatic bond inference, reaction balancing, or arbitrary molecule generation in the MVP.

## Composition matching

Normalize a composition to a stable canonical key before lookup.

Example:

```text
H,H,O -> H:2|O:1
O,H,H -> H:2|O:1
```

The normalization algorithm must be deterministic, independent of click order, and unit-tested.

## Initial knowledge base

Start with a small curated set of familiar substances. The first implementation should support at least:

- H2 — hydrogen
- O2 — oxygen
- N2 — nitrogen
- Cl2 — chlorine
- H2O — water
- CO2 — carbon dioxide
- CO — carbon monoxide
- NH3 — ammonia
- CH4 — methane
- HCl — hydrogen chloride
- NaCl — sodium chloride
- H2O2 — hydrogen peroxide
- SO2 — sulfur dioxide
- SO3 — sulfur trioxide
- NO2 — nitrogen dioxide

Names should be structured for localization from the start (`ru`, `en`) even if the first UI is Russian-first.

## Periodic table

The visual table should resemble the conventional periodic table layout.

For MVP:

- include all element positions needed to look like a real periodic table,
- elements supported by the current learning content are interactive,
- unsupported elements may be visible but visually muted/disabled,
- each active element cell should show at least atomic number and symbol,
- touch targets must be usable on mobile.

Do not hard-code click behavior separately per element.

## Molecule rendering

Use SVG, not pre-rendered molecule images.

Requirements:

- responsive SVG,
- atoms represented by simple circles with element symbols,
- bonds represented by lines,
- support single and double bonds initially; triple-bond support may exist in the model,
- no 3D rendering in MVP,
- renderer consumes molecule graph/layout data and does not contain molecule-specific `if` statements.

Coordinates may be stored in the knowledge base for MVP. Automatic graph layout is not required.

## Training mode

Training validates composition, not click order.

Minimum flow:

1. show target name, e.g. `Соберите воду`;
2. user selects atoms;
3. user checks the answer;
4. exact composition match => success;
5. incorrect composition => useful neutral feedback;
6. reset/next exercise.

Do not reveal the required formula before the user submits unless the UI is explicitly in hint mode.

## UX

- Russian-first copy.
- Clean educational visual style, not a developer dashboard.
- Avoid dense text.
- Prefer cards, large atom buttons, clear selected-count badges, and obvious reset/check actions.
- Must work well at approximately 360px mobile width.
- Keyboard accessibility should remain functional on desktop.
- Respect `prefers-reduced-motion` for nonessential animation.

## PWA

The app must be installable and usable offline after the first load.

Include:

- web app manifest,
- service worker through a maintained Vite-compatible PWA solution,
- appropriate icons/placeholders that can later be replaced,
- offline caching of the application shell and bundled knowledge data.

Do not cache external runtime APIs because MVP has none.

## Engineering quality

- TypeScript strict mode.
- No `any` unless unavoidable and justified in code comments.
- Prefer pure functions for domain logic.
- Add tests for domain/application behavior before or with UI work.
- Keep components reasonably small.
- Avoid global mutable state. Use React state/context only where needed; do not add Redux/Zustand unless complexity proves it necessary.
- No premature backend abstractions.
- No molecule-specific logic in UI components.

## Validation before a PR

Run all available checks and report results in the PR description:

- install
- typecheck
- lint
- tests
- production build

If a check cannot run, explain exactly why.

## PR discipline

- One issue/goal per PR.
- Keep PRs small enough to review.
- Do not combine unrelated cleanup.
- Include screenshots for visible UI changes when the environment allows it.
- Mention the issue number in the PR.
- Summarize architecture decisions and tests in the PR description.
