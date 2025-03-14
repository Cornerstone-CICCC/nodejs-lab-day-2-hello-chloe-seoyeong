import { Request, Response } from "express";
import userModel from "../models/user.model";
import { IUser } from "../types/user";

/**
 * Get all user lists
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const getAllUser = (req: Request, res: Response) => {
  const allUsers = userModel.getAllUser();
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
const getUserByUsername = (req: Request, res: Response) => {
  if (req.session && req.session.username) {
    const user = userModel.findByUsername(req.session.username);
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
const loginUser = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response
) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(500).json({ message: "Missing one of those or both." });
    return;
  }
  const user = await userModel.login(username, password);
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
};

/**
 * Add new user
 *
 * @param {Request<{}, {}, Omit<IUser, 'id'>>} req
 * @param {Response} res
 * @returns {void} Return newly created user.
 */
const addUser = async (
  req: Request<{}, {}, Omit<IUser, "id">>,
  res: Response
) => {
  const { username, password, firstname, lastname } = req.body;
  if (!username || !password || !firstname || !lastname) {
    res.status(500).json({
      message: "You need to fill all forms!",
    });
    return;
  }
  const user = await userModel.create({
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
};

/**
 * Logouted user
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Redirect to signup
 */
const logout = (req: Request, res: Response) => {
  req.session = null;
  res.status(200).json({
    content: "Session cookie cleared!",
  });
};

export default {
  getUserByUsername,
  loginUser,
  addUser,
  logout,
  getAllUser,
};
