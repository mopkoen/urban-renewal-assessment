# Repository Guidelines

## Project Structure & Module Organization
- Entry: `index.tsx` mounts the React app; `App.tsx` hosts the tabbed calculator UI.
- `components/` holds reusable UI pieces (e.g., `InputField`, `ResultsDashboard`).
- `utils/` contains domain logic (`calculations.ts`) and localization strings (`i18n.ts`).
- `types.ts` centralizes shared types/enums; extend here before adding new form fields.
- `public/` serves static assets; `dist/` is generated build output (do not edit by hand).
- Cloudflare Pages plumbing lives in `worker.js`, `.wrangler/`, and `wrangler.toml` for deploy.
- Local secrets live in `.env.local` (e.g., `GEMINI_API_KEY`); the file is gitignored.

## Build, Test, and Development Commands
- `npm install` ¡X install dependencies.
- `npm run dev` ¡X start the Vite dev server (default http://localhost:5173).
- `npm run build` ¡X produce an optimized bundle in `dist/`.
- `npm run preview` ¡X serve the built bundle locally for smoke checks.
- `npm run deploy` ¡X build then `wrangler pages deploy dist`; requires Cloudflare auth and project settings.

## Coding Style & Naming Conventions
- TypeScript + React functional components; keep state in hooks and pass props explicitly.
- Two-space indentation, semicolons, single quotes; camelCase for vars/props, PascalCase for components, UPPER_SNAKE for constants.
- Co-locate feature logic in `utils/` and keep business rules typed (extend `InputState`/`TabCategory` in `types.ts`).
- Keep i18n keys consistent (`utils/i18n.ts`); prefer descriptive key names over inline UI strings.

## Testing Guidelines
- No automated suite yet; when adding, prefer Vitest + Testing Library for unit/component coverage.
- Name specs `*.test.ts[x]` next to the source they cover (e.g., `utils/calculations.test.ts`).
- Focus on calculation edge cases (zoning, FAR, cost percentages) and critical UI flows (tab toggles, theme/lang switches).
- Run the dev server for manual QA after changes (`npm run dev`), and ensure `npm run build` stays clean.

## Commit & Pull Request Guidelines
- Use Conventional Commit-style subjects (`feat:`, `fix:`, `chore:`); keep the subject under ~72 chars and add detail in the body when behavior changes.
- Reference issues or tasks in the PR description; summarize scope, risk, and test evidence.
- For UI changes, include before/after screenshots or a short clip; note any env or config updates (`.env.local`, `wrangler` settings).
- Confirm `npm run build` (and any new tests) before requesting review.
