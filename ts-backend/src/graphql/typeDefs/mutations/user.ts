import gql from 'graphql-tag';

export const userMutationsDef = gql`
  extend type Mutation {
    "Add a child to a parent in GalacticEd"
    createChild(child: CreateChildInput, parentId: String): Child
    "Update the details of a user in GalacticEd"
    updateUser(user: UpdateUserInput): String
    "Update the details of a child in GalacticEd"
    updateChild(child: UpdateChildInput): Child
    "Delete a user from GalacticEd"
    deleteUser(id: String): String
  }
`;
