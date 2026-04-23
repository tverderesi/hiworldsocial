import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gql } from "apollo-server";

const __dirname = dirname(fileURLToPath(import.meta.url));

const schema = readFileSync(join(__dirname, "schema.graphql"), "utf8");
const typeDefs = gql(schema);

export default typeDefs;
