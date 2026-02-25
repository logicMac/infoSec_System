import express from "express";
import { userController } from "../controller/userController.ts";
import { verifyToken } from "../middlewares/authMiddleware.ts";
import upload from "../middlewares/upload.ts";

const router = express.Router();

router.post('/registerUser', userController.registerUser);
router.post('/loginUser', verifyToken,userController.loginUser);
router.post('/verifyUser', userController.verifyUser);

export default router;
