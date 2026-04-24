import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPathCandidates = [
  join(__dirname, "schema.graphql"),
  join(__dirname, "graphql", "schema.graphql"),
];
const schemaPath =
  schemaPathCandidates.find((candidate) => existsSync(candidate)) ??
  schemaPathCandidates[0];
const typeDefs = readFileSync(schemaPath, "utf8");

export default typeDefs;
