import { 
    type NextFunction,
    type Request, 
    type Response 
} from "express";

import jwt, { type Secret } from "jsonwebtoken";
import type { StringValue } from "ms";

export const createToken = async (id:Number | undefined): Promise<string | undefined> => {
    if (!id){
        return "No user found";
    }
    const maxAge = process.env["ACCESS_TOKEN_EXPIRY"] as StringValue;
    if (process.env["ACCESS_TOKEN_SECRET"]) {
        return jwt.sign({id}, process.env["ACCESS_TOKEN_SECRET"], {expiresIn:maxAge});
    }
    return;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
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
