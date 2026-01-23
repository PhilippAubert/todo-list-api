import { 
    type Request, 
    type Response 
} from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { 
    validateLogin, 
    validateUser } 
from "../validation/userValidate.js";

import { 
    checkRefreshToken, 
    generateUserSession 
} from "../auth/auth.js";

import { 
    getUserByEmail, 
    refreshSession, 
    registerUser, 
    updateToken } 
from "../db/user.js";

import { AppError } from "../types/types.js";

dotenv.config();

export const signup_get = (_req:Request, res:Response) => {
    res.send("THIS IS THE DUMMY REGISTER PAGE");
};

export const login_get = (_req:Request, res:Response) => {
    res.send("THIS IS THE DUMMY LOGIN PAGE");
}

export const token_refresh = async (req: Request, res: Response) => {
    const refreshToken = req.headers["x-refresh-token"] as string;

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token missing" });
    }

    try {
        const userId = await checkRefreshToken(refreshToken);
        const refreshed = await refreshSession(userId, refreshToken);

        if (!refreshed) {
            throw new AppError("Invalid or expired refresh session", 403);
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateUserSession(userId);
        
        res.header("Authorization", `Bearer ${accessToken}`);
        return res.status(200).json({accessToken, refreshToken: newRefreshToken});
    } catch (e) {
        if (e instanceof AppError) {
            return res.status(e.status).json({ error: e.message });
        }
        return res.status(403).json({ error: "Refresh failed" });
    }
};


export const login_post = async (req:Request, res:Response) => {
    const { email, password } = req.body;
    
    const validation = await validateLogin({email, password});
    if (!validation.valid) {
        return res.status(400).json({ errors: validation.errors });
    }
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            res.status(401).json({message: "you're unauthorized, yo"});
            return;
        }
        const auth = await bcrypt.compare(password, user?.password);
        if (!auth) {
            res.status(401).json({message: "cannot authenticate, yo"});
            return;
        }

        const { accessToken, refreshToken } = await generateUserSession(user.id);

        res.header("Authorization", `Bearer ${accessToken}`);
        return res.status(200).json({message: "Login successful", accessToken, refreshToken});
    } catch (e) {
        if (e instanceof AppError) {
            return res.status(e.status).json({ error: e.message });
        }
        console.error("Unexpected Error:", e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
    return;
};

export const signup_post = async (req:Request, res:Response) => {
    const {name, email, password} = req.body;

    const validation = await validateUser({ name, email, password });
    if (!validation.valid) {
        return res.status(400).json({ errors: validation.errors });
    }

    try {
        const hashedPW = await bcrypt.hash(password, 10);
        const newSignup = await registerUser(name, email, hashedPW);
        if (!newSignup) {
            return res.status(401).json("Could not create user");
        }
        const { accessToken, refreshToken } = await generateUserSession(newSignup.insertId);

        res.header("Authorization", `Bearer ${accessToken}`);
        return res.status(200).json({message: "Login successful", accessToken, refreshToken});
    } catch (err) {
        if ((err as any).code === "ER_DUP_ENTRY") {
            return res.status(400).json({ errors: ["Email is already in use."] });
        }
        return res.status(500).json({ error: "There was an error registering the user." });
    }
};

export const logout = async (req: Request, res: Response):Promise<Response> => {
    try {
        const userId = (req as any).user.id;
        await updateToken(null, null, userId);
        return res.status(200).json({ 
            message: "Logged out successfully. Session invalidated." 
        });
    } catch (e) {
        return res.status(500).json({ error: "Logout failed" });
    }
};
