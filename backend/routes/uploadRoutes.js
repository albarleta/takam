import express from "express";
import upload from "../middlewares/multer.js";
import UploadController from "../controllers/UploadController.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.post("/", upload.single("image"), UploadController.upload);

export default router;
