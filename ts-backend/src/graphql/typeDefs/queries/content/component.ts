import { gql } from 'graphql-tag';

export const componentQueriesDef = gql`
  extend type Query {
    "Get all components for a question"
    getAllComponents(questionId: String): [Component]
    "Get a component by id"
    getComponentById(id: String): Component
  }
`;
