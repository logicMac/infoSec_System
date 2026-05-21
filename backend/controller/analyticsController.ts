import { Request, Response } from "express";
import analyticsModel from "../model/analyticsModel";

const analyticsController = {
    getUserStats: async (req: Request, res: Response) => {
        const customerId = req.params.id;

        try {
            const stats: any = await analyticsModel.getUserStats(customerId);
        } catch (err) {
            return {
                success: false,
                msg: err || "Internal Server Error"
            }
        } 
    }
}