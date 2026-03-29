import express from "express"
import productController from "../controller/productController"
import upload from "../middlewares/upload"
import { verifyToken } from "../middlewares/authMiddleware"

const router = express.Router();

//routes for product controller
router.post("/saveProduct", verifyToken, upload.single("image"),productController.saveProduct)
router.delete("/deleteProduct", verifyToken, productController.deleteProduct)
router.get("/getProducts", productController.getProducts)

//export route
export default router;
