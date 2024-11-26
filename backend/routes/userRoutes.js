import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = Router();

router.get("/", UserController.list);
router.get("/:username", UserController.read);
router.patch("/:username", UserController.update);
router.delete("/:username", UserController.delete);

router.get("/:username/foods", UserController.listFoods);

export default router;
