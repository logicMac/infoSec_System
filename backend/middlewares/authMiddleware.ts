import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../index";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function verifyToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Guard: JWT must look like <header>.<payload>.<signature>
    if (!token || typeof token !== "string" || token.split(".").length !== 3) {
        return res.status(403).json({
            message: "Invalid or expired token",
            devError: { name: "JsonWebTokenError", message: "jwt malformed" }
        });
    }

    try {
        const decoded = jwt.verify(token as string, JWT_SECRET) as { id: number, username: string, role: string };

        req.user = decoded;

        next();
    } catch (error) {
        console.error("JWT Verification failed because:", error);
        
        return res.status(403).json({ message: "Invalid or expired token", devError: error});
    }       
}   