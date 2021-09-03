"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
/**
 * Home page.
 * @route GET /
 */
const index = (req, res) => {
    res.render("home", {
        title: "Home"
    });
};
exports.index = index;
//# sourceMappingURL=home.js.map