# Repository Guidelines

## Project Structure & Module Organization
- `src/app` implements the Next.js App Router pages, with locale-aware entry points under `[locale]/`.
- `src/components` houses reusable UI, grouped by feature (e.g., `ui/`, `layout/`) with co-located `.test.tsx` files.
- `src/lib` provides shared utilities (translations, metadata) and `src/locales` stores JSON copy for each supported locale.
- `public` contains static assets, while `worker/` hosts the Cloudflare Worker companion service; keep its build isolated from the web bundle.

## Build, Test & Development Commands
- `npm run dev` launches the Next.js development server with hot reloading on `http://localhost:3000`.
- `npm run build` compiles the production bundle; run this before shipping to ensure locales, Tailwind, and edge middleware compile cleanly.
- `npm run start` serves the production build locally; use it to verify runtime behavior.
- `npm run lint` runs ESLint with the `next/core-web-vitals` ruleset; fix warnings before committing.
- `npm run test` executes Vitest in JSDOM; add `--run` in CI scripts for a single pass.

## Coding Style & Naming Conventions
- Use TypeScript and React function components in PascalCase files (e.g., `Hero.tsx`); tests mirror the component name with `.test.tsx`.
- Follow a two-space indent, trailing commas where valid, and prefer single quotes; let your editor apply the ESLint + TypeScript defaults.
- Import shared modules via the `@/` alias defined in `vitest.config.ts` and Next config; avoid deep relative paths.
- Tailwind is the primary styling layer—co-locate utility classes in JSX and extend tokens in `tailwind.config.js` when needed.

## Testing Guidelines
- Write component tests with Vitest + React Testing Library; mock translations via `vitest.setup.ts` helpers.
- Name tests after the component or hook they cover (`ComponentName.test.tsx`) and keep fixtures alongside the implementation.
- Aim for coverage across locale branches, accessibility states, and edge middleware; add regression tests for every bug fix.
- Run `npm run test` and `npm run lint` before opening a PR; include screenshots or snapshots only when UI changes are non-trivial.

## Commit & Pull Request Guidelines
- Prefer conventional prefixes observed in history (`Feat:`, `Fix:`) followed by an imperative summary; keep messages under 72 characters.
- Reference related issues in the body (`Refs #123`) and document locale or worker impacts when applicable.
- PR descriptions should outline motivation, screenshots for UI changes, test evidence (`npm run test` output), and any deployment considerations.
- Request review once CI passes; flag follow-up tasks or todos explicitly rather than leaving commented code.

## Localization & Edge Notes
- Update `i18n.config.ts` and `src/locales` together; every new key must exist in all locale files.
- Middleware-driven redirects depend on `headers()` locale detection—verify via `npm run start` to match production behavior.
- Cloudflare Worker updates should document wrangler commands in the PR and avoid bundling frontend-only deps.
