import { makeSchema } from "nexus";
import { Query } from "./query";
import { Mutation } from "./mutation";
import path from "path";

export const getSchema = () => {
  const schema = makeSchema({
    types: [Query, Mutation],
    outputs: {
      schema: path.join(process.cwd(), "nexus", "schema.graphql"),
      typegen: path.join(process.cwd(), "nexus", "nexus.tsx"),
    },
  });

  return schema;
};
