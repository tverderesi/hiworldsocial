import { config } from "dotenv";
import mongoose from "mongoose";

import Post from "../models/Post.js";
import User from "../models/User.js";

config({ quiet: true });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB;

if (!MONGODB_URI) {
  throw new Error("Missing required environment variable: MONGODB_URI");
}

const requiredCollections = [
  User.collection.collectionName,
  Post.collection.collectionName,
];

async function ensureCollection(name: string) {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection is not available");
  }

  const existingCollection = await db.listCollections({ name }).next();

  if (existingCollection) {
    console.log(`Collection already exists: ${name}`);
    return;
  }

  await db.createCollection(name);
  console.log(`Created collection: ${name}`);
}

async function main() {
  mongoose.set("strictQuery", false);

  await mongoose.connect(MONGODB_URI);

  const databaseName = mongoose.connection.db?.databaseName ?? "unknown";
  console.log(`Connected to MongoDB database: ${databaseName}`);

  for (const collectionName of requiredCollections) {
    await ensureCollection(collectionName);
  }

  console.log("Database setup complete.");
}

try {
  await main();
} finally {
  await mongoose.disconnect();
}
