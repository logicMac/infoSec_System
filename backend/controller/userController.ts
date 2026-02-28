import { Request, Response } from "express";
import dotenv from "dotenv";
import userModel from "../model/userModel.ts";
import serviceModel from "../model/serviceModel.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmailOtp } from "../services/emailService.ts";
dotenv.config();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
} 

interface expressParams {
    req: Request,
    res: Response
}

export const userController =  {

    //register controllerr
    registerUser: async (req: Request, res: Response) => {
        const {username, password, role, phone_Number, email} = req.body || {};

        // Validate required fields FIRST before any database operations
        if (!username || !password || !role || !phone_Number || !email) {
            return res.status(400).json({
                success: false, 
                msg: "All fields are required (username, password, role, phone_Number, email)"
            });
        }
        
        try {
            //find if the user is already registered by usedrname
            const existingUser: any = await userModel.getAllByUsername(username);
            //find if the email already exists
            const existingMail: any = await userModel.getByEmail(email);

            // Add null check to prevent internal server error
            if (existingUser && existingUser.length > 0) {
                return res.status(400).json({
                    success: false, 
                    msg: "User already exists"
                }); 
            }

            //validate query if there is an existing email
            if (existingMail && existingMail.length > 0) {

                //return response
                return res.status(400).json({
                    success: false,
                    msg: "Email already exists"
                });
            }

            //hash users entered password
            const hashPassword = await bcrypt.hash(password, 10);

            ////register user if he meets all the requirements 
            const registerUser = await userModel.registerUser({
                username, 
                password: hashPassword, 
                role, 
                phone_Number,
                email
            });

            //return response
            return res.status(201).json({
                success: true, 
                user: registerUser,
                msg: "User created successfully"
            });


        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false, 
                msg: "Internal Server Error"
            });
        }

    },
    
    //login controller
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
            //get user by username
            const user: any = await userModel.getAllByUsername(username);

            // Add null check for user to prevent internal server error
            if (!user || user.length === 0) {
                return res.status(400).json({
                    success: false,
                    msg: "User not found"
                });
            } 

            const userPassword = user[0];
            
            //validate if password match user's entered password
            const isMatch = await bcrypt.compare(password, userPassword.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    msg: "Password does not match"
                });
            }
    
            //call the generateOtp function to generate otp
            const otp: any = generateOTP();
            // Pass user_id to saveOtp to link OTP with the user
            await serviceModel.saveOtp(otp, userPassword.user_id);
            
            // Send OTP and log the result
            console.log(">>> Calling sendOtp with phone:", userPassword.phone_Number);
            const emailResult = await sendEmailOtp(otp, userPassword.email);
            console.log(">>> EMAIL Result:", emailResult);

            //retrurn response
            res.status(200).json({
                success: true,
                msg: "Session Created",
                user: {
                    username: userPassword.username,
                    user_id: userPassword.user_id,
                    role: userPassword.role
                },
                emailResult
            }); 

        //error catching
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({
                success: false,
                msg: error
            })
        }
    },

    //verify user controller
    verifyUser: async (req: Request, res: Response) => {
        const {user_id, otp} = req.body || {};

        //validate first if there is data sent to backend 
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
