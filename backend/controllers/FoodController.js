import Food from "../models/Food.js";
import cloudinary from "../configs/cloudinary.js";

const FoodController = {
  list: async (req, res) => {
    try {
      const { search = "" } = req.query;
      let foodItems;

      if (search.length === 0) {
        foodItems = await Food.find().populate("userId");
      } else {
        foodItems = await Food.find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }).populate("userId");
      }

      res.status(200).json(foodItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching food items", error });
    }
  },

  create: async (req, res) => {
    try {
      const { name, description, price, userId } = req.body;

      const cloudUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "takam",
      });
      let image = {
        publicId: cloudUpload.public_id,
        url: cloudUpload.url,
      };
      const newFood = await new Food({
        name,
        description,
        image,
        price,
        userId: userId,
      }).save();
      res.status(201).json({
        message: "Food item created successfully",
        food: newFood,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating food item", error });
    }
  },

  read: async (req, res) => {
    const { id } = req.params;

    try {
      // Find food item by ID
      const foodItem = await Food.findById(id)
        .populate("userId comments")
        .populate({
          path: "comments",
          populate: {
            path: "userId",
          },
        });

      if (!foodItem)
        return res.status(404).json({ message: "Food item not found" });

      res.status(200).json({
        message: "Food item fetched successfully",
        foodItem,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching food item", error });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    console.log(req.body);

    try {
      const cloudUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "takam",
      });

      let image = {
        publicId: cloudUpload.public_id,
        url: cloudUpload.url,
      };

      const updatedFood = await Food.findByIdAndUpdate(
        id,
        { name, description, price, image },
        { new: true }
      );

      if (!updatedFood)
        return res.status(404).json({ message: "Food item not found" });
      res.status(200).json({
        message: "Food item updated successfully",
        food: updatedFood,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating food item", error });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;

    try {
      // Find and delete food item by ID
      const deletedFood = await Food.findByIdAndDelete(id);

      if (!deletedFood)
        return res.status(404).json({ message: "Food item not found" });

      res.status(200).json({
        message: "Food item deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ message: "Error deleting food item", error });
    }
  },
};

export default FoodController;
