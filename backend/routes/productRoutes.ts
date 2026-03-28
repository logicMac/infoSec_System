import express from "express";
import productController from "../controller/productController";
import upload from "../middlewares/upload";
import {verifyToken} from "../middlewares/authMiddleware";

const router = express.Router();

//routes for product controller
router.use("/saveProduct", verifyToken, upload.single("image"),productController.saveProduct);
router.use("/deleteProduct", productController.deleteProduct);

//export route
export default router;
