import { 
    type Request, 
    type Response 
} from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { validateLogin, validateUser } from "../validation/userValidate.js";
import { createToken } from "../auth/auth.js";
import { getUserByEmail, registerUser } from "../db/user.js";

dotenv.config();

export const signup_get = (_req:Request, res:Response) => {
    res.send("THIS IS THE DUMMY REGISTER PAGE");
};

export const login_get = (_req:Request, res:Response) => {
    res.send("THIS IS THE DUMMY LOGIN PAGE");
}

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
        if (auth) {
            const token = await createToken(user?.id);
            res.cookie("jwt", token, {httpOnly:true, maxAge : (Number(process.env["ACCESS_TOKEN_EXPIRY"]) * 10)});    
            res.status(201).json({message: "LOGIN SUCCESSFUL", user: user.id});
            return;
        }
    } catch (e){
        if (e instanceof Error){
            res.status(500).json({error: e});
            return;
        }
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
            res.status(401).json("Could not create user");
            return;
        }
        const token = await createToken(newSignup?.insertId);
        res.cookie("jwt", token, {httpOnly:true, maxAge : (Number(process.env["ACCESS_TOKEN_EXPIRY"]) * 10)});
        res.status(201).json({user: newSignup?.insertId});
    } catch (err) {
        if ((err as any).code === "ER_DUP_ENTRY") {
            return res.status(400).json({ errors: ["Email is already in use."] });
        }
        res.status(500).json({ error: "There was an error registering the user." });
    }
    return;
};

export const logout = (_req: Request, res:Response) => {
    res.cookie("jwt", "", {maxAge:1});
    res.redirect("/login");
};