import { gql } from 'graphql-tag';

export const builderQueriesDef = gql`
  extend type Query {
    "Given a query, returns a list of URLs of relevant images"
    getImages(query: String, searchOptions: ImageSearchOptions): [Image]
  }
`;
