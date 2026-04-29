# Repository Instructions

## Scope

This file is for repo-wide guidance only. Put client-specific instructions in `apps/client/AGENTS.md` and server-specific instructions in `apps/server/AGENTS.md`.

## Workspace

- Use `pnpm` for all package operations. The pinned package manager is `pnpm@10.33.2`, and Node is expected to be `24` (`.node-version`, `package.json` engines).
- Run commands from the repo root unless you are intentionally working inside one workspace. Workspaces are declared as `apps/*`.
- Respect workspace boundaries: add app-only code and dependencies to that app, and make shared/root changes only when they affect more than one workspace.
- Prefer workspace-specific dependencies when only one app needs them, for example `pnpm --filter @hiworld/client add ...` or `pnpm --filter @hiworld/server add ...`.
- Keep `pnpm-lock.yaml` changes intentional and tied to the dependency change being made.

## Repo Commands

- `pnpm dev` runs Turbo dev tasks in parallel.
- `pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm test` run the matching Turbo task across workspaces.
- `pnpm check` runs lint, typecheck, and tests.
- `pnpm schema:export` exports the server schema to the client schema file.
- `pnpm schema:check` verifies `apps/client/src/graphql/schema.graphql` matches the server schema.
- CI installs with `pnpm install --frozen-lockfile --ignore-scripts`, then runs lint, typecheck, schema check, tests, and build.

## Local Development

- Docker Compose is for local development only. It runs MongoDB, Mailpit, the server, the client, and the Nginx dev proxy.
- Browser-facing local domains use `.social`, not `.local`; keep new local hostnames consistent with `hiworld.social`, `server.hiworld.social`, and `mail.hiworld.social`.

## Environment

- Do not commit real secrets.
- When adding required environment variables, update the appropriate app-level `.env.example` and nearby docs/config that describe that app.
