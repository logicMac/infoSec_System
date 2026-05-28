import { Router } from "express";
import { analyticsController } from "../controller/analyticsController";
const router = Router();

const controller = new analyticsController();

router.get("/stats/:id", controller.getUserStats);


export default router;