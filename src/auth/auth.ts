import { 
    type NextFunction,
    type Request, 
    type Response 
} from "express";

import jwt, { type Secret } from "jsonwebtoken";
import { updateToken } from "../db/user.js";
import { AppError, type Tokens } from "../types/types.js";

export const generateUserSession = async (userId: number):Promise<Tokens>=> {
    const accessSecret = process.env["ACCESS_TOKEN_SECRET"] as Secret;
    const refreshSecret = process.env["REFRESH_TOKEN_SECRET"] as Secret;
    const expiryStr = process.env["REFRESH_TOKEN_EXPIRY"];

    if (!accessSecret || !refreshSecret || !expiryStr) {
        throw new AppError("Server configuration missing", 500);
    }

    const refreshExpirySeconds = Number(expiryStr);
    const accessToken = jwt.sign({ id: userId }, accessSecret, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userId }, refreshSecret, { expiresIn: refreshExpirySeconds });
    const expiry = new Date(Date.now() + refreshExpirySeconds * 1000);
    const success = await updateToken(refreshToken, expiry, userId);
    if (!success) {
        throw new AppError("Session creation failed: User not found", 404);
    }
    
    return { accessToken, refreshToken };
};

export const checkRefreshToken = async (refreshToken:string):Promise<number> => {
    const key = process.env["REFRESH_TOKEN_SECRET"] as Secret;
    const decoded = jwt.verify(refreshToken, key) as { id: number };
    return decoded.id;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction):Promise<void | Response<any, Record<string, any>>> => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const key = process.env["ACCESS_TOKEN_SECRET"] as Secret;
    return jwt.verify(token, key, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }
        (req as any).user = { id: decoded.id };  
        return next();
    });
};


