import { Request, Response } from "express"
import productModel from "../model/productModel";
import orderModel from "../model/orderModel"
import { AuthRequest } from "../index";

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

        const [isProductExist]: any = await productModel.getProductById(product_id);

        if (!isProductExist && isProductExist.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "Product does not exist"
            })
        }

        if (!userId) {
            return res.status(404).json({
                success: false,
                msg: "Unauthorized: user not found"
            })
        }
        
        try {

            const order: any = await orderModel.orderProduct(product_id);

            res.status(200).json({
                success: false,
                msg: "Order Placed Successfully",
                product: {order}
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                msg: "Internal Server Error"
            });
        }
    },

    cancelOrder: async (req: AuthRequest, res: Response) => {
        const product_id = req.user?.id;

        try {
            
        } catch (err) {
            res.status(500).json({
                success: false,
                msg: "Internal Server Error"
            });
        }
    }
}

export default orderController;