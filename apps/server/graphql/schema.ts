import { makeExecutableSchema } from "@graphql-tools/schema";

import resolvers from "./resolvers/index.js";
import typeDefs from "./typeDefs.js";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
