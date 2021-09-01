import { gql } from 'graphql-tag';

export const questionQueriesDef = gql`
  extend type Query {
    "Get a question by id"
    getQuestionById(id: String): Question
  }
`;
