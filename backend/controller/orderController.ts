import { Request, Response } from "express"
import productModel from "../model/productModel";
import orderModel from "../model/orderModel"
import { AuthRequest } from "../index";

const orderController = {
    orderProduct: async (req: AuthRequest, res: Response) => {
        const product_id: any = req.params.id;
        const userId = req.user?.id;
        const {quantity, orderDetails} = req.body || {};
        const {price, payment_method, size, Vat} = orderDetails || {};

        if (!product_id) {
            return res.status(400).json({
                success: false,
                msg: "Failed to send product to backend"
            });
        }

        const [isProductExist]: any = await productModel.getProductById(product_id);

        if (isProductExist.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "Product does not exist"
            })
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                msg: "Unauthorized: user not found"
            })
        }
        
        try {
            const totalPrice = Number(quantity) * Number(price) + Number(Vat);
            const order: any = await orderModel.orderProduct(
                product_id,
                userId,
                String(quantity),
                String(totalPrice),
                payment_method,
                size,
                String(Vat)
            );

            res.status(200).json({
                success: true,
                msg: "Order Placed Successfully",
                product: { order }
            });

        } catch (err) {
            console.error("orderProduct failed:", err);
            res.status(500).json({
                success: false,
                msg: "Internal Server Error",
                devError: err
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