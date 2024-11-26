import { Router } from "express";
import CartController from "../controllers/CartController.js";

const router = Router();

router.get("/", CartController.list);
router.post("/", CartController.create);
router.delete("/:id", CartController.delete);
router.delete("/", CartController.deleteAll);

router.get("/users/:username", CartController.listUserCart);

export default router;
