const {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");

const tables = require("./tables");

const NodeInterface = new GraphQLInterfaceType({
  name: "Node",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolveType: (source) => {
    if (source.__tableName === tables.users.getName()) {
      return UserType;
    }
    return PostType;
  },
});

const resolveId = (source) => {
  return tables.dbIdToNodeId(source.id, source.__tableName);
};

const UserType = new GraphQLObjectType({
  name: "User",
  interfaces: [NodeInterface],
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: resolveId,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    about: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

const PostType = new GraphQLObjectType({
  name: "Post",
  interfaces: [NodeInterface],
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: resolveId,
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    body: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

exports.NodeInterface = NodeInterface;
exports.UserType = UserType;
exports.PostType = PostType;