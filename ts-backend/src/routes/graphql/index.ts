import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { Router } from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs, resolvers } from '../../graphql';

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphqlRouter = Router();

// The GraphQL endpoint
graphqlRouter.use('/graphql', graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
graphqlRouter.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

export default graphqlRouter;
