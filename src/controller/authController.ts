import { 
    type Request, 
    type Response 
} from "express";
import bcrypt from "bcryptjs";

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

    const validation = await validateUser({ name, email, password });

    if (!validation.valid) {
        return res.status(400).json({ errors: validation.errors });
    }

    const hashedPW = await bcrypt.hash(password, 10);

    try {
        const newSignup = await registerUser(name, email, hashedPW);
        res.status(201).json(newSignup);
    } catch (err) {
        if ((err as any).code === "ER_DUP_ENTRY") {
            return res.status(400).json({ errors: ["Email is already in use."] });
        }
        res.status(500).json({ error: "There was an error registering the user." });
    }
    return;
}

export const logout_post = (_req: Request, res:Response) => {
    res.send("LOGGING OUT!");
}