import {Request, Response } from "express";
import productModel from "../model/productModel";
import { AuthRequest } from "../index";

//product controller
const productController = {
    saveProduct: async (req: AuthRequest, res: Response) => {
        const {
            product_name, 
            product_description, 
            price, 
            stock, 
            image, 
            SKU, 
            weight, 
            size,
            variants,
            category_name,
            brand 
        } = req.body || {};

        const imagePath = req.file ? req.file.filename : null; 
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                msg: "Unauthorized: user not found",
            });
        }

        //validate the fields first 
        if (!product_name || !product_description || !price || !stock || !SKU || !imagePath) {
            return res.status(400).json({
                success: false,
                msg: "Please provide all fields that needs for product"
            })
        }

        try {
            //check if any product exists in the database
            const ifExist: any = await productModel.getProductByName(product_name);
            const exist = ifExist[0];

            //validation if there is product
            if (exist && exist.length > 0) {
                return res.status(400).json({
                    success: false,
                    msg: "Product already exists"
                });
            } 

            //Fetch product from database 
            const product = await productModel.getAllProduct();

            //pass product to the model 
            await productModel.saveProduct(
                {
                    product_name, product_description, 
                    price, stock, image: imagePath, SKU, weight, 
                    size, variants, category_name, brand, userId
                }
            )

            //return response
            return res.status(200).json({
                success: true,
                msg: "Product saved successfully",
                product
            });

        //catch error if try fails    
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                msg: "Interal Server error"
            });
        }
    },
    

    deleteProduct: async(req: Request, res: Response) => {
        const {product_id} = req.body.params || {};

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