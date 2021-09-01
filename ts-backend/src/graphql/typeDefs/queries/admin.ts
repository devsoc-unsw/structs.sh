import gql from 'graphql-tag';

export const adminQueriesDef = gql`
  extend type Query {
    "Get all tickets currently in GalacticEd"
    getAllTickets: [Ticket]
    "Get a ticket by id"
    getTicketById(id: String): Ticket
  }
`;
