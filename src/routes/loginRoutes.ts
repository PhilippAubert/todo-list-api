import express from "express";

const router = express.Router();

export const register = router.get("/register", (_req, res) => {
    res.send("TRYING TO REGISTER")
});

export const login = router.get("/login", (_req, res) => {
    res.send("TRYING TO LOGIN");
});


export default router;