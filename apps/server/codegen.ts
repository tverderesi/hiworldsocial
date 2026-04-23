import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "graphql/schema.graphql",
  generates: {
    "graphql/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../types.js#GraphQLContext",
        mappers: {
          Post: "../types.js#PostDocument",
          User: "../types.js#UserResolverResult",
        },
      },
    },
  },
};

export default config;
