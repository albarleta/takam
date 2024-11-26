import { Router } from "express";
import OrderController from "../controllers/OrderController.js";

const router = Router();

router.get("/", OrderController.list);
router.post("/", OrderController.create);
router.get("/:id", OrderController.read);
router.patch("/:id", OrderController.update);
router.delete("/:id", OrderController.delete);

router.get("/users/:username", OrderController.listUserOrders);

export default router;
