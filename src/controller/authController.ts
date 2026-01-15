import { type Request, type Response } from "express";

export const signup_get = (_req:Request, res:Response) => {
    res.send("GET SIGNED USER");
};

export const signup_post = (_req:Request, res:Response) => {
    res.send("NEW SIGN UP!");
};

export const login_get = (_req:Request, res:Response) => {
    res.send("GETTING LOGIN DATA");
}

export const login_post = (_req:Request, res:Response) => {
    res.send("LOGGING IN");
}

export const logout_post = (_req: Request, res:Response) => {
    res.send("LOGGING OUT!");
}