import  express  from "express";
import orderController from "../controller/orderController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/orderProduct/:id", verifyToken, orderController.orderProduct);

export default router;