FROM node:24-alpine

WORKDIR /repo
ENV NODE_ENV=production
RUN corepack enable
RUN corepack prepare pnpm@9.15.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json apps/server/package.json
RUN pnpm install --prod --frozen-lockfile --filter @hiworld/server --ignore-scripts

COPY apps/server apps/server

WORKDIR /repo/apps/server

EXPOSE 5000

CMD ["pnpm", "start"]
