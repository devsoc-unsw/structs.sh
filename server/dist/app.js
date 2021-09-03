"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const lusca_1 = __importDefault(require("lusca"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_flash_1 = __importDefault(require("express-flash"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const bluebird_1 = __importDefault(require("bluebird"));
const secrets_1 = require("./util/secrets");
const apollo_server_express_1 = require("apollo-server-express");
const consola_1 = __importDefault(require("consola"));
// Controllers (route handlers)
const homeController = __importStar(require("./controllers/home"));
const userController = __importStar(require("./controllers/user"));
const apiController = __importStar(require("./controllers/api"));
const contactController = __importStar(require("./controllers/contact"));
const graphql_1 = require("./graphql");
// GraphQL Models
const Models = __importStar(require("./schema"));
// API keys and Passport configuration
const passportConfig = __importStar(require("./config/passport"));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    /* ------------------- Creating Express and Apollo server ------------------- */
    const app = express_1.default();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        typeDefs: graphql_1.typeDefs,
        resolvers: graphql_1.resolvers,
        playground: process.env.NODE_ENV === "dev",
        context: Object.assign({}, Models),
    });
    yield apolloServer.start();
    consola_1.default.success({
        message: "Successfully started the Apollo GraphQL server",
        badge: true,
    });
    /* --------------------------- Connect to MongoDB --------------------------- */
    const mongoUrl = secrets_1.MONGODB_URI;
    try {
        mongoose_1.default.Promise = bluebird_1.default;
        mongoose_1.default.set("useUnifiedTopology", true);
        yield mongoose_1.default.connect(mongoUrl, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });
        consola_1.default.success({
            message: `Successfully connected to MongoDB instance with string: ${mongoUrl}`,
            badge: true,
        });
    }
    catch (err) {
        consola_1.default.error(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
        process.exit(1);
    }
    /* ------------------------ Express app configuration ----------------------- */
    app.set("port", process.env.PORT || 3000);
    app.set("views", path_1.default.join(__dirname, "../views"));
    app.set("view engine", "pug");
    // Injecting Apollo server middleware
    apolloServer.applyMiddleware({ app });
    app.use(compression_1.default());
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(express_session_1.default({
        resave: true,
        saveUninitialized: true,
        secret: secrets_1.SESSION_SECRET,
        store: new connect_mongo_1.default({
            mongoUrl,
            mongoOptions: {
                autoReconnect: true,
            },
        }),
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use(express_flash_1.default());
    app.use(lusca_1.default.xframe("SAMEORIGIN"));
    app.use(lusca_1.default.xssProtection(true));
    app.use((req, res, next) => {
        res.locals.user = req.user;
        next();
    });
    app.use((req, res, next) => {
        // After successful login, redirect back to the intended page
        if (!req.user &&
            req.path !== "/login" &&
            req.path !== "/signup" &&
            !req.path.match(/^\/auth/) &&
            !req.path.match(/\./)) {
            req.session.returnTo = req.path;
        }
        else if (req.user && req.path == "/account") {
            req.session.returnTo = req.path;
        }
        next();
    });
    app.use(express_1.default.static(path_1.default.join(__dirname, "public"), { maxAge: 31557600000 }));
    /* -------------------------------------------------------------------------- */
    /*                                   Routes                                   */
    /* -------------------------------------------------------------------------- */
    app.get("/", homeController.index);
    app.get("/login", userController.getLogin);
    app.post("/login", userController.postLogin);
    app.get("/logout", userController.logout);
    app.get("/forgot", userController.getForgot);
    app.post("/forgot", userController.postForgot);
    app.get("/reset/:token", userController.getReset);
    app.post("/reset/:token", userController.postReset);
    app.get("/signup", userController.getSignup);
    app.post("/signup", userController.postSignup);
    app.get("/contact", contactController.getContact);
    app.post("/contact", contactController.postContact);
    app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
    app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
    app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
    app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
    app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);
    /* ------------------------------ Sample Routes ----------------------------- */
    app.get("/api", apiController.getApi);
    app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
    /* ----------------- OAuth authentication routes. (Sign in) ----------------- */
    app.get("/auth/facebook", passport_1.default.authenticate("facebook", {
        scope: ["email", "public_profile"],
    }));
    app.get("/auth/facebook/callback", passport_1.default.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
        res.redirect(req.session.returnTo || "/");
    });
    return [app, apolloServer];
});
exports.default = startServer;
//# sourceMappingURL=app.js.map