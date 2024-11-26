import Comment from "../models/Comment.js";
import Food from "../models/Food.js";
import User from "../models/User.js";

const CommentController = {
  list: async (req, res) => {
    const { id } = req.params;
    try {
      const comments = await Food.findById(id).populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "firstName lastName email username",
        },
      });

      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: "Error creating comment", error });
    }
  },

  create: async (req, res) => {
    try {
      const { comment, userId } = req.body;
      const { id: foodId } = req.params;

      const newComment = await new Comment({ comment, userId }).save();

      const updatedFood = await Food.updateOne(
        { _id: foodId },
        { $push: { comments: newComment._id } }
      );

      res.status(201).json(updatedFood);
    } catch (error) {
      res.status(500).json({ message: "Error creating comment", error });
    }
  },

  update: async (req, res) => {
    try {
      const { commentId } = req.params;
      const { comment } = req.body;

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { comment },
        { new: true }
      );

      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      res
        .status(200)
        .json({ message: "Comment updated successfully", updatedComment });
    } catch (error) {
      res.status(500).json({ message: "Error updating comment", error });
    }
  },

  delete: async (req, res) => {
    try {
      const { commentId, foodId } = req.params;

      // Remove the comment from the database
      const deletedComment = await Comment.findByIdAndDelete(commentId);

      if (!deletedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Update the food document by removing the comment ID from the comments array
      const updatedFood = await Food.updateOne(
        { _id: foodId },
        { $pull: { comments: commentId } }
      );

      if (updatedFood.modifiedCount === 0) {
        return res
          .status(404)
          .json({ message: "Food not found or comment not removed" });
      }

      // Respond with a success message
      res
        .status(200)
        .json({ message: "Comment deleted successfully", updatedFood });
    } catch (error) {
      // Handle errors and send appropriate response
      res.status(500).json({ message: "Error deleting comment", error });
    }
  },
};

export default CommentController;
