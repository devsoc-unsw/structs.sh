"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_1 = __importDefault(require("errorhandler"));
const app_1 = __importDefault(require("./app"));
const consola_1 = __importDefault(require("consola"));
app_1.default().then(([app, apolloServer]) => {
    /**
     * Error Handler. Provides full stack tracing
     */
    if (process.env.NODE_ENV === "development") {
        app.use(errorhandler_1.default());
    }
    /**
     * Start Express server.
     */
    app.listen(app.get("port"), () => {
        consola_1.default.success({
            message: `App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`,
            badge: true,
        });
        consola_1.default.info({
            message: "Press CTRL-C to stop",
            badge: true,
        });
    });
});
//# sourceMappingURL=server.js.map