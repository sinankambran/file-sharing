import express from "express";
import { UploadController, DownloadController } from "../controller/uploadController.js";
import storage from "../middleware/upload.js";

const router = express.Router();

// Route: POST /upload
// Handles file upload with multer middleware
router.post("/upload", storage.single("file"), UploadController);

// Route: GET /files/:fileId
// Handles file download by ID
router.get("/files/:fileId", DownloadController);

export default router;
