FROM node:24-alpine AS deps

WORKDIR /repo
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json apps/server/package.json
RUN pnpm install --frozen-lockfile --filter @hiworld/server --ignore-scripts

FROM deps AS build

COPY apps/server apps/server
RUN pnpm --filter @hiworld/server build

FROM node:24-alpine

WORKDIR /repo
ENV NODE_ENV=production
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json apps/server/package.json
RUN pnpm install --prod --frozen-lockfile --filter @hiworld/server --ignore-scripts

COPY --from=build /repo/apps/server/dist apps/server/dist
COPY apps/server/.env.example apps/server/.env.example
WORKDIR /repo/apps/server

EXPOSE 5000

CMD ["pnpm", "start"]
