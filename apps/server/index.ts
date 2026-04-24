import { config } from "dotenv";
import mongoose from "mongoose";

import { createApolloApp } from "./server";

config({ quiet: true });

const PORT = Number(process.env.PORT || 5000);
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB;

if (!MONGODB_URI) {
  throw new Error("Missing required environment variable: MONGODB_URI");
}

mongoose.set("strictQuery", false);

await mongoose.connect(MONGODB_URI);
console.log("MongoDB connected.");

const { httpServer } = await createApolloApp();

await new Promise<void>((resolve) => {
  httpServer.listen({ port: PORT }, () => resolve());
});

console.log(`Server running at http://localhost:${PORT}/graphql`);
