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
exports.postForgot = exports.getForgot = exports.postReset = exports.getReset = exports.getOauthUnlink = exports.postDeleteAccount = exports.postUpdatePassword = exports.postUpdateProfile = exports.getAccount = exports.postSignup = exports.getSignup = exports.logout = exports.postLogin = exports.getLogin = void 0;
const async_1 = __importDefault(require("async"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const passport_1 = __importDefault(require("passport"));
const User_1 = require("../schema/User");
const express_validator_1 = require("express-validator");
require("../config/passport");
/**
 * Login page.
 * @route GET /login
 */
const getLogin = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('account/login', {
        title: 'Login',
    });
};
exports.getLogin = getLogin;
/**
 * Sign in using email and password.
 * @route POST /login
 */
const postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check('email', 'Email is not valid').isEmail().run(req);
    yield express_validator_1.check('password', 'Password cannot be blank')
        .isLength({ min: 1 })
        .run(req);
    yield express_validator_1.sanitize('email')
        .normalizeEmail({ gmail_remove_dots: false })
        .run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/login');
    }
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('errors', { msg: info.message });
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', { msg: 'Success! You are logged in.' });
            res.redirect(req.session.returnTo || '/');
        });
    })(req, res, next);
});
exports.postLogin = postLogin;
/**
 * Log out.
 * @route GET /logout
 */
const logout = (req, res) => {
    req.logout();
    res.redirect('/');
};
exports.logout = logout;
/**
 * Signup page.
 * @route GET /signup
 */
const getSignup = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('account/signup', {
        title: 'Create Account',
    });
};
exports.getSignup = getSignup;
/**
 * Create a new local account.
 * @route POST /signup
 */
const postSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check('email', 'Email is not valid').isEmail().run(req);
    yield express_validator_1.check('password', 'Password must be at least 4 characters long')
        .isLength({ min: 4 })
        .run(req);
    yield express_validator_1.check('confirmPassword', 'Passwords do not match')
        .equals(req.body.password)
        .run(req);
    yield express_validator_1.sanitize('email')
        .normalizeEmail({ gmail_remove_dots: false })
        .run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/signup');
    }
    const user = new User_1.User({
        email: req.body.email,
        password: req.body.password,
    });
    User_1.User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            req.flash('errors', {
                msg: 'Account with that email address already exists.',
            });
            return res.redirect('/signup');
        }
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});
exports.postSignup = postSignup;
/**
 * Profile page.
 * @route GET /account
 */
const getAccount = (req, res) => {
    res.render('account/profile', {
        title: 'Account Management',
    });
};
exports.getAccount = getAccount;
/**
 * Update profile information.
 * @route POST /account/profile
 */
const postUpdateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check('email', 'Please enter a valid email address.')
        .isEmail()
        .run(req);
    yield express_validator_1.sanitize('email')
        .normalizeEmail({ gmail_remove_dots: false })
        .run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/account');
    }
    const user = req.user;
    User_1.User.findById(user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user.email = req.body.email || '';
        user.profile.name = req.body.name || '';
        user.profile.gender = req.body.gender || '';
        user.profile.location = req.body.location || '';
        user.profile.website = req.body.website || '';
        user.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    req.flash('errors', {
                        msg: 'The email address you have entered is already associated with an account.',
                    });
                    return res.redirect('/account');
                }
                return next(err);
            }
            req.flash('success', {
                msg: 'Profile information has been updated.',
            });
            res.redirect('/account');
        });
    });
});
exports.postUpdateProfile = postUpdateProfile;
/**
 * Update current password.
 * @route POST /account/password
 */
const postUpdatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check('password', 'Password must be at least 4 characters long')
        .isLength({ min: 4 })
        .run(req);
    yield express_validator_1.check('confirmPassword', 'Passwords do not match')
        .equals(req.body.password)
        .run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/account');
    }
    const user = req.user;
    User_1.User.findById(user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user.password = req.body.password;
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', { msg: 'Password has been changed.' });
            res.redirect('/account');
        });
    });
});
exports.postUpdatePassword = postUpdatePassword;
/**
 * Delete user account.
 * @route POST /account/delete
 */
