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

## Structure

```
src/common      layout, auth (AuthProvider, ApiClientProvider, AuthGuard), shared components and utils
src/features    one folder per feature: pages, components, queries, hooks
src/lib         query client, API error helpers, snackbar
```

## Pages

| Route | Role | Description |
|---|---|---|
| `/disputes` | customer | Dispute history. Filters by status and submission date, with paging. Filters and page are kept in the URL. |
| `/disputes/:id` | customer | Dispute details, transaction summary and status timeline. |
