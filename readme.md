# Hey World Social Network

Hey World is a social network web application built with React, Node.js, GraphQL, and MongoDB. The codebase is organized as a Turborepo with separate client and server applications.

## Project Structure

```
apps/
  client/   React application
  server/   Apollo Server API
```

## Features

- User registration and authentication
- User profiles with avatars
- Posting messages
- Commenting on messages
- deleting meesages
- editing profile

## Database

Hey World uses MongoDB as its database system. The default local database is **merng**, and the server expects two collections:

**users**: stores user profile information including usernames, email addresses, passwords, and profile pictures.

**posts**: stores post data including the message content, user who posted it, likes, and comments.

Instead of creating collections manually in the MongoDB shell, copy `apps/server/.env.example` to `apps/server/.env`, set `MONGODB_URI`, and run:

```
pnpm db:setup
```

The setup script connects to the configured MongoDB database and creates any missing required collections automatically. After that, start the development server with `pnpm dev`.

## Getting Started

1. Clone the repository to your local machine:

```
git clone https://github.com/<username>/hey-world.git
```

2. Install the required dependencies from the repo root:

```
pnpm install
```

3. Create local env files:

```
cp .env.example .env
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env
```

For Docker Compose, the root `.env` controls published ports, MongoDB, the API secret, and the client build-time GraphQL endpoint.

To enable real email delivery through Resend, set these server env vars:

```
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
PASSWORD_RESET_URL_BASE=http://hiworld.local
EMAIL_TRANSPORT=resend
```

Replace `re_xxxxxxxxx` with your real Resend API key. For production, override `PASSWORD_RESET_URL_BASE` to `https://hiworldsocial.vercel.app`.
Local Docker dev does not run Resend. It overrides `EMAIL_TRANSPORT` to `smtp` and delivers mail to Mailpit instead.

4. Start both apps through Turborepo:

```
pnpm dev
```

5. Open the application in your web browser at `http://localhost:3000`.

## Workspace Commands

Run all apps:

```
pnpm dev
pnpm build
```

Run one app:

```
pnpm client
pnpm server
pnpm --filter @hiworld/client build
pnpm --filter @hiworld/server start
```

## Docker

Build and run the full stack, including MongoDB:

```
docker compose up --build
```

The client is served at `http://localhost:3000`, and the GraphQL API is exposed at `http://localhost:5000`.

For production, set a strong `SECRET_KEY` through `.env` or your deployment environment. Posting is rate-limited on the server with `POST_RATE_LIMIT_MAX_POSTS` and `POST_RATE_LIMIT_WINDOW_SECONDS`, which default to `5` posts per `60` seconds. Locally, password reset emails default to `http://hiworld.local`; in production, set `PASSWORD_RESET_URL_BASE=https://hiworldsocial.vercel.app` so reset emails link back to the live app. Posting is rate-limited on the server with `POST_RATE_LIMIT_MAX_POSTS` and `POST_RATE_LIMIT_WINDOW_SECONDS`, which default to `5` posts per `60` seconds. The client image accepts `VITE_GRAPHQL_ENDPOINT` as a build argument.

The server owns the executable GraphQL schema. When the schema changes, refresh the client-facing schema artifact with:

```
pnpm schema:export
```

CI runs `pnpm schema:check` to ensure `apps/client/src/graphql/schema.graphql` stays in sync with the server schema.

### Dev Mode

Dev mode runs the client and server watchers inside Docker with bind-mounted source files, so most source edits do not need an image rebuild.

1. Add the local hostnames to your host machine's hosts file:

```
127.0.0.1 hiworld.local server.hiworld.local mail.hiworld.local
```

2. Start the dev stack:

```
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

The dev server startup runs `pnpm db:setup` automatically after MongoDB becomes healthy, so the required collections are created without a separate manual step.

3. Open the app:

```
http://hiworld.local
```

4. Open Apollo Sandbox in dev mode:

```
http://server.hiworld.local
```

5. Open Mailpit to inspect locally sent emails:

```
http://mail.hiworld.local
```

The dev override uses an Nginx proxy for `hiworld.local`, `server.hiworld.local`, and `mail.hiworld.local`, runs Mailpit for local email capture, bind mounts `apps/client` and `apps/server`, and stores container dependencies in named volumes. The server uses `EMAIL_TRANSPORT=smtp` in dev so forgot-password emails go to Mailpit instead of calling Resend. The default `docker-compose.yml` is image-based, so source changes there require a rebuild.

## Features Pipeline

- [x] User registration and authentication
- [x] User profiles with avatars
- [x] Posting messages
- [x] Commenting on messages
- [x] Deleting messages
- [x] Editing profiles
- [ ] Deleting profile
- [x] Deployement

## Technologies Used

- React
- Node.js
- MongoDB
- GraphQL
- Apollo Server/Client
- Semantic UI React

## Contributing

Contributions to Hey World are welcome and encouraged! If you find a bug, have a feature request, or want to contribute code, please submit an issue or pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.
