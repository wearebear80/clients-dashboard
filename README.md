# Clients dashboard

A dashboard of a company's clients over time: a table that drills down from the company to branches, advisers and channels, month by month, and a stacked bar chart of the row selected in it.

## Gaps and decisions

The brief leaves gaps on purpose; these are the calls I made and why.

- **The chart shows the row selected in the table, stacked by its children:** company → branches, branch → advisers, adviser → channels (in the design colours). A click or Space selects a row; expanding stays on the chevron and ← / →.
- **A total that does not match the sum of its children is flagged, in the table and on the chart.**
- **Initials avatars.** There are no photos in the payload, so avatars are generated from the name, as messengers do; `Avatar` already accepts `src`.
- **Horizontal scroll on mobile.** No mobile design was provided; the table and the chart scroll inside their cards and nothing breaks down to 375px. A real mobile layout needs a design.

## Getting started

Requires Node.js 24 (`.nvmrc`).

### Development mode

```bash
npm install
npm run dev          # API on :3001 + web on http://localhost:5173 (proxies /api)
```

| Script                              | What it does                                          |
| ----------------------------------- | ----------------------------------------------------- |
| `npm run dev`                       | API and web together, with reload                     |
| `npm run storybook`                 | Storybook on http://localhost:6006                    |
| `npm test`                          | Unit + component tests (Vitest)                       |
| `npm run test:e2e`                  | End-to-end tests (Playwright, starts the dev servers) |
| `npm run typecheck`, `npm run lint` | TypeScript and ESLint over all workspaces             |

Before the first Playwright run: `npx playwright install chromium`.

### Production build

```bash
npm run build:web      # builds the web app into apps/clients-analytics-web/dist
npm run start:server   # NODE_ENV=production: the API + the built web app on http://localhost:3001
```

In production the API also serves the built web app from the same origin, so no proxy or CORS is needed. The dev query parameters (`?delay`, `?fail`) are off.

## Server (`apps/clients-analytics-server`)

A small Node.js + Express API that serves the payload from the brief, validated against the shared zod schema at start-up.

- `GET /api/companies/:id` — the company tree; unknown id → `404`. Errors are JSON: `{ "error": { "code", "message" } }`.
- `GET /api/health` — liveness check.

Two query parameters simulate the UI states (dev only, off when `NODE_ENV=production`):

- `?delay=<ms>` — answers after a delay (max 10 000 ms): the loading state.
- `?fail=<status>` — answers with that status (400–599): the error state.

## Loading and error states (dev)

Run `npm run dev` and open the app with query params; they are forwarded to the API in dev only.

- **Loading:** `http://localhost:5173/?delay=3000` — skeletons for 3 s, then the data (max 10 000 ms).
- **Error:** `http://localhost:5173/?fail=500` (any 400–599) — after the query's retries (~7 s), an error toast and a card with **Retry**.
- **Retry:** press **Retry** on the error card — `fail` is removed from the URL and the data loads.
- **Both:** `http://localhost:5173/?delay=1000&fail=503` — slow failure; `delay` is kept after Retry.

## Testing

```bash
npm test             # unit tests (Vitest)
npm run test:e2e     # end-to-end tests (Playwright; starts the API and web)
```

- **Expand / collapse** → `TreeTable.test.tsx`, `tests/e2e/smoke.spec.ts`
- **Data → chart** → `toChartSeries.test.ts`, `createChartConfig.test.ts`, `StackedBarChart.test.tsx`, `tests/e2e/smoke.spec.ts`
- **Mismatches** → `validation.test.ts`
- **Nothing breaks down to 375px** → `tests/e2e/mobile.spec.ts`

## Accessibility decisions

- **The chart is hidden from screen readers on purpose.** It only visualises the numbers that are already in the table (company, branches, advisers, channels per month), so reading it would duplicate the table and confuse. It is for visual analysis; screen-reader users get the same data from the table, and going through the same numbers twice makes no sense.
- **The selected row is announced:** it has `aria-selected`, so a screen reader says "selected" when a row is picked for the chart.
- **Every table cell is read with its context:** "Company, May 2024: 301" instead of just "301", because VoiceOver reads only the number when moving between cells. A mismatched value is read as "Company, May 2024: 301. Total does not match its rows. Rows add up to 279, 22 less than 301."

## Claude skill

[`.claude/skills/clients-dashboard/SKILL.md`](.claude/skills/clients-dashboard/SKILL.md) gives Claude Code the project context for future work: how to run it, where things live, the data flow, and how to add an API field, a UI component, data logic or a test.

## What I would do next

1. **Product manager — how the app should work.** Which data we show and for which period, how to treat mismatches, what matters per company and per branch.
2. **Design team and product manager — how it should look.** Colours, the user flow, a real mobile layout.
3. **Engineering team — data volume.** How much data to expect and which optimisations it needs (loading children per level, a virtualised table, bundle size).
4. **Engineering team — operational excellence.** What we monitor and which metrics: errors in Sentry (incl. data mismatches and invalid API responses), Web Vitals, API latency and failures; CI/CD and the environments.
