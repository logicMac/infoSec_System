import { Request, Response } from "express";
import { AuthRequest } from "../index";
import { getUserOrders, cancelOrder, fetchUserOrder, addToCart, updateOrderStatus } from "../model/customerOrderModel";

export class customerOrderController {
    //get customer orders
    public getCustomerOrders = async(req: Request, res: Response): Promise<Response | void>  => {
        const customerId = Number(req.params.id);    
        
        if (!customerId) {
            return res.status(400).json({
                success: false,
                msg: "Missing customerId"
            })
        }

        try {
            const userOrders = await getUserOrders(customerId);

            return res.status(200).json({
                success: true,
                data: userOrders 
            });

        } catch(error) {
            return res.status(500).json({
                success: false,
                msg: error instanceof Error ? error.message: "Internal Server Error"
            })
        } 
    }

    //add to cart
    public addToCart = async(req: AuthRequest, res:Response): Promise<Response | void> => {
        const productId = Number(req.params.id);
        const customerId = Number(req.user?.id);

        try {
            const result = await addToCart(productId, customerId);

            if (result.success) {
                return res.status(400).json({
                    success: false,
                    msg: "Cannot add to cart product"
                });
            }

            return res.status(200).json({
                success: true,
                msg: result.msg,
                data: result
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: error instanceof Error ? error.message: "Internal Server Error"
            });
        }
    }

    //cancel order
    public cancelOrder = async(req: AuthRequest, res:Response): Promise<Response | void> => {
        const {reason, orderId, productId} = req.body || {};
        const customerId = Number(req.user?.id);

        if(!reason || !orderId || !productId) {
            return res.status(400).json({
                success: false,
                msg: "Missing required fields"
            })
        }

        try {
            const [order] = await fetchUserOrder(orderId);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    msg: "Order not found"
                });
            }

            if (order.order_status === 'Shipped') {
                return res.status(400).json({
                    success: false,
                    msg: "Cannot cancel order that is already shipped"
                })
            }

            const result = await cancelOrder(reason, orderId, customerId, productId);

            return res.status(200).json({
                success: true,
                msg: result.msg,
                data: result
            })  

        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: error instanceof Error ? error.message: "Internal Server Error"
            });
        }
    }
    
    //update customer order status
    public updateCustomerOrderStatus = async(req: AuthRequest, res: Response): Promise<Response | void> => {
        const {order_status, orderId, customerId} = req.body || {};
        
        try {
            const result = await updateOrderStatus(order_status, orderId);

            if (!result.ok) {
                return res.status(400).json({
                    success: false,
                    msg: "Failed to update order status" 
                })
            }

            return res.status(200).json({
                success: true,
                msg: result.msg,
                data: result    
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: error instanceof Error ? error.message: "Internal Server Error"
            });
        }
    }
}