const postDeleteAccount = (req, res, next) => {
    const user = req.user;
    User_1.User.remove({ _id: user.id }, (err) => {
        if (err) {
            return next(err);
        }
        req.logout();
        req.flash('info', { msg: 'Your account has been deleted.' });
        res.redirect('/');
    });
};
exports.postDeleteAccount = postDeleteAccount;
/**
 * Unlink OAuth provider.
 * @route GET /account/unlink/:provider
 */
const getOauthUnlink = (req, res, next) => {
    const provider = req.params.provider;
    const user = req.user;
    User_1.User.findById(user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user[provider] = undefined;
        user.tokens = user.tokens.filter((token) => token.kind !== provider);
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.flash('info', {
                msg: `${provider} account has been unlinked.`,
            });
            res.redirect('/account');
        });
    });
};
exports.getOauthUnlink = getOauthUnlink;
/**
 * Reset Password page.
 * @route GET /reset/:token
 */
const getReset = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    User_1.User.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires')
        .gt(Date.now())
        .exec((err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('errors', {
                msg: 'Password reset token is invalid or has expired.',
            });
            return res.redirect('/forgot');
        }
        res.render('account/reset', {
            title: 'Password Reset',
        });
    });
};
exports.getReset = getReset;
/**
 * Process the reset password request.
 * @route POST /reset/:token
 */
const postReset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check('password', 'Password must be at least 4 characters long.')
        .isLength({ min: 4 })
        .run(req);
    yield express_validator_1.check('confirm', 'Passwords must match.')
        .equals(req.body.password)
        .run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('back');
    }
    async_1.default.waterfall([
        function resetPassword(done) {
            User_1.User.findOne({ passwordResetToken: req.params.token })
                .where('passwordResetExpires')
                .gt(Date.now())
                .exec((err, user) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    req.flash('errors', {
                        msg: 'Password reset token is invalid or has expired.',
                    });
                    return res.redirect('back');
                }
                user.password = req.body.password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                user.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    req.logIn(user, (err) => {
                        done(err, user);
                    });
                });
            });
        },
        function sendResetPasswordEmail(user, done) {
            const transporter = nodemailer_1.default.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD,
                },
            });
            const mailOptions = {
                to: user.email,
                from: 'express-ts@starter.com',
                subject: 'Your password has been changed',
                text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash('success', {
                    msg: 'Success! Your password has been changed.',
                });
                done(err);
            });
        },
    ], (err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
exports.postReset = postReset;
/**
 * Forgot Password page.
 * @route GET /forgot
 */
const getForgot = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('account/forgot', {
        title: 'Forgot Password',
    });
};
exports.getForgot = getForgot;
/**
 * Create a random token, then the send user an email with a reset link.
 * @route POST /forgot
 */
const postForgot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check('email', 'Please enter a valid email address.')
        .isEmail()
        .run(req);
    yield express_validator_1.sanitize('email')
        .normalizeEmail({ gmail_remove_dots: false })
        .run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/forgot');
    }
    async_1.default.waterfall([
        function createRandomToken(done) {
            crypto_1.default.randomBytes(16, (err, buf) => {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        function setRandomToken(token, done) {
            User_1.User.findOne({ email: req.body.email }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    req.flash('errors', {
                        msg: 'Account with that email address does not exist.',
                    });
                    return res.redirect('/forgot');
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        function sendForgotPasswordEmail(token, user, done) {
            const transporter = nodemailer_1.default.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD,
                },
            });
            const mailOptions = {
                to: user.email,
                from: 'hackathon@starter.com',
                subject: 'Reset your password on Hackathon Starter',
                text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash('info', {
                    msg: `An e-mail has been sent to ${user.email} with further instructions.`,
                });
                done(err);
            });
        },
    ], (err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/forgot');
    });
});
exports.postForgot = postForgot;
//# sourceMappingURL=user.js.map