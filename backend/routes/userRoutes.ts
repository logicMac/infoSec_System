import express from "express";
import { userController } from "../controller/userController";

const router = express.Router();

router.post('/registerUser', userController.registerUser);

export default router;