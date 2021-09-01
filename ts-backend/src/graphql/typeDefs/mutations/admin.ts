import gql from 'graphql-tag';

export const adminMutationsDef = gql`
  extend type Mutation {
    "Add a new ticket to GalacticEd"
    createTicket(ticket: CreateTicketInput): Ticket
    "Update the details of a ticket in GalacticEd"
    updateTicket(ticket: UpdateTicketInput): Ticket
    "Delete a ticket from GalacticEd"
    deleteTicket(id: String): String
  }
`;
