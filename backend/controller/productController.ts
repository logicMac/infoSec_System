import express from "express";
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
            const ifExist = await productModel.getProductByName(product_name);

            if (ifExist && ifExist.length > 0) {
                return res.status(400).json({
                    success: false,
                    msg: "Product already exists"
                });
            } 

            const retrieveProduct = await productModel.getAllProduct();
            const product: any = retrieveProduct[0];

            return res.status(200).json({
                success: true,
                msg: "Product saved successfully",
                product
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                msg: "Interal Server error"
            });
        }
    }   
}