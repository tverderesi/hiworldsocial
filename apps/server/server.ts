import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import cors, { type CorsRequest } from "cors";
import express from "express";
import http from "node:http";

import schema from "./graphql/schema";
import type { GraphQLContext } from "./types";

export function getAllowedOrigins() {
  return Array.from(
    new Set(
      [
        process.env.CLIENT_URL,
        process.env.APP_URL,
        "https://hiworldsocial.vercel.app",
        "https://hiworldsocial.social",
        "http://hiworld.social",
        "http://server.hiworld.social",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ].filter((origin): origin is string => Boolean(origin))
    )
  );
}

function getApolloServerPlugins(httpServer?: http.Server) {
  const isDevelopment = process.env.NODE_ENV !== "production";

  return [
    ...(httpServer ? [ApolloServerPluginDrainHttpServer({ httpServer })] : []),
    ...(isDevelopment
      ? [
          ApolloServerPluginLandingPageLocalDefault({
            embed: true,
          }),
        ]
      : []),
  ];
}

export function createApolloServer(httpServer?: http.Server) {
  if (!process.env.SECRET_KEY) {
    throw new Error("Missing required environment variable: SECRET_KEY");
  }

  return new ApolloServer<GraphQLContext>({
    schema,
    introspection: process.env.NODE_ENV !== "production",
    status400ForVariableCoercionErrors: true,
    plugins: getApolloServerPlugins(httpServer),
  });
}

export async function createApolloApp() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = createApolloServer(httpServer);

  await server.start();

  app.use(
    "/graphql",
    cors<CorsRequest>({
      origin: getAllowedOrigins(),
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );

  app.get("/", (_req, res) => {
    res.redirect("/graphql");
  });

  return { app, httpServer };
}
