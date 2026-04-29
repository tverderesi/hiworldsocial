# Server Instructions

## Scope

This file applies only to `apps/server`. See the root `AGENTS.md` for workspace-level commands and dependency policy.

## Commands

- `pnpm --filter @hiworld/server dev` runs `tsx watch --clear-screen=false index.ts`.
- `pnpm --filter @hiworld/server build` bundles `index.ts` with esbuild for Node 24 and writes `dist/index.cjs`.
- `pnpm --filter @hiworld/server start` runs `node dist/index.cjs`.
- `pnpm --filter @hiworld/server test` runs Vitest.
- `pnpm --filter @hiworld/server lint` runs ESLint over TypeScript files.
- `pnpm --filter @hiworld/server typecheck` runs `tsc --noEmit`.
- `pnpm --filter @hiworld/server db:setup` creates required MongoDB collections for the configured database.
- `pnpm --filter @hiworld/server codegen` regenerates `graphql/generated.ts`.
- `pnpm --filter @hiworld/server export-schema` writes the exported schema used by the client schema check.

## Runtime And Build

- Source uses ESM TypeScript (`"type": "module"`, `moduleResolution: "Bundler"`), but production output is bundled CommonJS at `dist/index.cjs`.
- The build also copies `graphql/schema.graphql` to `dist/graphql/schema.graphql`; keep that path working when changing schema loading.
- Production startup should rely on the built Node artifact and environment variables, not on a Docker-only path.

## GraphQL And Data

- `index.ts` loads env, connects Mongoose, then starts the Apollo/Express app from `server.ts`.
- `server.ts` creates the Apollo Server, Express middleware, CORS config, and GraphQL context containing optional `req` and `res`.
- Schema text lives in `graphql/schema.graphql`; `graphql/typeDefs.ts` loads it for runtime.
- Resolver modules live under `graphql/resolvers`, with `graphql/resolvers/index.ts` composing Query and Mutation maps.
- Mongoose models live under `models`; shared GraphQL/domain types live in `types.ts`.
- Generated resolver types in `graphql/generated.ts` are codegen output and are ignored by ESLint.

## Environment And Auth

- `MONGODB_URI` is required at startup; `MONGODB` is accepted as a fallback.
- `SECRET_KEY` is required before creating the Apollo server.
- Email and password-reset settings are documented in `.env.example`, including `PASSWORD_RESET_URL_BASE`, `EMAIL_TRANSPORT`, SMTP settings, and Resend settings.
- CORS allowed origins are defined in `server.ts` from `CLIENT_URL`, `APP_URL`, and local/production defaults.
- Auth token helpers in `lib/auth.ts` support Bearer tokens and the `session` cookie; cookie setting and clearing require `GraphQLContext.res`.

## Tests

- Resolver and utility tests live next to the server code as `*.test.ts`.
- Vitest uses the Node environment from `vitest.config.ts`.
