import { Router } from "express";
import FoodController from "../controllers/FoodController.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.get("/", FoodController.list);
router.post("/", upload.single("image"), FoodController.create);
router.get("/:id", FoodController.read);
router.patch("/:id", upload.single("image"), FoodController.update);
router.delete("/:id", FoodController.delete);

export default router;
