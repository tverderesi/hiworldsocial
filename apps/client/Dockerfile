FROM node:24-alpine AS deps

WORKDIR /repo
RUN corepack enable
RUN corepack prepare pnpm@9.15.1 --activate

ARG REACT_APP_GRAPHQL_ENDPOINT=http://localhost:5000/
ENV REACT_APP_GRAPHQL_ENDPOINT=$REACT_APP_GRAPHQL_ENDPOINT

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/client/package.json apps/client/package.json
RUN pnpm install --frozen-lockfile --filter @hiworld/client

FROM deps AS build

COPY apps/client apps/client
RUN pnpm --filter @hiworld/client build

FROM nginx:1.27-alpine

COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/client/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
