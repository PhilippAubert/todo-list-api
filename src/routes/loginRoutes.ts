import express from "express";
import { 
    login_get,
    login_post,
    logout,
    signup_get, 
    signup_post, 
    token_refresh
} from "../controller/authController.js";

const authRouter = express.Router();

authRouter.route("/register")
    .get(signup_get)
    .post(signup_post);

authRouter.route("/login")
    .get(login_get)
    .post(login_post);

authRouter.route("/logout")
    .post(logout);

authRouter.route("/refresh").post(token_refresh);


export default authRouter;