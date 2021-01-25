const {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} = require("graphql");

const tables = require("./tables");
const loaders = require("./loaders");
const { connectionDefinitions } = require("graphql-relay");

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
  fields: () => {
    return {
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
      friends: {
        type: new GraphQLList(UserType),
        resolve(source) {
          return loaders.getFriendIdsForUser(source).then((rows) => {
            const promises = rows.map((row) => {
              const friendNodeId = tables.dbIdToNodeId(
                row.user_id_b,
                row.__tableName
              );
              return loaders.getNodeById(friendNodeId);
            });
            return Promise.all(promises);
          });
        },
      },
      posts: {
        type: PostsConnectionType,
        args: {
          after: {
            type: GraphQLString,
          },
          first: {
            type: GraphQLInt,
          },
        },
        resolve(source, args, context) {
          return loaders
            .getPostIdsForUser(source, args, context)
            .then(({ rows, pageInfo }) => {
              const promises = rows.map((row) => {
                const postNodeId = tables.dbIdToNodeId(row.id, row.__tableName);

                return loaders.getNodeById(postNodeId).then((node) => {
                  const edge = {
                    node,
                    cursor: row.__cursor,
                  };
                  return edge;
                });
              });
              return Promise.all(promises).then((edges) => {
                return {
                  edges,
                  pageInfo,
                };
              });
            });
        },
      },
    };
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

const { connectionType: PostsConnectionType } = connectionDefinitions({
  nodeType: PostType
});

exports.NodeInterface = NodeInterface;
exports.UserType = UserType;
exports.PostType = PostType;
