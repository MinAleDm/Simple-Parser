# Architecture

The repository is organized as a single monorepo with clear domain boundaries:

- `core/`: parser library and CLI implementation.
- `demo/`: Vite + React interactive playground.
- `tests/`: unit tests for parsing and report generation.
- `docs/`: architecture and usage documentation.
- `.github/workflows/`: CI and GitHub Pages automation.

## Core design

`core/src/parser.ts` orchestrates parsing and composes specialized analyzers:

- `analyzers/metadata.ts`
- `analyzers/headings.ts`
- `analyzers/contacts.ts`
- `analyzers/links.ts`
- `analyzers/media.ts`
- `analyzers/structure.ts`
- `analyzers/text.ts`
- `analyzers/tokens.ts`
- `analyzers/ast.ts`

This keeps each concern isolated and makes adding new analyzers straightforward.

## Data flow

1. Raw HTML input is converted to a DOM-like tree with `htmlparser2`.
2. Analyzer modules extract normalized metrics and structures.
3. The parser returns a strongly typed `ParseResult` object.
4. The CLI and demo consume `ParseResult` without duplicating parsing logic.

## Node-only surface

`core/src/node` contains report rendering and file I/O helpers.
This folder is intentionally separate from browser-safe parser logic.

## Scalability considerations

- Stateless functions: no global mutable parser state.
- Typed API: easier to extend and safer for refactors.
- Modular analyzers: low coupling and high cohesion.
- Workspace setup: independent build pipelines for core and demo while staying in one repository.
