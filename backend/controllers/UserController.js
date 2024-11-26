import User from "../models/User.js";
import Food from "../models/Food.js";

const UserController = {
  list: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({
        message: "Users fetched successfully",
        users,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  },

  read: async (req, res) => {
    const { username } = req.params;

    try {
      const user = await User.findOne({ username }).select(
        "firstName lastName username email"
      );

      console.log(req.params);

      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({
        message: "User fetched successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  },

  update: async (req, res) => {
    const { username: usernameParams } = req.params;

    const { email, username, firstName, lastName } = req.body;
    try {
      const updatedUser = await User.findOneAndUpdate(
        { username: usernameParams },
        { email, username, firstName, lastName },
        { new: true }
      ).select("-password");

      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });
      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  },

  delete: async (req, res) => {
    const { username } = req.params;
    try {
      const deletedUser = await User.findOneAndDelete({ username });
      if (!deletedUser)
        return res.status(404).json({ message: "User not found" });
      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  },

  listFoods: async (req, res) => {
    const { username } = req.params;

    try {
      const user = await User.findOne({ username });
      const foods = await Food.find({ userId: user._id });

      res.status(200).json({
        message: "Users fetched successfully",
        foods,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  },
};

export default UserController;
