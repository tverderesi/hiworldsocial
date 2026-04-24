import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const entryDir = process.argv[1] ? dirname(process.argv[1]) : process.cwd();
const schemaPathCandidates = [
  join(process.cwd(), "graphql", "schema.graphql"),
  join(process.cwd(), "apps", "server", "graphql", "schema.graphql"),
  join(process.cwd(), "dist", "graphql", "schema.graphql"),
  join(entryDir, "graphql", "schema.graphql"),
  join(entryDir, "..", "graphql", "schema.graphql"),
];
const schemaPath =
  schemaPathCandidates.find((candidate) => existsSync(candidate)) ??
  schemaPathCandidates[0];
const typeDefs = readFileSync(schemaPath, "utf8");

export default typeDefs;
