# Transaction Dispute Portal Web

React front end for the Transaction Dispute Portal API (`../TransactionDisputePortal`). Built from `react-template`: Vite, TypeScript, MUI, React Router.

| Concern | Library |
|---|---|
| Sign-in | Keycloak via `react-oidc-context` (Authorization Code + PKCE, `dispute-portal-web` client) |
| API calls | NSwag-generated fetch client (`src/codegen/api-client.ts`) |
| Data fetching | TanStack Query |

## Running locally

Start the API stack first (from `../TransactionDisputePortal`: `docker compose up -d --build`), then:

```
npm install
npm run dev
```

Open http://localhost:3000 and sign in as `test.customer` / `Password1!`.

Settings are in `environments/.env.<mode>`: `VITE_API_BASE_URL`, `VITE_WEB_BASE_URL`, `VITE_KEYCLOAK_AUTHORITY`, `VITE_KEYCLOAK_CLIENT_ID`.

## API client

The API project `TransactionDisputePortal.API.Client` regenerates `api-client.ts` on every build. Copy the latest one into this app with:

```
npm run codegen
```

Commit `src/codegen/api-client.ts` with the feature that needs the API change.

## Running tests

```
npm test
```

Vitest with Testing Library. API calls are mocked with MSW (`src/test/server.ts`), and `renderWithProviders` wraps a page in the app providers and a memory router.

## Structure

```
src/common      layout, auth (AuthProvider, ApiClientProvider, AuthGuard), shared components and utils
src/features    one folder per feature: pages, components, queries, hooks
src/lib         query client, API error helpers, snackbar
```

## Pages

| Route | Role | Description |
|---|---|---|
| `/transactions` | customer | Transactions across the customer's accounts. Search by merchant or reference, filter by status and date, with paging. Each row shows whether it can be disputed, or links to its open dispute. Filters and page are kept while moving around the app, and reset on refresh or sign-out. |
| `/disputes` | customer | Dispute history. Filters by status and submission date, with paging. Filters and page are kept while moving around the app, and reset on refresh or sign-out. |
| `/disputes/:id` | customer | Dispute details, transaction summary and status timeline. |
