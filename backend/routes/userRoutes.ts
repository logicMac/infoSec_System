import express from "express";
import { userController } from "../controller/userController";

const router = express.Router();

router.post('/registerUser', userController.registerUser);
router.post('/loginUser', userController.loginUser);
router.post('/verifyUser', userController.verifyUser);

export default router;
