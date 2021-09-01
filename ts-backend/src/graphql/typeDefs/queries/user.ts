import gql from 'graphql-tag';

export const userQueriesDef = gql`
  extend type Query {
    "Get a user by their id"
    getUserById(id: String): User
    "Get a child by their id"
    getChildById(id: String): Child
    "Get all children"
    getAllChildren: [Child]
    "Get all the children of this user"
    getChildrenOfUser(userId: String): [Child]
  }
`;
