import { Request, Response } from "express";
import dotenv from "dotenv";
import userModel from "../model/userModel.ts";
import serviceModel from "../model/serviceModel.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();

function generateOTP() {
    return Math.floor(100000 + Math.random() & 900000);
} 

interface expressParams {
    req: Request,
    res: Response
}

export const userController =  {
    registerUser: async (req: Request, res: Response) => {
        const {username, password, role, phone_Number} = req.body || {};
        const existingUser: any = await userModel.getAllByUsername(username);

            if (!username || !password || !role || ! phone_Number) {
                return res.status(400).json({
                    success: false, 
                    msg: "Error registration"
                });
            }
            
        try {
            if (existingUser.length === 1) {
                return res.status(400).json({
                    success: false, 
                    msg: "User already exists"
                }); 
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const registerUser = await userModel.registerUser({
                username, 
                password: hashPassword, 
                role, 
                phone_Number
            });

            return res.status(200).json({
                success: true, 
                user: {registerUser},
                msg: "User created successfully"
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false, 
                msg: "Internal Server Error"
            });
        }
    },
    
    loginUser: async(req: Request, res: Response) => {
        const {username, password} = req.body || {};
        const user: any = await userModel.getAllByUsername(username);
        const userPassword = user[0];

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                msg: "Error Login"
            })
        }

        try {

            if (user.length === 0) {
                return res.status(400).json({
                    success: false,
                    msg: "User not found"
                });
            } 
            
            const isMatch = await bcrypt.compare(password, userPassword.password);
            if (!isMatch) {
                return res.status(400).json({
                    succes: false,
                    msg: "Password does not match"
                });
            }
            
            const otp: any = generateOTP();
            await serviceModel.saveOtp(otp);

            res.status(200).json({
                success: true,
                msg: "Session Created",
                user: {
                    username,
                    user_id: userPassword.user_id
                },
                otp
            }); 

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                msg: "Internal Server Error"
            })
        }
    },

    verifyUser: async ({req, res}: expressParams) => {
        const {user_id, otp} = req.body || {};

        if (!user_id || !otp) {
            return res.status(400).json({
                success: false,
                msg: "No auth data sent to backend"
            });
        }

        try {
            const getUser = await userModel.getById(user_id);

            const isMatch = await serviceModel.verifyOtp(otp); 
            if (isMatch.length === 0) {
                return res.status(400).json({
                    success: false,
                    msg: "Otp does not match"
                });
            } 

            const user = getUser[0];

            const token = jwt.sign(
                {id: user.user_id}
            )

        } catch (error) {
            console.error(error);
        }
    }
}
