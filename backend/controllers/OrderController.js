import Order from "../models/Order.js";
import User from "../models/User.js";

const OrderController = {
  list: async (req, res) => {
    try {
      const orders = await Order.find();

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error getting orders", error });
    }
  },

  listUserOrders: async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });

    const orders = await Order.find({ userId: user.id });

    res.status(200).json(orders);

    try {
    } catch (error) {
      res.status(500).json({ message: "Error getting user orders", error });
    }
  },

  create: async (req, res) => {
    const { userId, items, total } = req.body;

    try {
      const newOrder = await new Order({
        userId,
        items,
        total,
      }).save();

      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ message: "Error creating orderr", error });
    }
  },
  read: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: "Error reading order", error });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedOrder = await Order.findByIdAndUpdate(id, req.body);
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Error updating order", error });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedOrder = await Order.findByIdAndDelete(id);

      if (!deletedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res
        .status(200)
        .json({ message: "Order deleted successfully", deletedOrder });
    } catch (error) {
      res.status(500).json({ message: "Error deleting order", error });
    }
  },
};
export default OrderController;
