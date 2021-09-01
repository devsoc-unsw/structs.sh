import gql from 'graphql-tag';

export const ticketTypeDefs = gql`
  "This is the model for a ticket in GalacticEd's admin/curator system."
  type Ticket {
    "Unique identifier for a raised ticket"
    _id: String
    "The User who has created this ticket"
    createdBy: CreatedBy
    "The timestamp of the creation of this ticket"
    createdAt: String
    "The type of request the ticket makes"
    request: String
    "The approval status of this ticket"
    status: String
    "The description of this ticket"
    description: String
  }

  "Definition of a created by entry"
  type CreatedBy {
    "Name of the user"
    name: String
    "Avatar of this user (not important)"
    avatar: String
  }

  "This is the model for creating ticket in our admin/curator system."
  input CreateTicketInput {
    "The User who has created this ticket"
    createdBy: CreatedByInput
    "The timestamp of the creation of this ticket"
    createdAt: String
    "The type of request the ticket makes"
    request: String
    "The description of this ticket"
    description: String
  }

  "Input type for a created by entry"
  input CreatedByInput {
    "Full name of the user"
    name: String
    "Avatar of this user (not important)"
    avatar: String
  }

  "Model defining the update input for a ticket"
  input UpdateTicketInput {
    "Unique identifier for a raised ticket"
    _id: String!
    "The User who has created this ticket"
    createdBy: CreatedByInput
    "The timestamp of the creation of this ticket"
    createdAt: String
    "The type of request the ticket makes"
    request: String
    "The approval status of this ticket"
    status: String
    "The description of this ticket"
    description: String
  }
`;
