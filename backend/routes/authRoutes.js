import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.delete("/logout", AuthController.logout);

export default router;
