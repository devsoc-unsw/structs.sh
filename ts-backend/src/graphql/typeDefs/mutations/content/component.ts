import gql from 'graphql-tag';

export const componentMutationsDef = gql`
  extend type Mutation {
    "Add a new component to a question in GalacticEd"
    createComponent(component: CreateComponentInput): Component
    "Delete a component from GalacticEd"
    deleteComponent(id: String): String
  }
`;
