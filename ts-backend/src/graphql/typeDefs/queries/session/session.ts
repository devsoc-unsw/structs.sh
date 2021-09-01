import { gql } from 'graphql-tag';

export const sessionQueriesDef = gql`
  extend type Query {
    "Get a session by id from GalacticEd's database"
    getSessionById(id: String): Session
    "Get all Sessions stored in GalacticEd"
    getAllSessions: [Session]
    "Gets the session prescribed to the child"
    getCurrentSessionForChild(childId: String): FullSession
    "Gets all the sessions prescribed to this child"
    getAllSessionsForChild(childId: String): [Session]
  }
`;
