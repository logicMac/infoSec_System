import { Request, Response } from "express"
import { AuthRequest } from "../index";
import productModel from "../model/productModel";
import orderModel from "../model/orderModel"

const orderController = {
    orderProduct: async (req: AuthRequest, res: Response) => {
        const product_id: any = req.params.id;
        const userId = req.user?.id;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                msg: "Failed to send product to backend"
            });
        }

        const isProductExist = await productModel.getProductById(product_id);
        const result = isProductExist[0];

        if (!isProductExist && result.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "Product does not exist"
            })
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                msg: "Unauthorized: user not found"
            })
        }
        
        try {

        } catch (err) {
            res.status(500).json({
                success: false,
                msg: "Internal Server Error"
            });
        }
    }
}