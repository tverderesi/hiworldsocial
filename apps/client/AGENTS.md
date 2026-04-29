# Client Instructions

## Scope

This file applies only to `apps/client`. See the root `AGENTS.md` for workspace-level commands and dependency policy.

## Commands

- `pnpm --filter @hiworld/client dev` starts Vite on `0.0.0.0` port `3000`.
- `pnpm --filter @hiworld/client build` runs `tsc -p tsconfig.json` and `vite build`.
- `pnpm --filter @hiworld/client test` runs Vitest.
- `pnpm --filter @hiworld/client lint` runs ESLint over `src`.
- `pnpm --filter @hiworld/client typecheck` runs `tsc --noEmit`.
- `pnpm --filter @hiworld/client preview` serves the production build with Vite preview.

## App Conventions

- This is a React 18 app built with Vite and `@vitejs/plugin-react`.
- The React entrypoint is `src/index.tsx`; routing lives in `src/App.tsx` with `react-router-dom`.
- Apollo Client is configured in `src/ApolloProvider.tsx`; shared GraphQL documents currently live in `src/util/GraphQL.tsx`.
- Authentication UI state is managed through `src/context/auth.tsx` and route gating through `src/util/AuthRoute.tsx`.
- Styling is centered in `src/App.css`, with small reusable UI primitives under `src/components/ui` using the local `cn` helper from `src/lib/utils.ts`.
- Tests use Vitest with `jsdom`, `src/setupTests.ts`, and React Testing Library helpers under `src/test`.

## Environment

- Vite exposes only configured prefixes: `VITE_` and `REACT_APP_`.
- `VITE_GRAPHQL_ENDPOINT` is documented in `.env.example` and read by the Apollo provider.
- Dev-server HMR can be adjusted with `VITE_HMR_HOST` and `VITE_HMR_CLIENT_PORT`.

## Deployment

- The client builds to Vite's `dist` output and is the workspace intended for frontend deployment.
- If configuring Vercel for this app, point the project root at `apps/client` or use equivalent settings that run this workspace's build.
