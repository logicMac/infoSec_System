import express from "express";
import productController from "../controller/productController";
import upload from "../middlewares/upload";

const router = express.Router();

router.use("/saveProduct", upload.single("image"),productController.saveProduct);

export default router;
