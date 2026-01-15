import { 
    type Request, 
    type Response 
} from "express";

import { registerUser } from "../db/db.js";
import { validateUser } from "../validation/userValidate.js";

export const signup_get = (_req:Request, res:Response) => {
    res.send("GET SIGNED USER");
};

export const login_post = (_req:Request, res:Response) => {
    res.send("NEW SIGN UP!");
};

export const login_get = (_req:Request, res:Response) => {
    res.send("GETTING LOGIN DATA");
}

export const signup_post = async (req:Request, res:Response) => {
    const {name, email, password} = req.body;

    const validation = validateUser({ name, email, password });

    if (!validation.valid) {
        return res.status(400).json({ errors: validation.errors });
    }
    
    try {
        const newSignup = await registerUser(name, email, password);
        res.status(201).json(newSignup);
    } catch (err) {
        console.error(err);
        res.status(400).json("There was an error!");
    }
    return;
}

export const logout_post = (_req: Request, res:Response) => {
    res.send("LOGGING OUT!");
}