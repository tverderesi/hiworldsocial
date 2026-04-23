import { config } from "dotenv";
import mongoose from "mongoose";

import { createApolloServer, getAllowedOrigins } from "./server.js";

config({ quiet: true });

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB;

if (!MONGODB_URI) {
  throw new Error("Missing required environment variable: MONGODB_URI");
}

mongoose.set("strictQuery", false);

await mongoose.connect(MONGODB_URI);
console.log("MongoDB connected.");

const server = createApolloServer();
const { url } = await server.listen({
  port: PORT,
  cors: {
    origin: getAllowedOrigins(),
    credentials: true,
  },
});
console.log(`Server running at ${url}`);
