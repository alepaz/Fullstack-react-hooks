console.log({ starting: true });

const express = require("express");
const graphqlHTTP = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");

const { NodeInterface, PostType, UserType } = require("./src/types");

const loaders = require("./src/loaders");

const app = express();

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  description: "The root query",
  fields: {
    node: {
      type: NodeInterface,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(source, args, context, info) {
        return loaders.getNodeById(args.id);
      },
    },
  },
});

let inMemoryStore = {};
const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  description: "The root mutation",
  fields: {
    setNode: {
      type: GraphQLString,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        value: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(source, args) {
        inMemoryStore[args.key] = args.value;
        return inMemoryStore[args.key];
      },
    },
  },
});

const Schema = new GraphQLSchema({
  types: [UserType, PostType],
  query: RootQuery,
  mutation: RootMutation,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: Schema,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log({ running: true });
});
