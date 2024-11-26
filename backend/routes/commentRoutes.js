import CommentController from "../controllers/CommentController.js";
import { Router } from "express";

const router = Router();

router.get("/foods/:id/comments", CommentController.list);
router.post("/foods/:id/comments", CommentController.create);
router.put("/foods/:foodId/comments/:commentId", CommentController.update);
router.delete("/foods/:foodId/comments/:commentId", CommentController.delete);

export default router;
