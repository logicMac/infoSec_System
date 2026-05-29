import { Request, Response } from "express";
import { AuthRequest } from "../index";
import { getUserOrders } from "../model/customerOrderModel";


export class customerOrderController {
    public getCustomerOrders = async(req: Request, res: Response): Promise<Response | void>  => {
        const customerId = req.user?.id;    
        
        if (!customerId) {
            return res.status(400).json({
                success: false,
                msg: "Failed to retrieve orders"
            })
        }

        try {
            const userOrders = await getUserOrders(customerId);

            return res.status(200).json({
                success: false,
                data: userOrders 
            });

        } catch(err) {
            return res.status(500).json({
                success: false,
                msg: err instanceof Error || "Internal Server Error"
            })
        } 
    }
}