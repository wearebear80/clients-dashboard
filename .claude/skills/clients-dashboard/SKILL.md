---
name: clients-dashboard
description: How this repo (clients dashboard) is run, laid out and extended. Use before adding a feature, a component, an API field or a test in this project.
---

# Clients dashboard

npm workspaces monorepo: Express API + React 19 / TypeScript web app + shared packages. Node 24 (`.nvmrc`, `nvm use`).

## Run

```bash
npm run dev            # API :3001 + web http://localhost:5173 (Vite proxies /api)
npm run storybook      # :6006
npm test               # Vitest: TreeTable, chart mapping
npm run test:e2e       # Playwright, real API + web
npm run typecheck && npm run lint
npm run build:web && npm run start:server   # production, one server on :3001
```

Dev only: `?delay=<ms>` and `?fail=<status>` on the page are forwarded to the API to show loading / error states.

## Where things live

| Path                                                         | What                                                                                                                                                                                                                              |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/clients-analytics-server/src`                          | Express API. `app.ts` routes, `server.ts` entry                                                                                                                                                                                   |
| `packages/domain/src/clients`                                | The contract, flat files: `schemas.ts` (zod), `types.ts`, `requests.ts` (`getCompany`), `queries.ts` (`useCompany`), `tree.ts` (`childrenOf`), `validation.ts` (domain rules), `fixtures.ts` + `company.json`                     |
| `packages/lib/src/http`                                      | ky client (`/api` prefix, no retries) and `ApiRequestError`                                                                                                                                                                       |
| `packages/ui/src/<Component>/`                               | Design system: `X.tsx`, `X.module.scss`, `X.stories.tsx`, `X.test.tsx`; export from `src/index.ts`; tokens in `tokens.css`                                                                                                        |
| `apps/clients-analytics-web/src/app`                         | `App` (the page), `AppProviders` (QueryClient, ToastProvider)                                                                                                                                                                     |
| `apps/clients-analytics-web/src/models`                      | `toClientRow`: payload → one tree of `ClientRow` (`id`, `name`, `level`, `values`, `children`)                                                                                                                                    |
| `apps/clients-analytics-web/src/components/ClientsAnalytics` | `ClientsAnalytics` (states, selected row) renders two parts: `chart/` (`ClientsChart`, `createChartConfig`, `toChartSeries`) and `table/` (`ClientsTable`, `createTableConfig`, `ClientValue`); each part memoises its own config |
| `apps/clients-analytics-web/src/hooks`                       | `useClientsData`: data only — query, company rows, inconsistencies, months, loading / error                                                                                                                                       |
| `tests/e2e`                                                  | Playwright                                                                                                                                                                                                                        |

Data flow: `useCompany` → `toClientRow` (in `useClientsData`) → `ClientsAnalytics` keeps the selected row → `ClientsChart` / `ClientsTable` build their configs → UI components render.

## Adding things

- **API field:** change the zod schema in `domain` first; the server validates the payload on start, the client every response; types are inferred.
- **UI component:** generic and data-agnostic in `packages/ui`, with a story; a test when it has behaviour worth guarding. App-specific pieces go to `apps/…-web/src/components`.
- **Data logic:** pure functions in `models` or next to the part that uses them (`chart/`, `table/`), unit-tested on the real payload (`@app/domain/clients/fixtures`).
- **New page state or flow:** cover it in `tests/e2e`.

## Conventions

- SCSS Modules + CSS variables from `tokens.css`; `clsx` for classes. No CSS framework.
- Accessibility is a requirement: React Aria for complex widgets, keyboard support, visible focus. The chart is `aria-hidden` on purpose — the table carries the data.
- Values from the API are shown as received; a parent ≠ sum of children is flagged (`findInconsistencies`), never corrected.
- Comments only for the non-obvious. Prettier: single quotes, width 100.
- After changing a package's `exports`, restart the dev server (Vite caches them).
