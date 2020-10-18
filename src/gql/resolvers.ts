// import pubsub from 'src/gql/pubsub'

const USER_ADDED = 'USER_ADDED';

import { GQLContext } from 'src/server';

interface GQLSchemaFragment {
  [key: string]: (root: any, args: any, ctx: GQLContext) => any;
}

interface GQLObject {
  [key: string]: any;
}

interface GQLResolverSchema {
  Query: GQLSchemaFragment;
  Mutation: GQLSchemaFragment;
}

const resolvers: Partial<GQLResolverSchema> = {
  Query: {
    async user(__, { id }, { req, models }) {
      return models.User.findOne({
        where: { id },
      });
    },
  },
  Mutation: {
    async login(__, args, { models, req }) {
      return {};
    },
  },
};
export default resolvers;
