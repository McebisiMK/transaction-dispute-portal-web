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

Open http://localhost:3000 and sign in as `test.customer` / `Password1!`. Sign in as `test.agent` (same password) for the agent screens. `/` opens Transactions for customers and the dispute queue for agents, and signing in returns you to the page you asked for.

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
| `/transactions/:id/dispute` | customer | Dispute a transaction: choose a reason and describe what happened. The same rules as the API are checked first, server errors appear on the matching field, and on success the new dispute opens with its reference. Transactions that can't be disputed explain why, or link to the open dispute. |
| `/disputes` | customer | Dispute history. Filters by status and submission date, with paging. Filters and page are kept while moving around the app, and reset on refresh or sign-out. |
| `/disputes/:id` | customer | Dispute details, transaction summary and status timeline. While a dispute is Submitted it can be withdrawn with an optional comment; the timeline, lists and the transaction's dispute button update straight away. |
| `/agent/disputes` | agent | Dispute queue across all customers, oldest first. Shows open disputes (submitted and under review) by default, or one status. |
| `/agent/disputes/:id` | agent | Review a dispute: start the review, then approve or reject it with a comment the customer sees. If another agent changed it first (409), the page reloads the latest version and explains why the change wasn't saved. |
