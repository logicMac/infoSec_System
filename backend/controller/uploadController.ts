import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";  

export const uploadImage = async (req: Request, res: Response) => {
    try {

        //validate if theres file uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                msg: "No file uploaded" 
            });
        }

        //upload image to cloudinary 
        const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "ShopX_Commerce",
                resource_type: "image",
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
            stream.end(req.file?.buffer);
        });

        //save for future deletion
        const imageUrl = result.secure_url;
        const publicId = result.public_id;

        //return response 
        return res.status(200).json({
            success: true,
            msg: "Upload Successfull",
            data: {
                url: imageUrl,
                publicId: publicId
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: {message: 
                "Upload failed",
                error
            }
        })
    }
}
