"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Schema definition for a GraphQL 'ping' test query
const mongoose_1 = require("mongoose");
const collectionName = 'pings';
const pingSchema = new mongoose_1.Schema({
    title: String,
    message: String,
}, {
    timestamps: true,
});
const Ping = mongoose_1.model(collectionName, pingSchema);
exports.default = Ping;
//# sourceMappingURL=Ping.js.map