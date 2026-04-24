import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "graphql/schema.graphql",
  generates: {
    "graphql/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../types#GraphQLContext",
        mappers: {
          Post: "../types#PostDocument",
          User: "../types#UserResolverResult",
        },
      },
    },
  },
};

export default config;
