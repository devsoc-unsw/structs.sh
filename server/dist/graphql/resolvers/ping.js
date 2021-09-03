"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consola_1 = __importDefault(require("consola"));
// Note: see resolver arguments: https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments
exports.default = {
    Query: {
        getAllPings: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { Ping } = context;
            const documents = yield Ping.find();
            consola_1.default.success({
                message: `Fetched all ping messages. Found ${documents.length} documents`,
            });
            return documents;
        }),
    },
    Mutation: {
        createNewPingMessage: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Extracting the graphQL mutation's arguments. The arguments are defined in `src/graphql/typeDefs/Ping.ts`
                const { newPingMessage } = args;
                // 'Ping' is the schema definition in models/Ping.ts.
                // We're able to receive it here in this callback because we passed in
                // `context: { ...Models }` in app.ts
                const { Ping } = context;
                const newDocument = yield Ping.create(newPingMessage);
                console.log(newDocument);
                consola_1.default.success({
                    message: `Created a new ping message. Title: ${newDocument.title}`,
                });
                return newDocument;
            }
            catch (err) {
                console.log(err);
            }
        }),
    },
};
//# sourceMappingURL=ping.js.map