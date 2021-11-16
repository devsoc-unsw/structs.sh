"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var routes_1 = require("./routes");
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
/**
 * Configure process environment to the .env file
 */
dotenv_1["default"].config();
/**
 * Connect to mongoDB client
 */
mongoose_1["default"].connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose_1["default"].connection;
db.on('error', console.error.bind(console, 'An error occurred while connecting to MongoDB 😭: '));
var app = (0, express_1["default"])();
/**
 * CORS
 */
app.use(function (req, res, next) {
    /**
     * Website you wish to allow to connect
     */
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use((0, cors_1["default"])());
app.options('*', (0, cors_1["default"])());
/**
 * Add body parsing and urlencoded from deprecated bodyParser
 */
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
/**
 * Add all routes to the app
 */
var appRoutes = routes_1.router;
app.use(appRoutes);
app.use(function (err, req, res, next) {
    res.status(err.status || 500).send(err);
});
app.listen(process.env.PORT, function () {
    console.log(" \u27A4 Structs.sh listening at port: " + process.env.PORT + " \uD83D\uDE80");
});
