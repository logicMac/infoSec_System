import {Request, Response } from "express";
import productModel from "../model/productModel";

const productController = {
    saveProduct: async (req: Request, res: Response) => {
        const {product_name, product_description, price, stock, image, size } = req.body || {};


        if (!product_name || !product_description || !price) {
            return res.status(400).json({
                success: false,
                msg: "Please provide all fields that needs for product"
            })
        }


        try {
            const ifExist: any = await productModel.getProductByName(product_name);
            const exist = ifExist[0];

            if (exist && exist.length > 0) {
                return res.status(400).json({
                    success: false,
                    msg: "Product already exists"
                });
            } 

            const product = await productModel.getAllProduct();

            return res.status(200).json({
                success: true,
                msg: "Product saved successfully",
                product
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                msg: "Interal Server error"
            });
        }
    },
    
    deleteProduct: async(req: Request, res: Response) => {
        const {product_id} = req.body || {};

        if(!product_id) {
            return res.status(400).json({
                success: false,
                msg: "No id sent to backend"
            });
        }

        try {
            const deleteById: any = await productModel.deleteProductById(product_id);
            const deleted = deleteById[0];

            if (!deleted && deleted.length > 0) { 
                return res.status(400).json({
                    success: false,
                    msg: "Product not found"
                });
            }

            res.status(200).json({
                success: true,
                msg: "Product deleted Successfully"
            })
            
        } catch (error) {
            res.status(500).json({
                success: false,
                msg: "Internal Server Error" 
            })
        }
    } 
}

export default productController;