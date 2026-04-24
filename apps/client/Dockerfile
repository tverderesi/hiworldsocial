FROM node:24-alpine AS deps

WORKDIR /repo
RUN corepack enable

ARG VITE_GRAPHQL_ENDPOINT=http://localhost:5000/
ENV VITE_GRAPHQL_ENDPOINT=$VITE_GRAPHQL_ENDPOINT

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/client/package.json apps/client/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY apps/client apps/client
RUN pnpm --filter @hiworld/client build

FROM nginx:1.27-alpine

COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
