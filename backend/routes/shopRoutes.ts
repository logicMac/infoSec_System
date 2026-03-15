import  express  from "express";
import shopController from "../controller/shopController";

const router = express.Router();

router.use("/submitSellerApplication", shopController.registerShop);

export default router;