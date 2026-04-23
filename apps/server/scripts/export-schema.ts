import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { lexicographicSortSchema, printSchema } from "graphql";

import schema from "../graphql/schema.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(
  __dirname,
  "..",
  "..",
  "client",
  "src",
  "graphql",
  "schema.graphql"
);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${printSchema(lexicographicSortSchema(schema))}\n`, "utf8");

console.log(`Exported schema to ${outputPath}`);
