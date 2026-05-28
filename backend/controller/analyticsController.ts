import { Request, Response } from "express";
import { AuthRequest } from "../index";
import { getUserStats } from "../model/analyticsModel";

export class analyticsController {
    //Get user statistcs controller 
    public getUserStats = async(req: Request, res: Response): Promise<Response | void> => {
        const customerId = Number(req.params.id);
        
        if (!customerId || isNaN(customerId)) {
            return res.status(400).json({
                success: false,
                msg: "Invalid customer ID"
            });
        }
        
        try {   
            const stats = await getUserStats(customerId);
            
            console.log(`[Analytics] Found ${stats.length} records for customer ${customerId}`);

            return res.status(200).json({
                success: true,
                data: stats
            }); 
        } catch (err) {
            console.error("[Analytics] Error:", err);
            return res.status(500).json({
                success: false,
                msg: err instanceof Error ? err.message : "Internal Server Error"
            });
        }
    };

    //Get analytics controller 
    public getAnalytics = async(req: Request, res: Response): Promise<Response | void> => {
        const userId = Number(req.params.id);

        try {
            const analytics = await getUserStats(userId);

            return res.status(200).json({
                success: true,
                data: analytics,
                msg: "Fetched Data"
            });

        } catch (err) {
            return res.status(500).json({
                success: false,
                msg: err instanceof Error || "Internal Server Error"
            })
        }
    }
}