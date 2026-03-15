import { Request, Response } from "express"
import shopModel from "../model/shopModel";

//Shop controller
const shopController = {
    registerShop: async(req: Request, res: Response) => {
        const{id, shop_name, shop_description, shop_logo, status, document_type, document_file} = req.body || {};

        //validate if there's data 
        if (! !id || !shop_name || !shop_description || !shop_logo || !status || !document_type || !document_file) {
            return res.status(400).json({
                success: false,
                msg: "Shop details not sent to backend"
            });
        }

        try {
            //validate first if the shop already exists 
            const existingShop = await shopModel.getShopName(shop_name);
            if (existingShop) {
                return res.status(400).json({
                    success: false,
                    msg: "Shop name already exists"
                });
            }

            //save shop details 
            const savedShop = await shopModel.saveShop(
                id, 
                shop_name, 
                shop_description, 
                shop_logo,
                status,
            );

            //get the generated shop id
            const shopId = savedShop.insertId;

            //save seller documents and fk of shop table 
            await shopModel.saveSellerDocs(
                shopId,
                document_type, 
                document_file
            );

            //return good response 
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