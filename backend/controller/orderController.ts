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

        console.log("[OrderController] Received order request:", {
            product_id,
            userId,
            quantity,
            orderDetails
        });

        if (!product_id) {
            return res.status(400).json({
                success: false,
                msg: "Product ID is required"
            });
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                msg: "Unauthorized: Please login first"
            })
        }

        if (!quantity || !price || !payment_method) {
            return res.status(400).json({
                success: false,
                msg: "Missing required order details (quantity, price, payment_method)"
            });
        }

        try {
            const [isProductExist]: any = await productModel.getProductById(product_id);

            if (!isProductExist || isProductExist.length === 0) {
                return res.status(404).json({
                    success: false,
                    msg: "Product does not exist"
                })
            }

            const totalPrice = Number(quantity) * Number(price) + Number(Vat || 0);
            
            console.log("[OrderController] Placing order with total:", totalPrice);
            
            const order: any = await orderModel.orderProduct(
                product_id,
                userId,
                String(quantity),
                String(totalPrice),
                payment_method,
                size || 'M',
                String(Vat || 0)
            );

            console.log("[OrderController] Order placed successfully");

            res.status(200).json({
                success: true,
                msg: "Order Placed Successfully",
                data: { 
                    order_id: order.result.insertId,
                    total_price: totalPrice
                }
            });

        } catch (err: any) {
            console.error("[OrderController] Error:", err);
            res.status(500).json({
                success: false,
                msg: "Failed to place order",
                error: err.message
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