import User from "../models/User.js";
import Token from "../models/Token.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwtHelper.js";

const UserController = {
  signup: async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;

    try {
      // Check if the user already exists by email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }

      // Check if the user already exists by username
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already in use" });
      }

      // Create a new user object
      const newUser = new User({
        firstName,
        lastName,
        email,
        username,
        password,
      });
      newUser.password = await bcrypt.hash(password, 10);

      // Save the user to the database
      await newUser.save();

      res.status(201).json({
        message: "User registered successfully",
        user: { email: newUser.email, username: newUser.username },
      });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid password" });

      // Generate a JWT token after successful login
      const token = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      await new Token({ token: refreshToken, userId: user._id }).save();

      // Respond with success and the token
      res.status(200).json({
        message: "User logged in successfully",
        accessToken: token,
        refreshToken,
        user: {
          userId: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging in user", error });
    }
  },

  refreshToken: async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).send({ message: Unauthorized });

    try {
      const dbToken = await Token.findOne({ token }).populate("userId");
      if (!dbToken) return res.status(403).send({ message: "Forbidden" });

      jwt.verify(
        dbToken.token,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        (err, decoded) => {
          if (err) return res.status(403).send({ message: "Forbidden" });

          const newAccessToken = generateAccessToken(dbToken.userId);

          res.send({ accessToken: newAccessToken });
        }
      );
    } catch (error) {
      res.status(500).send({ message: "Error refreshing token" });
    }
  },

  logout: async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
      // Delete the refresh token from the database
      const deletedToken = await Token.deleteOne({ token: refreshToken });

      if (deletedToken.deletedCount === 0) {
        return res
          .status(404)
          .json({ message: "Token not found or already deleted" });
      }

      res.status(200).json({
        message: "User logged out successfully",
      });
    } catch (error) {
      res.status(500).send({ message: "Error logging out", error });
    }
  },
};

export default UserController;
