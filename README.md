# Transaction Dispute Portal Web

[![CI](https://github.com/McebisiMK/transaction-dispute-portal-web/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/McebisiMK/transaction-dispute-portal-web/actions/workflows/ci.yml)

The React front end for the [Transaction Dispute Portal](https://github.com/McebisiMK/TransactionDisputePortal). Customers view their transactions, dispute them and follow their dispute history. Agents review and resolve disputes.

> **Just want to run it?** The whole stack (web app, API, Keycloak and SQL Server) starts with one `docker compose up` from the API repository. Follow its [quick start](https://github.com/McebisiMK/TransactionDisputePortal#quick-start), which clones both repositories side by side.

| Concern | Choice |
|---|---|
| Framework | React 19, TypeScript, Vite |
| UI | MUI 9 (light and dark themes), MUI X date pickers |
| Routing | React Router, with role-based route guards |
| Sign-in | Keycloak through `react-oidc-context` (Authorization Code + PKCE, `dispute-portal-web` client) |
| API calls | NSwag-generated fetch client (`src/codegen/api-client.ts`), typed against the API's OpenAPI document |
| Server state | TanStack Query (caching, request cancellation, cache updates after changes) |
| Tests | Vitest, Testing Library, MSW |

## Running locally

Requirements: [Node 24](https://nodejs.org/) and the API stack running.

1. Start the API stack without the web container. From `../TransactionDisputePortal`:

   ```bash
   docker compose up -d --build api
   ```

   This also starts SQL Server and Keycloak.

2. Start the dev server:

   ```bash
   npm install
   npm run dev
   ```

3. Open http://localhost:3000.
   - Sign in as `test.customer` (password `Password1!`) for the customer screens.
   - Sign in as `test.agent` (same password) for the agent screens.
   - `/` opens Transactions for customers and the dispute queue for agents, and signing in returns you to the page you asked for.

Settings are in `environments/.env.<mode>`:

| Variable | Development value | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000` | API |
| `VITE_WEB_BASE_URL` | `http://localhost:3000` | Redirect URIs after sign-in and sign-out |
| `VITE_KEYCLOAK_AUTHORITY` | `http://localhost:8080/realms/transaction-dispute-portal` | Keycloak realm |
| `VITE_KEYCLOAK_CLIENT_ID` | `dispute-portal-web` | Keycloak client |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 with hot reload |
| `npm test` | Runs the test suite once (`npm run test:watch` to watch) |
| `npm run lint` | ESLint |
| `npm run build` | Type-checks (`tsc -b`) and builds the production bundle into `dist/` |
| `npm run codegen` | Copies the latest generated API client from `../TransactionDisputePortal` |

## Testing

```bash
npm test
```

There are 55 tests in 10 files.
- **Coverage:** the pages and their main flows: filters and paging, dispute form validation, server validation and business rule errors, withdrawing, agent review and concurrency conflicts. Also the role-based home redirect, how query errors surface, and the filter store.
- **API mocking:** API calls are mocked with MSW (`src/test/server.ts`, which also serves default lookups).
- **Test setup:** `renderWithProviders` wraps a page in the real app providers and a memory router, so the tests exercise the page as users see it.

Before committing, also run `npm run lint` and `npm run build`. The build fails on type errors.

## Docker

The full stack runs from the API repository's `docker-compose.yml`. To build and run this image on its own:

```bash
docker build -t dispute-portal-web .
docker run -p 3000:80 \
  -e API_BASE_URL=http://localhost:5000 \
  -e WEB_BASE_URL=http://localhost:3000 \
  -e KEYCLOAK_AUTHORITY=http://localhost:8080/realms/transaction-dispute-portal \
  -e KEYCLOAK_CLIENT_ID=dispute-portal-web \
  dispute-portal-web
```

The image builds the app with Node 24, then serves the static files with nginx on port 80.
- **Client-side routes:** nginx falls back to `index.html`, so deep links work.
- **Runtime configuration:** at start-up, `docker/40-app-config.sh` writes `config.js` from the four environment variables above, so one image runs in any environment without a rebuild. An unset variable falls back to the value from `environments/.env.production` that was built into the bundle.

## API client

The API project `TransactionDisputePortal.API.Client` regenerates `api-client.ts` from the API's OpenAPI document on every build. Copy the latest one into this app with:

```bash
npm run codegen
```

Commit `src/codegen/api-client.ts` with the feature that needs the API change. Because the client is generated, an API change that breaks the UI fails `npm run build`.

## Structure

```
src/codegen     generated API client (don't edit)
src/common      layout, auth (AuthProvider, ApiClientProvider, AuthGuard), lookups, shared components, hooks and utils
src/features    one folder per feature (transactions, disputes, agent): pages, components, queries, hooks, constants
src/lib         query client, API error helpers, snackbar
src/theme       design tokens, light and dark themes, theme toggle
src/test        MSW server and test render helpers
```

Some conventions:
- **Queries:** each feature keeps its TanStack Query hooks and query keys in `queries.ts`.
- **API errors:** errors are ProblemDetails. `src/lib/apiErrors.ts` turns them into messages and field errors, so a `422` shows on the matching form field and a `409` shows as a page message.
- **Lookups:** dispute reasons and the dispute and transaction statuses come from `GET /api/v1/lookups`, through `useDisputeReasons`, `useDisputeStatuses` and `useTransactionStatuses`. They are fetched once per session. Only chip colours are defined in the front end.
- **Business rules:** the API tells the UI what is allowed (`isDisputable`, `openDisputeId` on transactions). The UI explains it and never re-implements the rules.

## Pages

| Route | Role | Description |
|---|---|---|
| `/transactions` | customer | Transactions across the customer's accounts. Search by merchant or reference, filter by status and date, with paging. Each row shows whether it can be disputed, or links to its open dispute. Filters and page are kept while moving around the app, and reset on refresh or sign-out. |
| `/transactions/:id/dispute` | customer | Dispute a transaction: choose a reason and describe what happened. The same rules as the API are checked first, server errors appear on the matching field, and on success the new dispute opens with its reference. Transactions that can't be disputed explain why, or link to the open dispute. |
| `/disputes` | customer | Dispute history. Filters by status and submission date, with paging. Filters and page are kept while moving around the app, and reset on refresh or sign-out. |
| `/disputes/:id` | customer | Dispute details, transaction summary and status timeline. While a dispute is Submitted it can be withdrawn with an optional comment; the timeline, lists and the transaction's dispute button update straight away. |
| `/agent/disputes` | agent | Dispute queue across all customers, oldest first. Shows open disputes (submitted and under review) by default, or one status. |
| `/agent/disputes/:id` | agent | Review a dispute: start the review, then approve or reject it with a comment the customer sees. If another agent changed it first (`409`), the page reloads the latest version and explains why the change wasn't saved. |

A customer opening an agent page, or an agent opening a customer page, sees an Access denied page, and unknown routes show a Not found page.
