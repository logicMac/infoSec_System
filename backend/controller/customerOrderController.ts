import { Request, Response } from "express";
import { AuthRequest } from "../index";
import { getUserOrders, cancelOrder } from "../model/customerOrderModel";

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
            const result = await cancelOrder(reason, orderId, customerId, productId);

            return res.status(200).json({
                success: true,
                msg: "Order cancellation succesfull",
                data: result
            })  

        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: error instanceof Error ? error.message: "Internal Server Error"
            });
        }
    }
}