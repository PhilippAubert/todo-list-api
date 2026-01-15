import { 
    type NextFunction,
    type Request, 
    type Response 
} from "express";

import jwt, { type Secret } from "jsonwebtoken";

import type { StringValue } from "ms";

export const createToken = async (id:Number) => {
    const maxAge = process.env["ACCESS_TOKEN_EXPIRY"] as StringValue;
    if (process.env["ACCESS_TOKEN_SECRET"]) {
        return jwt.sign({id}, process.env["ACCESS_TOKEN_SECRET"], {expiresIn:maxAge});
    }
    return;
}

export const requireAuth = (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies["jwt"];
    const key = process.env["ACCESS_TOKEN_SECRET"] as Secret;
    if (token) {
        jwt.verify(token, key, (err:any , decoded: any) => {
            if (err) {
                console.log(err);
                res.redirect("/login");
            } else {
                console.log(decoded);
                next();
            }
        })
    }
    else {
        res.redirect("/login");
    }
}