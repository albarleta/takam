import Cart from "../models/Cart.js";
import User from "../models/User.js";

const CartController = {
  list: async (req, res) => res.json("list"),

  create: async (req, res) => {
    const { userId, foodId, quantity, total } = req.body;

    const newCartItem = await new Cart({
      userId,
      foodId,
      quantity,
      total,
    }).save();

    res.json(newCartItem);
  },

  listUserCart: async (req, res) => {
    const { username } = req.params;

    if (!username) return;

    const { _id } = await User.findOne({ username });

    const cartItems = await Cart.find({ userId: _id }).populate({
      path: "foodId",
      select: "_id name image price",
      populate: { path: "userId", select: "firstName lastName username" },
    });

    res.status(200).json(cartItems);
  },

  delete: async (req, res) => {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
  },

  deleteAll: async (req, res) => {
    await Cart.deleteMany({});

    res.status(200).json({ message: "Deleted all cart items" });
  },
};

export default CartController;
