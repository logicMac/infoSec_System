import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../index.ts";

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

    try {
        const decoded = jwt.verify(token as string, JWT_SECRET) as { userId: number };

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }       
}   