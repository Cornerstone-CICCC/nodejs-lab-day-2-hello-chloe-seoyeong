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
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Get all user lists
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const getAllUser = (req, res) => {
    const allUsers = user_model_1.default.getAllUser();
    if (!allUsers) {
        res.status(500).json({
            message: "No users!",
        });
    }
    res.status(200).json(allUsers);
};
/**
 * Get user by username
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Return user and redirect to profile page
 */
const getUserByUsername = (req, res) => {
    if (req.session && req.session.username) {
        const user = user_model_1.default.findByUsername(req.session.username);
        res.status(200).json(user);
        return;
    }
    res.status(500).json({
        message: "Not found user.",
    });
};
/**
 * Login user
 *
 * @param {Request<{}, {}, {username: string, password: string}>} req
 * @param {Response} res
 * @returns {void} Returns cookie and redirect
 */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(500).json({ message: "Missing one of those or both." });
        return;
    }
    const user = yield user_model_1.default.login(username, password);
    if (!user) {
        res.status(500).json({ message: "Incorrect one of those or both." });
        return;
    }
    if (req.session) {
        req.session.isLoggedIn = true;
        req.session.username = username;
    }
    res.status(200).json({
        message: "Successfully Logged In! 😆",
    });
});
/**
 * Add new user
 *
 * @param {Request<{}, {}, Omit<IUser, 'id'>>} req
 * @param {Response} res
 * @returns {void} Return newly created user.
 */
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, firstname, lastname } = req.body;
    if (!username || !password || !firstname || !lastname) {
        res.status(500).json({
            message: "You need to fill all forms!",
        });
        return;
    }
    const user = yield user_model_1.default.create({
        username,
        password,
        firstname,
        lastname,
    });
    if (!user) {
        res.status(400).json({
            message: "Username is already taken!",
        });
        return;
    }
    res.status(200).json({
        message: "Added new user successfully! 🙂",
    });
});
/**
 * Logouted user
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Redirect to signup
 */
const logout = (req, res) => {
    req.session = null;
    res.status(200).json({
        content: "Session cookie cleared!",
    });
};
exports.default = {
    getUserByUsername,
    loginUser,
    addUser,
    logout,
    getAllUser,
};
