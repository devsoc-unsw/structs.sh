import { adminResolvers } from './domains/admin';
import { contentResolvers } from './domains/content';
import { userResolvers } from './domains/user';
import { statisticsResolver } from './domains/statistics';
import { sessionResolver } from './domains/session';
import { builderResolver } from './domains/builder';

// The resolvers
export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...adminResolvers.Query,
    ...contentResolvers.Query,
    ...statisticsResolver.Query,
    ...sessionResolver.Query,
    ...builderResolver.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...adminResolvers.Mutation,
    ...contentResolvers.Mutation,
    ...statisticsResolver.Mutation,
    ...sessionResolver.Mutation,
    ...builderResolver.Mutation,
  },
};
