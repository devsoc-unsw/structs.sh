"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql `
    extend type Query {
        getAllPings: [Ping]!
    }

    extend type Mutation {
        createNewPingMessage(newPingMessage: NewPingMessage): Ping!
    }

    input NewPingMessage {
        title: String!
        message: String!
        createdAt: String
        updatedAt: String
    }

    type Ping {
        title: String!
        message: String!
        createdAt: String
        updatedAt: String
    }
`;
//# sourceMappingURL=ping.js.map