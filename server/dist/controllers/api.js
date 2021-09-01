"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFacebook = exports.getApi = void 0;
const fbgraph_1 = __importDefault(require("fbgraph"));
/**
 * List of API examples.
 * @route GET /api
 */
const getApi = (req, res) => {
    res.render("api/index", {
        title: "API Examples"
    });
};
exports.getApi = getApi;
/**
 * Facebook API example.
 * @route GET /api/facebook
 */
const getFacebook = (req, res, next) => {
    const user = req.user;
    const token = user.tokens.find((token) => token.kind === "facebook");
    fbgraph_1.default.setAccessToken(token.accessToken);
    fbgraph_1.default.get(`${user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err, results) => {
        if (err) {
            return next(err);
        }
        res.render("api/facebook", {
            title: "Facebook API",
            profile: results
        });
    });
};
exports.getFacebook = getFacebook;
//# sourceMappingURL=api.js.map