import express from "express";
import { uploadImage } from "../controller/uploadController";

const router = express.Router();

router.use("/uploadImage", uploadImage);

export default router;
