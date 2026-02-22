import { Request, Response } from "express";
import dotenv from "dotenv";
import userModel from "../model/userModel.ts";
import serviceModel from "../model/serviceModel.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendOtp } from "../services/smsService.ts";

dotenv.config();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
} 

interface expressParams {
    req: Request,
    res: Response
}

export const userController =  {
    registerUser: async (req: Request, res: Response) => {
        const {username, password, role, phone_Number} = req.body || {};

        // Validate required fields FIRST before any database operations
        if (!username || !password || !role || !phone_Number) {
            return res.status(400).json({
                success: false, 
                msg: "All fields are required (username, password, role, phone_Number)"
            });
        }
        
        try {
            const existingUser: any = await userModel.getAllByUsername(username);

            // Add null check to prevent internal server error
            if (!existingUser || existingUser.length > 0) {
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

        // Validate required fields FIRST
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                msg: "Username and password are required"
            })
        }

        try {
            const user: any = await userModel.getAllByUsername(username);

            // Add null check for user to prevent internal server error
            if (!user || user.length === 0) {
                return res.status(400).json({
                    success: false,
                    msg: "User not found"
                });
            } 

            const userPassword = user[0];
            
            const isMatch = await bcrypt.compare(password, userPassword.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    msg: "Password does not match"
                });
            }
            
            const otp: any = generateOTP();
            // Pass user_id to saveOtp to link OTP with the user
            await serviceModel.saveOtp(otp, userPassword.user_id);
            
            // Send OTP and log the result
            console.log(">>> Calling sendOtp with phone:", userPassword.phone_Number);
            const smsResult = await sendOtp(otp, userPassword.phone_Number);
            console.log(">>> SMS Result:", smsResult);

            res.status(200).json({
                success: true,
                msg: "Session Created",
                user: {
                    username: userPassword.username,
                    user_id: userPassword.user_id,
                    role: userPassword.role
                },
                smsResult,
                otp
            }); 

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({
                success: false,
                msg: "Internal Server Error"
            })
        }
    },

    verifyUser: async (req: Request, res: Response) => {
        const {user_id, otp} = req.body || {};

        if (!user_id || !otp) {
            return res.status(400).json({
                success: false,
                msg: "No auth data sent to backend"
            });
        }

        try {
            const getUser: any = await userModel.getById(user_id);

            if (!getUser || getUser.length === 0) {
                return res.status(400).json({
                    success: false,
                    msg: "User not found"
                });
            }

            const user = getUser[0];

            const isMatch: any = await serviceModel.verifyOtp(otp, user_id); 
            if (!isMatch || isMatch.length === 0) {
                return res.status(400).json({
                    success: false,
                    msg: "Otp does not match"
                });
            } 

            const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
            const JWT_EXPIRES: string = process.env.JWT_EXPIRES || "1h";

            const token = jwt.sign(
                {id: user.user_id, username: user.username, role: user.role},
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES } as any, 
            );

            return res.status(200).json({
                success: true,
                token,
                msg: "User verified successfully"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                msg: "Internal Server Error"
            });
        }
    }
}
