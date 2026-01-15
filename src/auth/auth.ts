import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export const createToken = async (id:Number) => {
    const maxAge = process.env["ACCESS_TOKEN_EXPIRY"] as StringValue;
    if (process.env["ACCESS_TOKEN_SECRET"]) {
        return jwt.sign({id}, process.env["ACCESS_TOKEN_SECRET"], {expiresIn:maxAge});
    }
    return;
}
