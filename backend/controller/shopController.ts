import { Request, Response } from "express"
import shopModel from "../model/shopModel";

const shopController = {
    registerShop: async(req: Request, res: Response) => {
        const{id, shop_name, shop_description, shop_logo, status} = req.body || {};

        if (! !id || !shop_name || !shop_description || !shop_logo || !status) {
            return res.status(400).json({
                success: false,
                msg: "Shop details not sent to backend"
            });
        }

        try {
            const existingShop = await shopModel.getShopName(shop_name);
            if (existingShop) {
                return res.status(400).json({
                    success: false,
                    msg: "Shop name already exists"
                });
            }

            const savedShop = await shopModel.saveShop(id, shop_name, shop_description, shop_logo ,status);

            res.status(200).json({
                success: true, 
                msg: "Shop created Successfully",
                shop: {
                    savedShop
                }
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                msg: "Internal Server Error"
            })
        }
    }
}

export default shopController;