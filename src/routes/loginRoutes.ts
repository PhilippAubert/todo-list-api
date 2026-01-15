import express from "express";
import { 
    login_get,
    login_post,
    logout,
    signup_get, 
    signup_post 
} from "../controller/authController.js";

const router = express.Router();

router.get("/register", signup_get);
router.post("/register", signup_post);
router.get("/login", login_get);
router.post("/login", login_post);
router.get("/logout", logout);

export default router;